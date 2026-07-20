import asyncio
import hashlib
import io
import uuid

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from sqlalchemy import delete

from app.core.config import settings
from app.db.session import async_session_factory, engine
from app.models.document_upload import Document, DocumentChunk
from app.services.document_processor import extract_legal_metadata, process_document_to_chunks
from app.services.embedding_service import get_embedding, get_embeddings
from app.services.minio_client import get_document_data, upload_document
from app.tasks.celery_app import celery_app


@celery_app.task(name="app.tasks.indexing.process_document_task")
def process_document_task(document_id: str) -> None:
    asyncio.run(_run_document_task(document_id))


async def _run_document_task(document_id: str) -> None:
    try:
        await async_process_document(document_id)
    finally:
        await engine.dispose()


async def async_process_document(document_id: str, generate_embeddings: bool = True) -> None:
    document_uuid = uuid.UUID(document_id)
    async with async_session_factory() as session:
        document = await session.get(Document, document_uuid)
        if document is None:
            return
        document.status = "processing"
        document.error_message = None
        await session.commit()

        try:
            file_bytes = await asyncio.to_thread(_load_source_file, document)
            chunks = process_document_to_chunks(document.filename, file_bytes)
            if not chunks:
                raise ValueError("Không thể trích xuất nội dung hoặc tài liệu rỗng")

            full_text = "\n".join(str(chunk["content"]) for chunk in chunks)
            metadata = extract_legal_metadata(full_text, document.filename)
            document.document_number = metadata.document_number
            document.legal_title = metadata.legal_title
            document.issue_date = metadata.issue_date
            document.expiration_date = metadata.expiration_date
            document.signer = metadata.signer
            document.ocr_used = any(bool(chunk.get("ocr_used")) for chunk in chunks)
            headings: list[str] = []
            for chunk in chunks:
                for key in ("chapter", "article"):
                    heading = chunk.get(key)
                    if heading and str(heading) not in headings:
                        headings.append(str(heading))
            summary = "\n".join([document.filename, *headings[:20], full_text[:4000]])
            document.summary = summary
            document.content_hash = hashlib.sha256(full_text.encode("utf-8")).hexdigest()
            if generate_embeddings:
                try:
                    document.embedding = await get_embedding(summary, max_retries=3)
                except Exception:
                    document.embedding = None
            else:
                document.embedding = None

            await session.execute(
                delete(DocumentChunk).where(DocumentChunk.document_id == document.id)
            )
            batch_size = settings.EMBEDDING_BATCH_SIZE
            for start in range(0, len(chunks), batch_size):
                batch = chunks[start : start + batch_size]
                if generate_embeddings:
                    try:
                        embeddings = await get_embeddings([str(item["content"]) for item in batch], max_retries=3)
                    except Exception:
                        # Preserve extracted text and keyword search when the external
                        # embedding quota is temporarily unavailable.
                        embeddings = [None] * len(batch)
                else:
                    embeddings = [None] * len(batch)
                for chunk_data, embedding in zip(batch, embeddings, strict=True):
                    session.add(DocumentChunk(
                        document_id=document.id, content=str(chunk_data["content"]),
                        page_number=chunk_data.get("page_number"), chunk_index=int(chunk_data["chunk_index"]),
                        chapter=chunk_data.get("chapter"), article=chunk_data.get("article"),
                        clause=chunk_data.get("clause"), content_hash=str(chunk_data["content_hash"]),
                        embedding=embedding,
                    ))
                await session.flush()
            document.status = "completed"
            await session.commit()
        except Exception as exc:
            await session.rollback()
            document = await session.get(Document, document_uuid)
            if document is not None:
                document.status = "failed"
                document.error_message = str(exc)
                await session.commit()
            raise


def _load_source_file(document: Document) -> bytes:
    """Load from MinIO, restoring old Drive-backed records when the cache is missing."""
    try:
        return get_document_data("documents", document.file_path)
    except Exception:
        if not settings.GOOGLE_SERVICE_ACCOUNT_FILE:
            raise
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_SERVICE_ACCOUNT_FILE,
            scopes=["https://www.googleapis.com/auth/drive.readonly"],
        )
        drive = build("drive", "v3", credentials=credentials, cache_discovery=False)
        request = drive.files().get_media(fileId=document.file_path)
        stream = io.BytesIO()
        downloader = MediaIoBaseDownload(stream, request)
        done = False
        while not done:
            _, done = downloader.next_chunk()
        file_bytes = stream.getvalue()
        upload_document("documents", document.file_path, file_bytes, "application/pdf")
        return file_bytes
