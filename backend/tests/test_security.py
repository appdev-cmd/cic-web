from datetime import timedelta

import jwt
import pytest

from app.core.security import TokenType, create_token, decode_token, hash_password, verify_password


def test_password_hashing() -> None:
    hashed = hash_password("VerySecure123!")
    assert hashed != "VerySecure123!"
    assert verify_password("VerySecure123!", hashed)
    assert not verify_password("wrong-password", hashed)


def test_token_type_is_enforced() -> None:
    token = create_token("user-id", TokenType.ACCESS, timedelta(minutes=1))
    assert decode_token(token, TokenType.ACCESS)["sub"] == "user-id"
    with pytest.raises(jwt.InvalidTokenError):
        decode_token(token, TokenType.REFRESH)
