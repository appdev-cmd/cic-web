from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_roles
from app.core.features.dependencies import require_feature
from app.db.session import get_db
from app.models.user import User, UserRole
from app.modules.categories.schemas import CategoryCreate, CategoryRead, CategoryUpdate
from app.modules.categories.service import CategoryService

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
    dependencies=[Depends(require_feature("category_management"))],
)


@router.get("/", response_model=list[CategoryRead])
async def list_categories(
    _: User = Depends(require_roles(UserRole.ADMIN, UserRole.MANAGER)),
    session: AsyncSession = Depends(get_db),
) -> list[CategoryRead]:
    return await CategoryService(session).list()


@router.post("/", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    _: User = Depends(require_roles(UserRole.ADMIN)),
    session: AsyncSession = Depends(get_db),
) -> CategoryRead:
    return await CategoryService(session).create(payload)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    _: User = Depends(require_roles(UserRole.ADMIN)),
    session: AsyncSession = Depends(get_db),
) -> CategoryRead:
    return await CategoryService(session).update(category_id, payload)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: UUID,
    _: User = Depends(require_roles(UserRole.ADMIN)),
    session: AsyncSession = Depends(get_db),
) -> Response:
    await CategoryService(session).delete(category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
