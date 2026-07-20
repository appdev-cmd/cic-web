import pytest
from uuid import uuid4
from datetime import datetime
from unittest.mock import MagicMock

from app.api.deps import get_current_user
from app.db.session import get_db
from app.main import app
from app.models.user import User, UserRole
from app.models.document_upload import Document


class DummySession:
    async def execute(self, *args, **kwargs):
        pass
    def add(self, *args, **kwargs):
        pass
    async def commit(self, *args, **kwargs):
        pass
    async def refresh(self, *args, **kwargs):
        pass


@pytest.mark.asyncio
async def test_list_documents_endpoint(client, monkeypatch):
    dummy_user = User(
        id=uuid4(),
        email="admin@example.com",
        full_name="Admin",
        role=UserRole.ADMIN,
    )

    dummy_doc = Document(
        id=uuid4(),
        filename="Luat_Test.pdf",
        file_path="unique_path_test.pdf",
        status="completed",
        error_message=None,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Mock DB Session
    async def override_db():
        yield DummySession()

    # Mock Auth
    async def fake_get_current_user():
        return dummy_user

    # Mock DB execution
    async def fake_execute(self, stmt):
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [dummy_doc]
        return mock_result

    monkeypatch.setattr(DummySession, "execute", fake_execute)
    
    app.dependency_overrides[get_current_user] = fake_get_current_user
    app.dependency_overrides[get_db] = override_db

    try:
        response = await client.get(
            "/api/v1/documents/",
            headers={"Authorization": "Bearer fake_token"}
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["filename"] == "Luat_Test.pdf"
    assert data[0]["status"] == "completed"


@pytest.mark.asyncio
async def test_upload_document_endpoint(client, monkeypatch):
    dummy_user = User(
        id=uuid4(),
        email="admin@example.com",
        full_name="Admin",
        role=UserRole.ADMIN,
    )

    # Mock DB Session
    async def override_db():
        yield DummySession()

    # Mock Auth
    async def fake_get_current_user():
        return dummy_user

    # Mock MinIO upload
    def fake_upload_document(bucket_name, object_name, file_data, content_type):
        return object_name

    # Mock DB persistence
    async def fake_add(self, obj):
        obj.id = uuid4()
        return obj

    async def fake_commit(self):
        pass

    async def fake_refresh(self, obj):
        pass

    # Mock Celery delay
    mock_delay = MagicMock()
    monkeypatch.setattr("app.tasks.indexing.process_document_task.delay", mock_delay)
    monkeypatch.setattr("app.api.routes.documents.upload_document", fake_upload_document)
    monkeypatch.setattr(DummySession, "add", fake_add)
    monkeypatch.setattr(DummySession, "commit", fake_commit)
    monkeypatch.setattr(DummySession, "refresh", fake_refresh)

    app.dependency_overrides[get_current_user] = fake_get_current_user
    app.dependency_overrides[get_db] = override_db

    file_data = b"dummy PDF bytes"
    files = {"file": ("test.pdf", file_data, "application/pdf")}

    try:
        response = await client.post(
            "/api/v1/documents/upload",
            files=files,
            headers={"Authorization": "Bearer fake_token"}
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["document"]["filename"] == "test.pdf"
    assert mock_delay.called
