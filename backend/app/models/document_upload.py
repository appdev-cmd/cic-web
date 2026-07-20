import uuid

from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, Date, ForeignKey, Index, Integer, String, Text, text
from datetime import date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(50), default="manual", nullable=False)
    source_id: Mapped[str | None] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )
    source_version: Mapped[str | None] = mapped_column(String(100), nullable=True)
    content_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    document_number: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    legal_title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    issue_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    expiration_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    signer: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ocr_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(768), nullable=True)

    chunks: Mapped[list["DocumentChunk"]] = relationship(
        "DocumentChunk", back_populates="document", cascade="all, delete-orphan"
    )


class DocumentChunk(TimestampMixin, Base):
    __tablename__ = "document_chunks"
    __table_args__ = (
        Index("ix_document_chunks_document_index", "document_id", "chunk_index"),
        Index(
            "ix_document_chunks_content_fts",
            text("to_tsvector('simple', content)"),
            postgresql_using="gin",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    page_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    chapter: Mapped[str | None] = mapped_column(String(255), nullable=True)
    article: Mapped[str | None] = mapped_column(String(255), nullable=True)
    clause: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(768), nullable=True)

    document: Mapped["Document"] = relationship("Document", back_populates="chunks")
