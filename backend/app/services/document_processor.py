import hashlib
import io
import re
from dataclasses import dataclass
from datetime import date

from docx import Document
from pypdf import PdfReader

CHAPTER_PATTERN = re.compile(r"^\s*(chương\s+[ivxlcdm\d]+\b.*)$", re.IGNORECASE)
ARTICLE_PATTERN = re.compile(r"^\s*(điều\s+\d+[a-z]?\b.*)$", re.IGNORECASE)
CLAUSE_PATTERN = re.compile(r"^\s*(\d+[.)]\s+.+)$", re.IGNORECASE)
DOCUMENT_TYPE_PATTERN = re.compile(r"^(LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|QUYẾT ĐỊNH|CHỈ THỊ|NGHỊ QUYẾT|QUY CHUẨN)\b", re.IGNORECASE)


@dataclass(frozen=True, slots=True)
class LegalMetadata:
    document_number: str | None = None
    legal_title: str | None = None
    issue_date: date | None = None
    expiration_date: date | None = None
    signer: str | None = None


def _date_from_match(match: re.Match[str] | None) -> date | None:
    if not match:
        return None
    try:
        return date(int(match.group(3)), int(match.group(2)), int(match.group(1)))
    except ValueError:
        return None


def extract_legal_metadata(text: str, filename: str = "") -> LegalMetadata:
    """Extract core Vietnamese legal-document metadata from OCR/native text."""
    normalized = re.sub(r"[ \t]+", " ", text.replace("\r", ""))
    number_match = re.search(r"(?i)Số\s*:\s*([0-9A-ZĐ.-]+(?:/[0-9A-ZĐ.-]+)+)", normalized)
    document_number = number_match.group(1).strip(" .") if number_match else None
    filename_number = re.sub(r"(?i)\.(pdf|docx?|txt)$", "", filename).strip()
    if "/" in filename_number and any(char.isdigit() for char in filename_number):
        document_number = filename_number

    metadata_header = re.split(r"(?i)\bCăn\s+cứ\b", re.sub(r"\s+", " ", normalized), maxsplit=1)[0]
    issue_match = re.search(r"(?i)ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})", metadata_header)
    expiry_match = re.search(r"(?i)(?:hết|chấm dứt)\s+hiệu lực(?:\s+thi hành)?[^\n]{0,80}?ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})", normalized)

    lines = [line.strip(" -") for line in normalized.splitlines() if line.strip()]
    flat = re.sub(r"\s+", " ", normalized[:12000]).strip()
    title_match = re.search(
        r"(?i)\b(?:LUẬT|NGHỊ\s+ĐỊNH|THÔNG\s+TƯ|QUYẾT\s+ĐỊNH|CHỈ\s+THỊ|NGHỊ\s+QUYẾT|QUY\s+CHUẨN)\b\s+(.{8,700}?)(?=\s+(?:Hà\s+Nội\s*,?\s*ngày|Căn\s+cứ|BỘ\s+TRƯỞNG|CHÍNH\s+PHỦ|Điều\s+1(?:\.|\s)))",
        flat,
    )
    legal_title = title_match.group(1).strip(" .;-") if title_match else None

    signer = None
    excluded = {"BỘ TRƯỞNG", "THỨ TRƯỞNG", "KT. BỘ TRƯỞNG", "TM. CHÍNH PHỦ", "NƠI NHẬN"}
    signature_lines = lines[-120:]
    role_indexes = [i for i, line in enumerate(signature_lines) if re.search(r"(?i)\b(bộ trưởng|thứ trưởng|chủ tịch|phó thủ tướng|tổng giám đốc|cục trưởng)\b", line)]
    candidates = signature_lines[(role_indexes[-1] + 1 if role_indexes else max(0, len(signature_lines) - 30)):]
    for line in reversed(candidates):
        compact = re.sub(r"\s+", " ", line).strip()
        words = compact.split()
        if 2 <= len(words) <= 7 and compact.upper() not in excluded and not re.search(r"[:;,.\d]", compact):
            if all(re.fullmatch(r"[A-ZÀ-ỸĐ][A-Za-zÀ-ỹĐđ]*", word) for word in words):
                signer = compact.title() if compact == compact.upper() else compact
                break
    return LegalMetadata(document_number, legal_title, _date_from_match(issue_match), _date_from_match(expiry_match), signer)


def content_hash(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def _sliding_parts(text: str, max_chars: int, overlap_chars: int) -> list[str]:
    if len(text) <= max_chars:
        return [text]
    parts: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + max_chars, len(text))
        if end < len(text):
            boundary = text.rfind("\n", start, end)
            if boundary <= start:
                boundary = text.rfind(". ", start, end)
            if boundary > start:
                end = boundary + 1
        part = text[start:end].strip()
        if part:
            parts.append(part)
        if end >= len(text):
            break
        start = max(end - overlap_chars, start + 1)
    return parts


def split_legal_text(
    text: str,
    page_number: int | None,
    max_chars: int = 2800,
    overlap_chars: int = 250,
) -> list[dict[str, object]]:
    """Split text at legal chapter/article/clause boundaries with bounded fallback chunks."""
    paragraphs = [line.strip() for line in re.split(r"\n+", text) if line.strip()]
    chunks: list[dict[str, object]] = []
    chapter: str | None = None
    article: str | None = None
    clause: str | None = None
    buffer: list[str] = []

    def flush() -> None:
        nonlocal buffer
        combined = "\n".join(buffer).strip()
        for part in _sliding_parts(combined, max_chars, overlap_chars):
            chunks.append(
                {
                    "content": part,
                    "page_number": page_number,
                    "chapter": chapter,
                    "article": article,
                    "clause": clause,
                    "content_hash": content_hash(part),
                }
            )
        buffer = []

    for paragraph in paragraphs:
        chapter_match = CHAPTER_PATTERN.match(paragraph)
        article_match = ARTICLE_PATTERN.match(paragraph)
        clause_match = CLAUSE_PATTERN.match(paragraph)
        if chapter_match:
            flush()
            chapter = chapter_match.group(1)
            article = None
            clause = None
        elif article_match:
            flush()
            article = article_match.group(1)
            clause = None
        elif clause_match:
            flush()
            clause = clause_match.group(1).split(maxsplit=1)[0].rstrip(".)")
        buffer.append(paragraph)
        if sum(len(item) for item in buffer) >= max_chars:
            flush()
    flush()
    return chunks


def extract_chunks_from_pdf(file_bytes: bytes) -> list[dict[str, object]]:
    reader = PdfReader(io.BytesIO(file_bytes))
    chunks: list[dict[str, object]] = []
    for page_index, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        ocr_used = False
        if len(re.sub(r"\s+", "", page_text)) < 40:
            page_text = _ocr_pdf_page(file_bytes, page_index)
            ocr_used = True
        page_chunks = split_legal_text(page_text, page_index + 1)
        for chunk in page_chunks:
            chunk["ocr_used"] = ocr_used
        chunks.extend(page_chunks)
    return chunks


def _ocr_pdf_page(file_bytes: bytes, page_index: int) -> str:
    try:
        import fitz
        import pytesseract
        from PIL import Image

        pdf = fitz.open(stream=file_bytes, filetype="pdf")
        page = pdf.load_page(page_index)
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        return pytesseract.image_to_string(image, lang="vie+eng")
    except Exception as exc:
        raise RuntimeError(f"OCR thất bại ở trang {page_index + 1}: {exc}") from exc


def extract_chunks_from_docx(file_bytes: bytes) -> list[dict[str, object]]:
    document = Document(io.BytesIO(file_bytes))
    text = "\n".join(p.text.strip() for p in document.paragraphs if p.text.strip())
    return split_legal_text(text, None)


def extract_chunks_from_txt(file_bytes: bytes) -> list[dict[str, object]]:
    try:
        text = file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = file_bytes.decode("latin-1")
    return split_legal_text(text, None)


def process_document_to_chunks(filename: str, file_bytes: bytes) -> list[dict[str, object]]:
    extension = filename.lower().rsplit(".", 1)[-1]
    if extension == "pdf":
        chunks = extract_chunks_from_pdf(file_bytes)
    elif extension in {"doc", "docx"}:
        chunks = extract_chunks_from_docx(file_bytes)
    else:
        chunks = extract_chunks_from_txt(file_bytes)
    for index, chunk in enumerate(chunks):
        chunk["chunk_index"] = index
    return chunks
