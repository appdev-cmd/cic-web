import asyncio
import math

import httpx
from redis.asyncio import Redis

from app.core.config import settings


async def _wait_for_rate_slot() -> None:
    """Coordinate Gemini embedding calls across API and Celery processes."""
    interval_ms = max(250, int(settings.GEMINI_EMBEDDING_INTERVAL_SECONDS * 1000))
    client = Redis.from_url(settings.REDIS_URL, decode_responses=True)
    try:
        while not await client.set("gemini:embedding:rate-slot", "1", nx=True, px=interval_ms):
            await asyncio.sleep(min(0.5, settings.GEMINI_EMBEDDING_INTERVAL_SECONDS / 2))
    finally:
        await client.aclose()


def _normalize_if_needed(values: list[float]) -> list[float]:
    if settings.GEMINI_EMBEDDING_MODEL != "gemini-embedding-001" or settings.GEMINI_EMBEDDING_DIMENSIONS == 3072:
        return values
    magnitude = math.sqrt(sum(value * value for value in values))
    return [value / magnitude for value in values] if magnitude else values


async def get_embedding(text: str, max_retries: int | None = None) -> list[float]:
    """Generate a 768-dimensional embedding exclusively with Gemini."""
    if not text:
        raise ValueError("Embedding text must not be empty")
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is required for embeddings")

    model = settings.GEMINI_EMBEDDING_MODEL
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent"
    payload = {
        "content": {"parts": [{"text": text}]},
        "output_dimensionality": settings.GEMINI_EMBEDDING_DIMENSIONS,
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        retry_limit = max_retries or settings.GEMINI_EMBEDDING_MAX_RETRIES
        for attempt in range(retry_limit):
            await _wait_for_rate_slot()
            response = await client.post(
                url,
                headers={"x-goog-api-key": settings.GEMINI_API_KEY},
                json=payload,
            )
            if response.status_code != 429:
                response.raise_for_status()
                break
            if attempt == retry_limit - 1:
                response.raise_for_status()
            retry_after = response.headers.get("Retry-After")
            delay = float(retry_after) if retry_after else min(2 ** (attempt + 1), 120)
            await asyncio.sleep(delay)
    values = response.json()["embedding"]["values"]
    if len(values) != settings.GEMINI_EMBEDDING_DIMENSIONS:
        raise RuntimeError(
            f"Gemini returned {len(values)} dimensions; "
            f"expected {settings.GEMINI_EMBEDDING_DIMENSIONS}"
        )
    return _normalize_if_needed(values)


async def get_embeddings(texts: list[str], max_retries: int | None = None) -> list[list[float]]:
    """Generate embeddings in synchronous Gemini batches to reduce quota pressure."""
    if not texts:
        return []
    if len(texts) == 1:
        return [await get_embedding(texts[0])]
    model = settings.GEMINI_EMBEDDING_MODEL
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:batchEmbedContents"
    requests = [
        {
            "model": f"models/{model}",
            "content": {"parts": [{"text": text}]},
            "output_dimensionality": settings.GEMINI_EMBEDDING_DIMENSIONS,
        }
        for text in texts
    ]
    async with httpx.AsyncClient(timeout=120.0) as client:
        retry_limit = max_retries or settings.GEMINI_EMBEDDING_MAX_RETRIES
        for attempt in range(retry_limit):
            await _wait_for_rate_slot()
            response = await client.post(
                url,
                headers={"x-goog-api-key": settings.GEMINI_API_KEY},
                json={"requests": requests},
            )
            if response.status_code != 429:
                response.raise_for_status()
                break
            if attempt == retry_limit - 1:
                response.raise_for_status()
            retry_after = response.headers.get("Retry-After")
            await asyncio.sleep(float(retry_after) if retry_after else min(2 ** (attempt + 1), 120))
    embeddings = [item["values"] for item in response.json()["embeddings"]]
    if len(embeddings) != len(texts) or any(len(item) != settings.GEMINI_EMBEDDING_DIMENSIONS for item in embeddings):
        raise RuntimeError("Gemini batch embedding response has an unexpected shape")
    return [_normalize_if_needed(item) for item in embeddings]
