from uuid import uuid4

import pytest

from app.api.deps import get_current_user
from app.db.session import get_db
from app.main import app
from app.models.user import User, UserRole
from app.services.rag_retrieval_service import RetrievedSource
from app.services.llm_service import LLMUnavailableError


class DummySession:
    def __init__(self):
        self.added = []

    def add(self, item):
        self.added.append(item)

    async def flush(self):
        for item in self.added:
            if getattr(item, "id", None) is None:
                item.id = uuid4()

    async def commit(self):
        pass


@pytest.mark.asyncio
async def test_rag_query_endpoint(client, monkeypatch: pytest.MonkeyPatch) -> None:
    user = User(
        id=uuid4(),
        email="employee@example.com",
        full_name="Employee",
        role=UserRole.EMPLOYEE,
    )

    async def override_db():
        yield DummySession()

    async def fake_user():
        return user

    async def fake_embedding(_text: str, **_kwargs):
        return [0.0] * 768

    async def fake_retrieve(self, query, embedding, limit):
        return [
            RetrievedSource(
                title="Nghị định 15",
                content="Điều kiện cấp phép",
                page=2,
                source_type="Document chunk",
                distance=0.1,
                article="Điều 24",
                clause="2",
            )
        ]

    async def fake_llm(_prompt: str, _system_instruction: str):
        return "Câu trả lời dựa trên Nghị định 15 [Nguồn 1]."

    monkeypatch.setattr("app.api.routes.rag.get_embedding", fake_embedding)
    monkeypatch.setattr("app.api.routes.rag.RagRetrievalService.retrieve", fake_retrieve)
    monkeypatch.setattr("app.api.routes.rag.call_llm", fake_llm)
    app.dependency_overrides[get_current_user] = fake_user
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post(
            "/api/v1/rag/query",
            json={"query": "Điều kiện cấp phép xây dựng?"},
            headers={"Authorization": "Bearer fake"},
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    body = response.json()
    assert "[Nguồn 1]" in body["answer"]
    assert body["sources"] == []
    assert "không thay thế ý kiến tư vấn" in body["answer"]


@pytest.mark.asyncio
async def test_rag_uses_retrieval_fallback_when_llm_is_unavailable(
    client, monkeypatch: pytest.MonkeyPatch
) -> None:
    user = User(id=uuid4(), email="fallback@example.com", full_name="Fallback", role=UserRole.EMPLOYEE)

    async def override_db():
        yield DummySession()

    async def fake_user():
        return user

    async def fake_embedding(_text: str, **_kwargs):
        return None

    async def fake_retrieve(self, query, embedding, limit):
        return [RetrievedSource(title="Quy định", content="Nội dung pháp lý dự phòng.", page=1, source_type="Document chunk", distance=0.2)]

    async def unavailable(_prompt: str, _instruction: str):
        raise LLMUnavailableError("503")

    monkeypatch.setattr("app.api.routes.rag.get_embedding", fake_embedding)
    monkeypatch.setattr("app.api.routes.rag.RagRetrievalService.retrieve", fake_retrieve)
    monkeypatch.setattr("app.api.routes.rag.call_llm", unavailable)
    app.dependency_overrides[get_current_user] = fake_user
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post("/api/v1/rag/query", json={"query": "Quy định xây dựng?"})
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    answer = response.json()["answer"]
    assert "Nội dung pháp lý dự phòng" in answer
    assert "Lỗi Gemini" not in answer
    assert "503" not in answer
