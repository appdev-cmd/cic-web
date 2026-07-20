from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "rag_cic",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.indexing", "app.tasks.google_sync"],
)
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Ho_Chi_Minh",
    enable_utc=True,
    worker_prefetch_multiplier=1,
    beat_schedule={
        "sync-google-data-every-60-seconds": {
            "task": "app.tasks.google_sync.sync_google_data",
            "schedule": settings.GOOGLE_SYNC_INTERVAL_SECONDS,
        }
    },
)
