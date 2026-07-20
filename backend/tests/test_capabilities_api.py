from uuid import uuid4

import pytest

from app.api.deps import get_current_user
from app.main import app
from app.models.user import User, UserRole


@pytest.mark.asyncio
async def test_capabilities_are_filtered_for_employee(client) -> None:
    user = User(
        id=uuid4(),
        email="employee@example.com",
        full_name="Employee",
        hashed_password="unused",
        role=UserRole.EMPLOYEE,
        is_active=True,
    )

    async def override_user() -> User:
        return user

    app.dependency_overrides[get_current_user] = override_user
    try:
        response = await client.get("/api/v1/system/capabilities")
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    body = response.json()
    assert body["modules"]["categories"] is True
    assert body["features"]["category_management"] is True
    assert body["permissions"] == ["chat.use"]
