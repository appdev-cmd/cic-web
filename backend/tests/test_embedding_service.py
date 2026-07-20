from unittest.mock import AsyncMock

import pytest

from app.core.config import settings
from app.services.embedding_service import get_embedding


class FakeResponse:
    status_code = 200
    headers: dict[str, str] = {}

    def raise_for_status(self) -> None:
        return None

    def json(self) -> dict[str, object]:
        return {"embedding": {"values": [0.1] * 768}}


class FakeClient:
    def __init__(self, *args: object, **kwargs: object) -> None:
        self.post = AsyncMock(return_value=FakeResponse())

    async def __aenter__(self) -> "FakeClient":
        return self

    async def __aexit__(self, *args: object) -> None:
        return None


@pytest.mark.asyncio
async def test_embedding_uses_gemini_768_dimensions(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(settings, "GEMINI_EMBEDDING_MODEL", "gemini-embedding-2")
    monkeypatch.setattr("app.services.embedding_service.httpx.AsyncClient", FakeClient)
    monkeypatch.setattr("app.services.embedding_service._wait_for_rate_slot", AsyncMock())

    embedding = await get_embedding("test document")

    assert len(embedding) == 768
