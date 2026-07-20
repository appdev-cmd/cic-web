from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import ProductCategory
from app.modules.categories.repository import CategoryRepository
from app.modules.categories.schemas import CategoryCreate, CategoryRead, CategoryUpdate


class CategoryService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = CategoryRepository(session)

    async def list(self) -> list[CategoryRead]:
        return [
            CategoryRead.model_validate(category).model_copy(update={"product_count": count})
            for category, count in await self.repository.list_with_counts()
        ]

    async def create(self, payload: CategoryCreate) -> CategoryRead:
        name = payload.name.strip()
        if await self.repository.get_by_name(name):
            raise HTTPException(status_code=409, detail="Tên danh mục đã tồn tại")
        category = ProductCategory(name=name, description=self._clean(payload.description))
        self.repository.add(category)
        await self.session.commit()
        await self.session.refresh(category)
        return CategoryRead.model_validate(category)

    async def update(self, category_id: UUID, payload: CategoryUpdate) -> CategoryRead:
        category = await self._get(category_id)
        if payload.name is not None:
            name = payload.name.strip()
            duplicate = await self.repository.get_by_name(name)
            if duplicate and duplicate.id != category.id:
                raise HTTPException(status_code=409, detail="Tên danh mục đã tồn tại")
            category.name = name
        if "description" in payload.model_fields_set:
            category.description = self._clean(payload.description)
        await self.session.commit()
        await self.session.refresh(category)
        count = await self.repository.product_count(category.id)
        return CategoryRead.model_validate(category).model_copy(update={"product_count": count})

    async def delete(self, category_id: UUID) -> None:
        category = await self._get(category_id)
        if await self.repository.product_count(category_id):
            raise HTTPException(
                status_code=409,
                detail="Không thể xóa danh mục đang có sản phẩm",
            )
        await self.repository.delete(category)
        await self.session.commit()

    async def _get(self, category_id: UUID) -> ProductCategory:
        category = await self.repository.get(category_id)
        if category is None:
            raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")
        return category

    @staticmethod
    def _clean(value: str | None) -> str | None:
        cleaned = value.strip() if value else None
        return cleaned or None
