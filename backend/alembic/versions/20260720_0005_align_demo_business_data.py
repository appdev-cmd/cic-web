"""Align Supabase tables with the CIC demo business data."""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from alembic import op

revision = "20260720_0005"
down_revision = "20260717_0004"
branch_labels = None
depends_on = None

def upgrade() -> None:
    for column in (
        sa.Column("use_case", sa.Text(), nullable=True),
        sa.Column("power", sa.String(100), nullable=True),
        sa.Column("weight", sa.String(100), nullable=True),
        sa.Column("warranty", sa.String(100), nullable=True),
    ): op.add_column("products", column)
    op.execute("UPDATE products SET use_case = utility WHERE use_case IS NULL")
    for column in (
        sa.Column("article", sa.String(100), nullable=True),
        sa.Column("clause", sa.String(100), nullable=True),
        sa.Column("status", sa.String(30), server_default="effective", nullable=False),
        sa.Column("replacement", sa.String(255), nullable=True),
    ): op.add_column("legal_documents", column)
    op.create_index("ix_legal_documents_status", "legal_documents", ["status"])
    op.add_column("conversations", sa.Column("handoff", sa.Boolean(), server_default=sa.false(), nullable=False))
    op.create_table("quotations",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("lead_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("customer_leads.id", ondelete="SET NULL")),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id", ondelete="SET NULL")),
        sa.Column("product_name", sa.String(255), nullable=False), sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("customer_name", sa.String(255), nullable=False), sa.Column("phone_number", sa.String(20), nullable=False),
        sa.Column("total", sa.Numeric(18,2), nullable=False), sa.Column("status", sa.String(30), server_default="submitted", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
    op.create_index("ix_quotations_status", "quotations", ["status"])
    op.create_table("appointments",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("lead_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("customer_leads.id", ondelete="SET NULL")),
        sa.Column("customer_name", sa.String(255), nullable=False), sa.Column("phone_number", sa.String(20), nullable=False),
        sa.Column("appointment_date", sa.Date(), nullable=False), sa.Column("appointment_time", sa.Time(), nullable=False),
        sa.Column("channel", sa.String(50), nullable=False), sa.Column("status", sa.String(30), server_default="scheduled", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
    op.create_index("ix_appointments_status", "appointments", ["status"])
    op.create_index("ix_appointments_date", "appointments", ["appointment_date"])
    op.create_table("customer_feedback",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("message_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("messages.id", ondelete="SET NULL")),
        sa.Column("helpful", sa.Boolean(), nullable=False), sa.Column("reason", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
    op.create_index("ix_customer_feedback_helpful", "customer_feedback", ["helpful"])

def downgrade() -> None:
    op.drop_table("customer_feedback"); op.drop_table("appointments"); op.drop_table("quotations")
    op.drop_column("conversations", "handoff")
    op.drop_index("ix_legal_documents_status", table_name="legal_documents")
    for name in ("replacement","status","clause","article"): op.drop_column("legal_documents", name)
    for name in ("warranty","weight","power","use_case"): op.drop_column("products", name)
