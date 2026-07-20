import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_roles
from app.core.features.definitions import FEATURE_DEFINITIONS
from app.core.features.service import FeatureService
from app.core.features.dependencies import require_feature
from app.core.security import hash_password
from app.db.session import get_db
from app.models.document_upload import Document
from app.models.system_config import FeatureFlag, PromptTemplate
from app.models.user import User, UserRole
from app.schemas.user import UserRead
from app.modules.system.permissions import permissions_for_role
from app.modules.system.schemas import CapabilityResponse, FeatureState

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/features", response_model=list[FeatureState])
@router.get("/features", response_model=list[FeatureState])
async def list_features(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_db)) -> list[FeatureState]:
    states = FeatureService().states_for_role(user.role.value)
    rows = (await session.execute(select(FeatureFlag))).scalars().all()
    for row in rows:
        if row.name in states:
            states[row.name] = row.enabled
    return [
        FeatureState(name=item.name, enabled=states[item.name], description=item.description)
        for item in FEATURE_DEFINITIONS
    ]


@router.get("/capabilities", response_model=CapabilityResponse)
async def capabilities(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_db)) -> CapabilityResponse:
    from app.modules.registry import module_registry

    return CapabilityResponse(
        modules=module_registry.capabilities(),
        features={item.name: item.enabled for item in await list_features(user, session)},
        permissions=permissions_for_role(user.role.value),
    )


class FeatureUpdate(BaseModel):
    enabled: bool


@router.patch("/features/{name}", response_model=FeatureState)
async def set_feature(name: str, payload: FeatureUpdate, session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN))) -> FeatureState:
    definition = next((item for item in FEATURE_DEFINITIONS if item.name == name), None)
    if definition is None:
        raise HTTPException(404, "Tính năng không tồn tại")
    flag = (await session.execute(select(FeatureFlag).where(FeatureFlag.name == name))).scalar_one_or_none()
    if flag is None:
        flag = FeatureFlag(name=name, enabled=payload.enabled)
        session.add(flag)
    else:
        flag.enabled = payload.enabled
    await session.commit()
    return FeatureState(name=name, enabled=payload.enabled, description=definition.description)


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.EMPLOYEE


class UserUpdate(BaseModel):
    full_name: str | None = Field(None, min_length=2, max_length=255)
    password: str | None = Field(None, min_length=8, max_length=128)
    role: UserRole | None = None
    is_active: bool | None = None


@router.get("/users", response_model=list[UserRead])
async def users(session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("user_management"))):
    return (await session.execute(select(User).order_by(User.created_at.desc()))).scalars().all()


@router.post("/users", status_code=201, response_model=UserRead)
async def create_user(payload: UserCreate, session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("user_management"))):
    if (await session.execute(select(User).where(func.lower(User.email) == payload.email.lower()))).scalar_one_or_none():
        raise HTTPException(409, "Email đã tồn tại")
    item = User(email=payload.email.lower(), full_name=payload.full_name.strip(), hashed_password=hash_password(payload.password), role=payload.role)
    session.add(item); await session.commit(); await session.refresh(item)
    return item


@router.patch("/users/{user_id}", response_model=UserRead)
async def update_user(user_id: uuid.UUID, payload: UserUpdate, session: AsyncSession = Depends(get_db), admin: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("user_management"))):
    item = await session.get(User, user_id)
    if item is None: raise HTTPException(404, "Không tìm thấy người dùng")
    if item.id == admin.id and payload.is_active is False: raise HTTPException(400, "Không thể tự khóa tài khoản đang dùng")
    for field in ("full_name", "role", "is_active"):
        value = getattr(payload, field)
        if value is not None: setattr(item, field, value)
    if payload.password: item.hashed_password = hash_password(payload.password)
    await session.commit(); await session.refresh(item)
    return item


class PromptInput(BaseModel):
    key: str = Field(pattern=r"^[a-z0-9_]+$", max_length=100)
    name: str = Field(min_length=2, max_length=255)
    content: str = Field(min_length=10)
    is_active: bool = True


@router.get("/prompts")
async def prompts(session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("prompt_management"))):
    return (await session.execute(select(PromptTemplate).order_by(PromptTemplate.key))).scalars().all()


@router.post("/prompts", status_code=201)
async def create_prompt(payload: PromptInput, session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("prompt_management"))):
    if (await session.execute(select(PromptTemplate).where(PromptTemplate.key == payload.key))).scalar_one_or_none(): raise HTTPException(409, "Mã prompt đã tồn tại")
    item = PromptTemplate(**payload.model_dump()); session.add(item); await session.commit(); await session.refresh(item); return item


@router.put("/prompts/{prompt_id}")
async def update_prompt(prompt_id: uuid.UUID, payload: PromptInput, session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("prompt_management"))):
    item = await session.get(PromptTemplate, prompt_id)
    if item is None: raise HTTPException(404, "Không tìm thấy prompt")
    for key, value in payload.model_dump().items(): setattr(item, key, value)
    await session.commit(); await session.refresh(item); return item


@router.delete("/prompts/{prompt_id}", status_code=204)
async def delete_prompt(prompt_id: uuid.UUID, session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("prompt_management"))):
    item = await session.get(PromptTemplate, prompt_id)
    if item is None: raise HTTPException(404, "Không tìm thấy prompt")
    await session.delete(item); await session.commit()


@router.get("/jobs")
async def jobs(session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN)), __: User = Depends(require_feature("job_monitoring"))):
    rows = (await session.execute(select(Document).order_by(Document.updated_at.desc()).limit(100))).scalars().all()
    return [{"id": row.id, "name": row.filename, "type": "document_indexing", "status": row.status, "error": row.error_message, "updated_at": row.updated_at} for row in rows]
