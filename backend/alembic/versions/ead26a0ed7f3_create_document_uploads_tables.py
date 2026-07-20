"""create_document_uploads_tables

Revision ID: ead26a0ed7f3
Revises: 8f3ac28d3777
Create Date: 2026-07-17 14:57:13.577754
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


revision: str = 'ead26a0ed7f3'
down_revision: Union[str, None] = '8f3ac28d3777'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tạo bảng documents
    op.create_table(
        'documents',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('file_path', sa.String(length=512), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_documents'))
    )

    # Tạo bảng document_chunks
    op.create_table(
        'document_chunks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('document_id', sa.UUID(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('embedding', pgvector.sqlalchemy.Vector(1536), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], name=op.f('fk_document_chunks_document_id_documents'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_document_chunks'))
    )


def downgrade() -> None:
    op.drop_table('document_chunks')
    op.drop_table('documents')

