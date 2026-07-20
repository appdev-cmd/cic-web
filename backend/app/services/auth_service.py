import time
from datetime import timedelta

import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ApplicationError
from app.core.security import TokenType, create_token, decode_token, verify_password
from app.db.redis import redis_client
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPair


class AuthService:
    """Authenticate staff and issue short-lived access plus rotating refresh tokens."""

    def __init__(self, session: AsyncSession) -> None:
        self.users = UserRepository(session)

    async def authenticate(self, email: str, password: str) -> User:
        user = await self.users.get_by_email(email)
        if not user or not user.is_active or not verify_password(password, user.hashed_password):
            raise ApplicationError("Email hoặc mật khẩu không chính xác", 401)
        return user

    def issue_tokens(self, user: User) -> TokenPair:
        access_expiry = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expiry = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        return TokenPair(
            access_token=create_token(str(user.id), TokenType.ACCESS, access_expiry),
            refresh_token=create_token(str(user.id), TokenType.REFRESH, refresh_expiry),
            role=user.role.value,
            expires_in=int(access_expiry.total_seconds()),
        )

    async def refresh(self, token: str) -> TokenPair:
        try:
            payload = decode_token(token, TokenType.REFRESH)
        except jwt.InvalidTokenError as exc:
            raise ApplicationError("Refresh token không hợp lệ hoặc đã hết hạn", 401) from exc
        if await redis_client.exists(f"revoked_token:{payload['jti']}"):
            raise ApplicationError("Refresh token đã bị thu hồi", 401)
        user = await self.users.get_by_id(str(payload["sub"]))
        if not user or not user.is_active:
            raise ApplicationError("Tài khoản không khả dụng", 401)
        return self.issue_tokens(user)

    async def revoke_refresh_token(self, token: str) -> None:
        try:
            payload = decode_token(token, TokenType.REFRESH)
            ttl = max(1, int(payload["exp"]) - int(time.time()))
            await redis_client.setex(f"revoked_token:{payload['jti']}", ttl, "1")
        except jwt.InvalidTokenError as exc:
            raise ApplicationError("Refresh token không hợp lệ", 401) from exc
