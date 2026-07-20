import uuid
from sqlalchemy import String, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector

from app.db.base import Base, TimestampMixin


class LegalDocument(TimestampMixin, Base):
    __tablename__ = "legal_documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False) # Số hiệu hoặc tiêu đề tóm tắt
    content: Mapped[str] = mapped_column(Text, nullable=False)       # Nội dung văn bản luật
    
    # Các cột metadata theo cấu hình Excel của người dùng
    document_type: Mapped[str | None] = mapped_column(String(100), nullable=True)  # LUẬT / NGHỊ ĐỊNH / THÔNG TƯ...
    document_number: Mapped[str | None] = mapped_column(String(100), nullable=True) # Số hiệu văn bản
    publish_date: Mapped[str | None] = mapped_column(String(100), nullable=True)    # Ngày ban hành
    effective_date: Mapped[str | None] = mapped_column(String(100), nullable=True)  # Ngày hiệu lực
    expiration_date: Mapped[str | None] = mapped_column(String(100), nullable=True) # Ngày hết hiệu lực
    link_docx: Mapped[str | None] = mapped_column(String(512), nullable=True)       # Link DOCX trên Drive
    link_pdf: Mapped[str | None] = mapped_column(String(512), nullable=True)        # Link PDF trên Drive
    link_english: Mapped[str | None] = mapped_column(String(512), nullable=True)    # Link English
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)                  # Ghi chú
    signer: Mapped[str | None] = mapped_column(String(255), nullable=True)          # Người ký xác nhận văn bản
    date_posted: Mapped[str | None] = mapped_column(String(100), nullable=True)     # Ngày đăng
    
    article: Mapped[str | None] = mapped_column(String(100), nullable=True)
    clause: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="effective", index=True, nullable=False)
    replacement: Mapped[str | None] = mapped_column(String(255), nullable=True)
    drive_file_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sheet_row_index: Mapped[int | None] = mapped_column(Integer, nullable=True)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(768), nullable=True)
