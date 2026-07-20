"""Add runtime feature controls and prompt templates."""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from alembic import op

revision = "20260720_0006"
down_revision = "20260720_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "system_feature_flags",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_system_feature_flags_name", "system_feature_flags", ["name"], unique=True)
    op.create_table(
        "prompt_templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("key", sa.String(100), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_prompt_templates_key", "prompt_templates", ["key"], unique=True)


def downgrade() -> None:
    op.drop_table("prompt_templates")
    op.drop_table("system_feature_flags")
