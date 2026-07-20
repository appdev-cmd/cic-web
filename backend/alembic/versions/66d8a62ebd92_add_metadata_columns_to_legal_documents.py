"""add_metadata_columns_to_legal_documents

Revision ID: 66d8a62ebd92
Revises: ead26a0ed7f3
Create Date: 2026-07-17 15:16:38.217491
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '66d8a62ebd92'
down_revision: Union[str, None] = 'ead26a0ed7f3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('legal_documents', sa.Column('document_type', sa.String(length=100), nullable=True))
    op.add_column('legal_documents', sa.Column('document_number', sa.String(length=100), nullable=True))
    op.add_column('legal_documents', sa.Column('publish_date', sa.String(length=100), nullable=True))
    op.add_column('legal_documents', sa.Column('effective_date', sa.String(length=100), nullable=True))
    op.add_column('legal_documents', sa.Column('expiration_date', sa.String(length=100), nullable=True))
    op.add_column('legal_documents', sa.Column('link_docx', sa.String(length=512), nullable=True))
    op.add_column('legal_documents', sa.Column('link_pdf', sa.String(length=512), nullable=True))
    op.add_column('legal_documents', sa.Column('link_english', sa.String(length=512), nullable=True))
    op.add_column('legal_documents', sa.Column('notes', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('legal_documents', 'notes')
    op.drop_column('legal_documents', 'link_english')
    op.drop_column('legal_documents', 'link_pdf')
    op.drop_column('legal_documents', 'link_docx')
    op.drop_column('legal_documents', 'expiration_date')
    op.drop_column('legal_documents', 'effective_date')
    op.drop_column('legal_documents', 'publish_date')
    op.drop_column('legal_documents', 'document_number')
    op.drop_column('legal_documents', 'document_type')

