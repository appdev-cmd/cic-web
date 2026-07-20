import uuid
from typing import TYPE_CHECKING

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.category import ProductCategory


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    sku: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # Kept temporarily for compatibility with existing imports and API responses.
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("product_categories.id", ondelete="SET NULL"),
        index=True,
    )
    brand: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    utility: Mapped[str | None] = mapped_column(Text, nullable=True)
    use_case: Mapped[str | None] = mapped_column(Text, nullable=True)
    power: Mapped[str | None] = mapped_column(String(100), nullable=True)
    weight: Mapped[str | None] = mapped_column(String(100), nullable=True)
    warranty: Mapped[str | None] = mapped_column(String(100), nullable=True)
    specifications: Mapped[str | None] = mapped_column(Text, nullable=True)
    standards: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    stock: Mapped[int | None] = mapped_column(Integer, nullable=True)
    product_link: Mapped[str | None] = mapped_column(String(512), nullable=True)
    image_link: Mapped[str | None] = mapped_column(String(512), nullable=True)
    catalogue_link: Mapped[str | None] = mapped_column(String(512), nullable=True)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(768), nullable=True)
    category_rel: Mapped["ProductCategory | None"] = relationship(
        back_populates="products"
    )
