"""add_metadata_columns_to_products

Revision ID: e1b2d05b6978
Revises: 30fceda30d6e
Create Date: 2026-07-17 15:21:51.802007
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'e1b2d05b6978'
down_revision: Union[str, None] = '30fceda30d6e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('brand', sa.String(length=255), nullable=True))
    op.add_column('products', sa.Column('utility', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('specifications', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('standards', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('unit', sa.String(length=50), nullable=True))
    op.add_column('products', sa.Column('stock', sa.Integer(), nullable=True))
    op.add_column('products', sa.Column('product_link', sa.String(length=512), nullable=True))
    op.add_column('products', sa.Column('image_link', sa.String(length=512), nullable=True))
    op.add_column('products', sa.Column('catalogue_link', sa.String(length=512), nullable=True))


def downgrade() -> None:
    op.drop_column('products', 'catalogue_link')
    op.drop_column('products', 'image_link')
    op.drop_column('products', 'product_link')
    op.drop_column('products', 'stock')
    op.drop_column('products', 'unit')
    op.drop_column('products', 'standards')
    op.drop_column('products', 'specifications')
    op.drop_column('products', 'utility')
    op.drop_column('products', 'brand')

