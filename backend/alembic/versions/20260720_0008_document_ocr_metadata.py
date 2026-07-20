"""Add OCR-derived legal metadata to uploaded documents."""
import sqlalchemy as sa
from alembic import op

revision = "20260720_0008"
down_revision = "20260720_0007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("documents", sa.Column("document_number", sa.String(100), nullable=True))
    op.add_column("documents", sa.Column("legal_title", sa.String(500), nullable=True))
    op.add_column("documents", sa.Column("issue_date", sa.Date(), nullable=True))
    op.add_column("documents", sa.Column("expiration_date", sa.Date(), nullable=True))
    op.add_column("documents", sa.Column("signer", sa.String(255), nullable=True))
    op.add_column("documents", sa.Column("ocr_used", sa.Boolean(), server_default=sa.false(), nullable=False))
    op.create_index("ix_documents_document_number", "documents", ["document_number"])


def downgrade() -> None:
    op.drop_index("ix_documents_document_number", table_name="documents")
    for name in ("ocr_used", "signer", "expiration_date", "issue_date", "legal_title", "document_number"):
        op.drop_column("documents", name)
