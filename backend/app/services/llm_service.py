import asyncio

import httpx

from app.core.config import settings


class LLMUnavailableError(RuntimeError):
    """Raised when the configured generation provider cannot serve a request."""


async def _post_with_retry(
    client: httpx.AsyncClient,
    url: str,
    *,
    json: dict,
    headers: dict[str, str],
) -> httpx.Response:
    retryable = {429, 500, 502, 503, 504}
    response: httpx.Response | None = None
    max_attempts = 2
    for attempt in range(max_attempts):
        try:
            response = await client.post(url, json=json, headers=headers, timeout=12.0)
        except (httpx.TimeoutException, httpx.NetworkError) as exc:
            if attempt == max_attempts - 1:
                raise LLMUnavailableError("Dịch vụ AI tạm thời không phản hồi") from exc
        else:
            if response.status_code == 200:
                return response
            if response.status_code not in retryable or attempt == max_attempts - 1:
                raise LLMUnavailableError(f"Dịch vụ AI tạm thời không khả dụng ({response.status_code})")
        await asyncio.sleep(1.0 * (attempt + 1))
    raise LLMUnavailableError("Dịch vụ AI tạm thời không khả dụng")


async def call_llm(
    prompt: str,
    system_instruction: str = "Bạn là trợ lý pháp lý ảo thông minh của CIC.",
) -> str:
    """Generate an answer, raising a sanitized error when the provider is unavailable."""
    async with httpx.AsyncClient() as client:
        if settings.LLM_PROVIDER == "openai" and settings.OPENAI_API_KEY:
            response = await _post_with_retry(
                client,
                "https://api.openai.com/v1/chat/completions",
                json={
                    "model": settings.OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.3,
                },
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}", "Content-Type": "application/json"},
            )
            return response.json()["choices"][0]["message"]["content"]

        if settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
            model = settings.GEMINI_MODEL or "gemini-3.5-flash"
            response = await _post_with_retry(
                client,
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                json={
                    "contents": [{"parts": [{"text": f"System Instructions: {system_instruction}\n\nUser Question: {prompt}"}]}],
                    "generationConfig": {"temperature": 0.3},
                },
                headers={"x-goog-api-key": settings.GEMINI_API_KEY},
            )
            try:
                return response.json()["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError, TypeError) as exc:
                raise LLMUnavailableError("Dịch vụ AI trả về dữ liệu không hợp lệ") from exc

    raise LLMUnavailableError("Chưa cấu hình dịch vụ AI")
