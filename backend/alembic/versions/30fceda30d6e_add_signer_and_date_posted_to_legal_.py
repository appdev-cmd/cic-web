"""add_signer_and_date_posted_to_legal_documents

Revision ID: 30fceda30d6e
Revises: 66d8a62ebd92
Create Date: 2026-07-17 15:18:32.403836
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '30fceda30d6e'
down_revision: Union[str, None] = '66d8a62ebd92'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('legal_documents', sa.Column('signer', sa.String(length=255), nullable=True))
    op.add_column('legal_documents', sa.Column('date_posted', sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column('legal_documents', 'date_posted')
    op.drop_column('legal_documents', 'signer')

