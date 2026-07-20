"""Add idempotency metadata for Google Drive synchronization.

Revision ID: 20260717_0002
Revises: 1c2b0771b541
"""

import sqlalchemy as sa

from alembic import op

revision = "20260717_0002"
down_revision = "1c2b0771b541"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "documents",
        sa.Column("source", sa.String(length=50), server_default="manual", nullable=False),
    )
    op.add_column("documents", sa.Column("source_id", sa.String(length=255), nullable=True))
    op.add_column("documents", sa.Column("source_version", sa.String(length=100), nullable=True))
    op.create_index("ix_documents_source_id", "documents", ["source_id"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_documents_source_id", table_name="documents")
    op.drop_column("documents", "source_version")
    op.drop_column("documents", "source_id")
    op.drop_column("documents", "source")
