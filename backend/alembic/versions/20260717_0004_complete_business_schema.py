"""Complete business schema for chat, leads, governance, and categories.

Revision ID: 20260717_0004
Revises: 20260717_0003
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "20260717_0004"
down_revision = "20260717_0003"
branch_labels = None
depends_on = None


def _uuid() -> postgresql.UUID:
    return postgresql.UUID(as_uuid=True)


def _created_at() -> sa.Column:
    return sa.Column(
        "created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
    )


def upgrade() -> None:
    op.create_table(
        "product_categories",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        _created_at(),
        sa.PrimaryKeyConstraint("id", name="pk_product_categories"),
        sa.UniqueConstraint("name", name="uq_product_categories_name"),
    )
    op.create_index("ix_product_categories_name", "product_categories", ["name"])
    op.add_column("products", sa.Column("category_id", _uuid(), nullable=True))
    op.create_foreign_key(
        "fk_products_category_id_product_categories",
        "products",
        "product_categories",
        ["category_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_products_category_id", "products", ["category_id"])
    op.execute(
        "INSERT INTO product_categories (id, name) "
        "SELECT gen_random_uuid(), category FROM products "
        "WHERE category IS NOT NULL AND btrim(category) <> '' "
        "GROUP BY category ON CONFLICT (name) DO NOTHING"
    )
    op.execute(
        "UPDATE products p SET category_id = c.id "
        "FROM product_categories c WHERE p.category = c.name"
    )

    op.create_table(
        "conversations",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("user_id", _uuid(), nullable=True),
        sa.Column("session_id", sa.String(255), nullable=False),
        sa.Column("status", sa.String(50), server_default="active", nullable=False),
        sa.Column("current_state", sa.String(50), server_default="active", nullable=False),
        sa.Column("current_intent", sa.String(50), nullable=True),
        _created_at(),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name="pk_conversations"),
        sa.UniqueConstraint("session_id", name="uq_conversations_session_id"),
    )
    op.create_index("ix_conversations_session_id", "conversations", ["session_id"])
    op.create_index("ix_conversations_status", "conversations", ["status"])

    op.create_table(
        "messages",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("conversation_id", _uuid(), nullable=False),
        sa.Column("role", sa.String(20), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("intent", sa.String(50), nullable=True),
        sa.Column("model", sa.String(100), nullable=True),
        sa.Column("input_tokens", sa.Integer(), nullable=True),
        sa.Column("output_tokens", sa.Integer(), nullable=True),
        sa.Column("latency_ms", sa.Integer(), nullable=True),
        _created_at(),
        sa.ForeignKeyConstraint(["conversation_id"], ["conversations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name="pk_messages"),
    )
    op.create_index("ix_messages_conversation_id", "messages", ["conversation_id"])

    op.create_table(
        "customer_leads",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone_number", sa.String(20), nullable=False),
        sa.Column("email", sa.String(320), nullable=True),
        sa.Column("company", sa.String(255), nullable=True),
        sa.Column("customer_need", sa.Text(), nullable=True),
        sa.Column("product_interest", sa.Text(), nullable=True),
        sa.Column("budget", sa.Numeric(18, 2), nullable=True),
        sa.Column("quantity", sa.Numeric(18, 2), nullable=True),
        sa.Column("conversation_id", _uuid(), nullable=True),
        sa.Column("source", sa.String(100), server_default="chat", nullable=False),
        sa.Column("status", sa.String(50), server_default="new", nullable=False),
        sa.Column("assigned_employee_id", _uuid(), nullable=True),
        _created_at(),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["conversation_id"], ["conversations.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["assigned_employee_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name="pk_customer_leads"),
    )
    for column in ("phone_number", "conversation_id", "status", "assigned_employee_id"):
        op.create_index(f"ix_customer_leads_{column}", "customer_leads", [column])

    op.create_table(
        "lead_status_history",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("lead_id", _uuid(), nullable=False),
        sa.Column("old_status", sa.String(50), nullable=True),
        sa.Column("new_status", sa.String(50), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("changed_by", _uuid(), nullable=True),
        _created_at(),
        sa.ForeignKeyConstraint(["lead_id"], ["customer_leads.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["changed_by"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name="pk_lead_status_history"),
    )
    op.create_index("ix_lead_status_history_lead_id", "lead_status_history", ["lead_id"])

    op.create_table(
        "human_handoffs",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("conversation_id", _uuid(), nullable=False),
        sa.Column("lead_id", _uuid(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("priority", sa.String(20), server_default="normal", nullable=False),
        sa.Column("status", sa.String(50), server_default="pending", nullable=False),
        sa.Column("assigned_employee_id", _uuid(), nullable=True),
        _created_at(),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["conversation_id"], ["conversations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lead_id"], ["customer_leads.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["assigned_employee_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name="pk_human_handoffs"),
    )
    for column in ("conversation_id", "lead_id", "status"):
        op.create_index(f"ix_human_handoffs_{column}", "human_handoffs", [column])

    op.create_table(
        "audit_logs",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("user_id", _uuid(), nullable=True),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(100), nullable=False),
        sa.Column("entity_id", sa.String(255), nullable=True),
        sa.Column("metadata", postgresql.JSONB(), nullable=True),
        _created_at(),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name="pk_audit_logs"),
    )
    op.create_index("ix_audit_logs_user_id", "audit_logs", ["user_id"])
    op.create_index("ix_audit_logs_action", "audit_logs", ["action"])

    op.create_table(
        "prompt_versions",
        sa.Column("id", _uuid(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.false(), nullable=False),
        _created_at(),
        sa.PrimaryKeyConstraint("id", name="pk_prompt_versions"),
        sa.UniqueConstraint("name", "version", name="uq_prompt_versions_name_version"),
    )
    op.create_index("ix_prompt_versions_name", "prompt_versions", ["name"])
    op.create_index("ix_prompt_versions_is_active", "prompt_versions", ["is_active"])


def downgrade() -> None:
    for table in (
        "prompt_versions",
        "audit_logs",
        "human_handoffs",
        "lead_status_history",
        "customer_leads",
        "messages",
        "conversations",
    ):
        op.drop_table(table)
    op.drop_index("ix_products_category_id", table_name="products")
    op.drop_constraint("fk_products_category_id_product_categories", "products", type_="foreignkey")
    op.drop_column("products", "category_id")
    op.drop_table("product_categories")
