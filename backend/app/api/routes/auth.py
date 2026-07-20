from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AnonymousRequest, LoginRequest, LogoutResponse, RefreshRequest, TokenPair
from app.models.user import UserRole
from app.core.security import hash_password
from sqlalchemy import select
import secrets
from app.schemas.user import UserRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_db)) -> TokenPair:
    service = AuthService(session)
    user = await service.authenticate(payload.email, payload.password)
    return service.issue_tokens(user)


@router.post("/anonymous", response_model=TokenPair)
async def anonymous(payload: AnonymousRequest, session: AsyncSession = Depends(get_db)) -> TokenPair:
    """Create or resume one isolated employee identity for a browser installation."""
    # Use a syntactically valid public suffix so EmailStr can serialize /auth/me.
    # This is only an internal identity; no email is ever sent to this address.
    email = f"guest-{payload.client_id.hex}@anonymous.cic.vn"
    user = (await session.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if user is None:
        user = User(
            email=email,
            full_name=f"Khách CIC {payload.client_id.hex[:8]}",
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            role=UserRole.EMPLOYEE,
            is_active=True,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    return AuthService(session).issue_tokens(user)


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest, session: AsyncSession = Depends(get_db)) -> TokenPair:
    return await AuthService(session).refresh(payload.refresh_token)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    payload: RefreshRequest,
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> LogoutResponse:
    await AuthService(session).revoke_refresh_token(payload.refresh_token)
    return LogoutResponse(message="Đăng xuất thành công")


@router.get("/me", response_model=UserRead)
async def me(user: User = Depends(get_current_user)) -> User:
    return user
