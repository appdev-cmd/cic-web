import asyncio
import io
import logging
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from redis.asyncio import Redis
from sqlalchemy import delete, select

from app.cli.sync_google_data import sync_documents, sync_products
from app.core.config import settings
from app.db.session import async_session_factory, engine
from app.models.document_upload import Document, DocumentChunk
from app.services.minio_client import minio_client, upload_document
from app.tasks.celery_app import celery_app
from app.tasks.indexing import process_document_task

logger = logging.getLogger(__name__)
SYNC_LOCK_KEY = "google_sync:lock"
SUPPORTED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/plain": ".txt",
    "application/vnd.google-apps.document": ".docx",
}


def _build_drive_client() -> object | None:
    credentials_path = settings.GOOGLE_SERVICE_ACCOUNT_FILE
    if not credentials_path or not Path(credentials_path).is_file():
        return None
    credentials = service_account.Credentials.from_service_account_file(
        credentials_path,
        scopes=[
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/spreadsheets.readonly",
        ],
    )
    return build("drive", "v3", credentials=credentials, cache_discovery=False)


async def _changed_resource_version(
    redis: Redis, drive: object | None, file_id: str | None
) -> str | None:
    if drive is None or not file_id:
        return None
    metadata = await asyncio.to_thread(
        lambda: drive.files()
        .get(fileId=file_id, fields="id,modifiedTime,version")
        .execute()
    )
    version = f"{metadata.get('modifiedTime')}:{metadata.get('version')}"
    key = f"google_sync:version:{file_id}"
    previous = await redis.get(key)
    if previous == version:
        return None
    return version


async def _mark_resource_synced(redis: Redis, file_id: str, version: str) -> None:
    await redis.set(f"google_sync:version:{file_id}", version)


def _download_file(drive: object, file_id: str, mime_type: str) -> bytes:
    if mime_type == "application/vnd.google-apps.document":
        request = drive.files().export_media(
            fileId=file_id,
            mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
    else:
        request = drive.files().get_media(fileId=file_id)
    stream = io.BytesIO()
    downloader = MediaIoBaseDownload(stream, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    return stream.getvalue()


async def sync_drive_folder() -> int:
    """Import new or modified files from the configured Drive folder."""
    folder_id = settings.GOOGLE_DRIVE_FOLDER_ID
    drive = _build_drive_client()
    if drive is None or not folder_id:
        return 0
    response = (
        drive.files()
        .list(
            q=f"'{folder_id}' in parents and trashed = false",
            fields="nextPageToken, files(id,name,mimeType,modifiedTime)",
            pageSize=100,
        )
        .execute()
    )
    queued_ids: list[str] = []
    for remote in response.get("files", []):
        mime_type = remote["mimeType"]
        extension = SUPPORTED_MIME_TYPES.get(mime_type)
        if extension is None:
            continue

        source_id = f"google-drive:{remote['id']}"
        source_version = remote["modifiedTime"]
        async with async_session_factory() as session:
            result = await session.execute(select(Document).where(Document.source_id == source_id))
            document = result.scalar_one_or_none()
            if document and document.source_version == source_version:
                continue

            file_bytes = await asyncio.to_thread(
                _download_file, drive, remote["id"], mime_type
            )
            filename = remote["name"]
            if not Path(filename).suffix and extension:
                filename += extension
            object_name = f"google-drive/{remote['id']}/{source_version}_{filename}"
            await asyncio.to_thread(
                upload_document,
                "documents",
                object_name,
                file_bytes,
                mime_type,
            )

            old_object = document.file_path if document else None
            if document:
                await session.execute(
                    delete(DocumentChunk).where(DocumentChunk.document_id == document.id)
                )
                document.filename = filename
                document.file_path = object_name
                document.source_version = source_version
                document.status = "pending"
                document.error_message = None
            else:
                document = Document(
                    filename=filename,
                    file_path=object_name,
                    status="pending",
                    source="google_drive",
                    source_id=source_id,
                    source_version=source_version,
                )
                session.add(document)
            await session.commit()
            await session.refresh(document)
            queued_ids.append(str(document.id))

            if old_object and old_object != object_name:
                try:
                    await asyncio.to_thread(
                        minio_client.remove_object, "documents", old_object
                    )
                except Exception:
                    logger.exception("Could not remove obsolete MinIO object %s", old_object)

    for document_id in queued_ids:
        process_document_task.delay(document_id)
    return len(queued_ids)


async def _run_sync() -> None:
    if not settings.GOOGLE_SYNC_ENABLED:
        return
    redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)
    acquired = await redis.set(
        SYNC_LOCK_KEY,
        "1",
        ex=max(settings.GOOGLE_SYNC_INTERVAL_SECONDS * 60, 3600),
        nx=True,
    )
    if not acquired:
        logger.info("Google sync skipped because another run is active")
        await redis.aclose()
        return
    try:
        drive = _build_drive_client()
        product_version = await _changed_resource_version(
            redis, drive, settings.GOOGLE_PRODUCT_SPREADSHEET_ID
        )
        if product_version and settings.GOOGLE_PRODUCT_SPREADSHEET_ID:
            await sync_products()
            await _mark_resource_synced(
                redis, settings.GOOGLE_PRODUCT_SPREADSHEET_ID, product_version
            )
        document_version = await _changed_resource_version(
            redis, drive, settings.GOOGLE_SPREADSHEET_ID
        )
        if document_version and settings.GOOGLE_SPREADSHEET_ID:
            await sync_documents()
            await _mark_resource_synced(
                redis, settings.GOOGLE_SPREADSHEET_ID, document_version
            )
        queued = await sync_drive_folder()
        logger.info("Google synchronization completed; queued_files=%s", queued)
    finally:
        await redis.delete(SYNC_LOCK_KEY)
        await redis.aclose()
        await engine.dispose()


@celery_app.task(name="app.tasks.google_sync.sync_google_data")
def sync_google_data_task() -> None:
    """Celery Beat entry point for the 60-second Google synchronization."""
    asyncio.run(_run_sync())
