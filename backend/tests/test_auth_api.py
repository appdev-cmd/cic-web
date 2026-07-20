from uuid import uuid4

import pytest

from app.db.session import get_db
from app.main import app
from app.models.user import User, UserRole
from app.services.auth_service import AuthService


class DummySession:
    pass


@pytest.mark.asyncio
async def test_login_returns_token_pair(client, monkeypatch):
    user = User(
        id=uuid4(),
        email="admin@example.com",
        full_name="Admin",
        hashed_password="unused",
        role=UserRole.ADMIN,
    )

    async def fake_authenticate(self, email: str, password: str):
        assert email == "admin@example.com"
        assert password == "ChangeMe123!"
        return user

    async def override_db():
        yield DummySession()

    monkeypatch.setattr(AuthService, "authenticate", fake_authenticate)
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post(
            "/api/v1/auth/login", json={"email": "admin@example.com", "password": "ChangeMe123!"}
        )
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    assert response.json()["access_token"]


@pytest.mark.asyncio
async def test_login_validates_input(client):
    response = await client.post(
        "/api/v1/auth/login", json={"email": "invalid", "password": "short"}
    )
    assert response.status_code == 422
