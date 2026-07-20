"""change_vector_dimensions_to_768_for_gemini

Revision ID: 1c2b0771b541
Revises: e1b2d05b6978
Create Date: 2026-07-17 15:30:44.017517
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '1c2b0771b541'
down_revision: Union[str, None] = 'e1b2d05b6978'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from pgvector.sqlalchemy import Vector
    # Xóa cột vector cũ kích thước 1536
    op.drop_column('products', 'embedding')
    op.drop_column('legal_documents', 'embedding')
    op.drop_column('document_chunks', 'embedding')
    # Tạo lại cột vector mới kích thước 768 cho Gemini
    op.add_column('products', sa.Column('embedding', Vector(768), nullable=True))
    op.add_column('legal_documents', sa.Column('embedding', Vector(768), nullable=True))
    op.add_column('document_chunks', sa.Column('embedding', Vector(768), nullable=True))


def downgrade() -> None:
    from pgvector.sqlalchemy import Vector
    op.drop_column('products', 'embedding')
    op.drop_column('legal_documents', 'embedding')
    op.drop_column('document_chunks', 'embedding')
    op.add_column('products', sa.Column('embedding', Vector(1536), nullable=True))
    op.add_column('legal_documents', sa.Column('embedding', Vector(1536), nullable=True))
    op.add_column('document_chunks', sa.Column('embedding', Vector(1536), nullable=True))

