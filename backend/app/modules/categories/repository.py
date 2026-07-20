from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import ProductCategory
from app.models.product import Product


class CategoryRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_with_counts(self) -> list[tuple[ProductCategory, int]]:
        statement = (
            select(ProductCategory, func.count(Product.id))
            .outerjoin(Product, Product.category_id == ProductCategory.id)
            .group_by(ProductCategory.id)
            .order_by(ProductCategory.name)
        )
        return [(category, int(count)) for category, count in (await self.session.execute(statement)).all()]

    async def get(self, category_id: UUID) -> ProductCategory | None:
        return await self.session.get(ProductCategory, category_id)

    async def get_by_name(self, name: str) -> ProductCategory | None:
        result = await self.session.execute(
            select(ProductCategory).where(func.lower(ProductCategory.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def product_count(self, category_id: UUID) -> int:
        result = await self.session.execute(
            select(func.count(Product.id)).where(Product.category_id == category_id)
        )
        return int(result.scalar_one())

    def add(self, category: ProductCategory) -> None:
        self.session.add(category)

    async def delete(self, category: ProductCategory) -> None:
        await self.session.delete(category)
