from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str


class AnonymousRequest(BaseModel):
    client_id: UUID


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    role: str
    token_type: str = "bearer"
    expires_in: int


class LogoutResponse(BaseModel):
    message: str
