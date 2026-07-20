import argparse
import asyncio

from sqlalchemy import delete, func, select, update

from app.db.session import async_session_factory
from app.models.document_upload import Document, DocumentChunk
from app.tasks.indexing import process_document_task


async def status() -> None:
    async with async_session_factory() as session:
        statuses = (await session.execute(select(Document.status, func.count()).group_by(Document.status))).all()
        chunk_count = await session.scalar(select(func.count()).select_from(DocumentChunk))
        chunk_vectors = await session.scalar(select(func.count()).select_from(DocumentChunk).where(DocumentChunk.embedding.is_not(None)))
        document_vectors = await session.scalar(select(func.count()).select_from(Document).where(Document.embedding.is_not(None)))
        print({"documents": dict(statuses), "document_vectors": document_vectors, "chunks": chunk_count, "chunk_vectors": chunk_vectors})
        failures = (await session.execute(select(Document.id, Document.filename, Document.source, Document.source_id, Document.file_path, Document.error_message).where(Document.status == "failed"))).all()
        for item in failures:
            print(f"FAILED|{item.id}|{item.filename}|{item.source}|{item.source_id}|{item.file_path}|{item.error_message}")


async def reset_and_queue() -> None:
    async with async_session_factory() as session:
        document_ids = list((await session.scalars(select(Document.id).order_by(Document.created_at))).all())
        await session.execute(delete(DocumentChunk))
        await session.execute(update(Document).values(embedding=None, summary=None, content_hash=None, status="pending", error_message=None))
        await session.commit()
    for document_id in document_ids:
        process_document_task.delay(str(document_id))
    print(f"queued={len(document_ids)}")


async def queue_incomplete() -> None:
    process_document_task.app.control.purge()
    async with async_session_factory() as session:
        document_ids = list((await session.scalars(select(Document.id).where(Document.status != "completed").order_by(Document.created_at))).all())
        await session.execute(update(Document).where(Document.status != "completed").values(embedding=None, summary=None, content_hash=None, status="pending", error_message=None))
        await session.commit()
    for document_id in document_ids:
        process_document_task.delay(str(document_id))
    print(f"queued_incomplete={len(document_ids)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("status", "reset-and-queue", "queue-incomplete"))
    args = parser.parse_args()
    if args.action == "status":
        asyncio.run(status())
    elif args.action == "reset-and-queue":
        asyncio.run(reset_and_queue())
    else:
        asyncio.run(queue_incomplete())
