import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class CustomerLead(TimestampMixin, Base):
    __tablename__ = "customer_leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), index=True, nullable=False)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    customer_need: Mapped[str | None] = mapped_column(Text, nullable=True)
    product_interest: Mapped[str | None] = mapped_column(Text, nullable=True)
    budget: Mapped[float | None] = mapped_column(Numeric(18, 2), nullable=True)
    quantity: Mapped[float | None] = mapped_column(Numeric(18, 2), nullable=True)
    conversation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="SET NULL"), index=True
    )
    source: Mapped[str] = mapped_column(String(100), default="chat", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="new", index=True, nullable=False)
    assigned_employee_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    status_history: Mapped[list["LeadStatusHistory"]] = relationship(
        back_populates="lead", cascade="all, delete-orphan"
    )


class LeadStatusHistory(Base):
    __tablename__ = "lead_status_history"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customer_leads.id", ondelete="CASCADE"), index=True
    )
    old_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    new_status: Mapped[str] = mapped_column(String(50), nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    changed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    lead: Mapped[CustomerLead] = relationship(back_populates="status_history")


class HumanHandoff(Base):
    __tablename__ = "human_handoffs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), index=True
    )
    lead_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customer_leads.id", ondelete="SET NULL"), index=True
    )
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="normal", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending", index=True, nullable=False)
    assigned_employee_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def resolve(self) -> None:
        self.status = "resolved"
        self.resolved_at = datetime.now(UTC)
