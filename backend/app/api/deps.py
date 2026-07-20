from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import TokenType, decode_token
from app.db.session import get_db
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Yêu cầu xác thực")
    try:
        payload = decode_token(credentials.credentials, TokenType.ACCESS)
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Access token không hợp lệ") from exc
    user = await UserRepository(session).get_by_id(str(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Tài khoản không khả dụng")
    return user


def require_roles(*roles: UserRole) -> Callable[..., User]:
    async def role_guard(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Không đủ quyền truy cập")
        return user

    return role_guard
