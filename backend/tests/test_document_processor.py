from app.services.document_processor import extract_legal_metadata, split_legal_text


def test_split_legal_text_preserves_legal_structure() -> None:
    text = """CHƯƠNG II
Điều 24. Điều kiện cấp phép
1. Công trình phải phù hợp với quy hoạch.
2. Hồ sơ phải đầy đủ theo quy định.
Điều 25. Thời hạn
1. Thời hạn giải quyết là 20 ngày.
"""

    chunks = split_legal_text(text, page_number=3, max_chars=200)

    assert chunks
    assert any((chunk["article"] or "").startswith("Điều 24") for chunk in chunks)
    assert any(chunk["clause"] == "2" for chunk in chunks)
    assert all(chunk["page_number"] == 3 for chunk in chunks)
    assert all(len(chunk["content_hash"]) == 64 for chunk in chunks)


def test_extracts_core_vietnamese_legal_metadata() -> None:
    text = """BỘ XÂY DỰNG
Số: 38/2026/TT-BXD
THÔNG TƯ
Ban hành định mức xây dựng
Hà Nội, ngày 26 tháng 6 năm 2026
Căn cứ Luật Xây dựng;
Thông tư này hết hiệu lực thi hành kể từ ngày 01 tháng 01 năm 2030.
KT. BỘ TRƯỞNG
THỨ TRƯỞNG
Nguyễn Văn Sinh
"""
    metadata = extract_legal_metadata(text, "38-2026.pdf")
    assert metadata.document_number == "38/2026/TT-BXD"
    assert metadata.legal_title == "Ban hành định mức xây dựng"
    assert metadata.issue_date.isoformat() == "2026-06-26"
    assert metadata.expiration_date.isoformat() == "2030-01-01"
    assert metadata.signer == "Nguyễn Văn Sinh"
