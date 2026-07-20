from datetime import UTC, datetime, timedelta
from enum import StrEnum
from uuid import uuid4

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

password_context = PasswordHash.recommended()


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_context.verify(password, hashed_password)


def create_token(subject: str, token_type: TokenType, expires_delta: timedelta) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "type": token_type.value,
        "iat": now,
        "exp": now + expires_delta,
        "jti": str(uuid4()),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str, expected_type: TokenType) -> dict[str, object]:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    if payload.get("type") != expected_type.value:
        raise jwt.InvalidTokenError("Unexpected token type")
    return payload
