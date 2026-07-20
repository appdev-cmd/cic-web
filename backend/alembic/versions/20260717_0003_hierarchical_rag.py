"""Add hierarchical document and chunk retrieval metadata.

Revision ID: 20260717_0003
Revises: 20260717_0002
"""

import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

from alembic import op

revision = "20260717_0003"
down_revision = "20260717_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("documents", sa.Column("content_hash", sa.String(64), nullable=True))
    op.add_column("documents", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("documents", sa.Column("embedding", Vector(768), nullable=True))
    op.add_column(
        "document_chunks",
        sa.Column("chunk_index", sa.Integer(), server_default="0", nullable=False),
    )
    op.add_column("document_chunks", sa.Column("chapter", sa.String(255), nullable=True))
    op.add_column("document_chunks", sa.Column("article", sa.String(255), nullable=True))
    op.add_column("document_chunks", sa.Column("clause", sa.String(255), nullable=True))
    op.add_column(
        "document_chunks",
        sa.Column("content_hash", sa.String(64), server_default="", nullable=False),
    )
    op.create_index(
        "ix_document_chunks_document_index",
        "document_chunks",
        ["document_id", "chunk_index"],
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_document_chunks_content_fts "
        "ON document_chunks USING gin (to_tsvector('simple', content))"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_document_chunks_content_fts")
    op.drop_index("ix_document_chunks_document_index", table_name="document_chunks")
    op.drop_column("document_chunks", "content_hash")
    op.drop_column("document_chunks", "clause")
    op.drop_column("document_chunks", "article")
    op.drop_column("document_chunks", "chapter")
    op.drop_column("document_chunks", "chunk_index")
    op.drop_column("documents", "embedding")
    op.drop_column("documents", "summary")
    op.drop_column("documents", "content_hash")
