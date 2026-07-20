import pytest
from uuid import uuid4
from datetime import datetime

from app.api.deps import get_current_user
from app.db.session import get_db
from app.main import app
from app.models.user import User, UserRole
from app.models.product import Product
from app.repositories.product_repository import ProductRepository
from app.services.embedding_service import get_embedding


class DummySession:
    pass


@pytest.mark.asyncio
async def test_list_products_endpoint(client, monkeypatch):
    dummy_user = User(
        id=uuid4(),
        email="employee@example.com",
        full_name="Employee",
        role=UserRole.MANAGER,
    )

    dummy_product = Product(
        id=uuid4(),
        sku="SKU-TEST-123",
        name="San pham test",
        description="Mo ta test",
        category="Category Test",
        price=150000.0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Mock DB Session
    async def override_db():
        yield DummySession()

    # Mock Auth
    async def fake_get_current_user():
        return dummy_user

    # Mock ProductRepository
    async def fake_list_products(self, skip, limit, category):
        return [dummy_product]

    monkeypatch.setattr(ProductRepository, "list_products", fake_list_products)
    app.dependency_overrides[get_current_user] = fake_get_current_user
    app.dependency_overrides[get_db] = override_db

    try:
        response = await client.get(
            "/api/v1/products/",
            headers={"Authorization": "Bearer fake_token"}
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["sku"] == "SKU-TEST-123"
    assert data[0]["name"] == "San pham test"


@pytest.mark.asyncio
async def test_search_products_endpoint(client, monkeypatch):
    dummy_user = User(
        id=uuid4(),
        email="employee@example.com",
        full_name="Employee",
        role=UserRole.MANAGER,
    )

    dummy_product = Product(
        id=uuid4(),
        sku="SKU-TEST-SEARCH",
        name="Nuoc rua chen",
        description="Lam sach bat dia",
        category="Gia dung",
        price=35000.0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Mock DB Session
    async def override_db():
        yield DummySession()

    # Mock Auth
    async def fake_get_current_user():
        return dummy_user

    # Mock embedding generator
    async def fake_get_embedding(text):
        return [0.1] * 1536

    # Mock ProductRepository searches
    async def fake_search_by_keyword(self, query, limit):
        return [dummy_product]

    async def fake_search_by_semantic(self, embedding, limit):
        return [(dummy_product, 0.05)]

    monkeypatch.setattr(ProductRepository, "search_by_keyword", fake_search_by_keyword)
    monkeypatch.setattr(ProductRepository, "search_by_semantic", fake_search_by_semantic)
    monkeypatch.setattr("app.api.routes.products.get_embedding", fake_get_embedding)
    
    app.dependency_overrides[get_current_user] = fake_get_current_user
    app.dependency_overrides[get_db] = override_db

    try:
        response = await client.get(
            "/api/v1/products/search?query=nuoc%20rua%20chen",
            headers={"Authorization": "Bearer fake_token"}
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["product"]["sku"] == "SKU-TEST-SEARCH"
    assert data[0]["score"] > 0.0
