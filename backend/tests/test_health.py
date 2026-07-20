import pytest


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_metrics(client):
    response = await client.get("/metrics")
    assert response.status_code == 200
    assert "python_info" in response.text
