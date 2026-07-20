"""create_products_and_legal_documents

Revision ID: 8f3ac28d3777
Revises: 20260717_0001
Create Date: 2026-07-17 14:16:26.205206
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


revision: str = '8f3ac28d3777'
down_revision: Union[str, None] = '20260717_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Bật extension pgvector
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Tạo bảng products
    op.create_table(
        'products',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('sku', sa.String(length=100), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('embedding', pgvector.sqlalchemy.Vector(1536), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_products'))
    )
    op.create_index(op.f('ix_products_sku'), 'products', ['sku'], unique=True)

    # Tạo bảng legal_documents
    op.create_table(
        'legal_documents',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('drive_file_id', sa.String(length=100), nullable=True),
        sa.Column('sheet_row_index', sa.Integer(), nullable=True),
        sa.Column('embedding', pgvector.sqlalchemy.Vector(1536), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_legal_documents'))
    )


def downgrade() -> None:
    op.drop_table('legal_documents')
    op.drop_index(op.f('ix_products_sku'), table_name='products')
    op.drop_table('products')

