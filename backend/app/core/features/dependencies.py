from collections.abc import Callable

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.features.service import FeatureService
from app.db.session import get_db
from app.models.system_config import FeatureFlag
from app.models.user import User


def require_feature(name: str) -> Callable[..., User]:
    async def feature_guard(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_db)) -> User:
        enabled = FeatureService().is_enabled(name, user.role.value)
        flag = (await session.execute(select(FeatureFlag).where(FeatureFlag.name == name))).scalar_one_or_none()
        if flag is not None:
            enabled = flag.enabled
        if not enabled:
            raise HTTPException(status_code=404, detail="Chức năng đang tắt")
        return user
    return feature_guard
