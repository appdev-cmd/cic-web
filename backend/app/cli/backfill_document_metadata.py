import asyncio

from sqlalchemy import select

from app.db.session import async_session_factory
from app.models.document_upload import Document, DocumentChunk
from app.services.document_processor import extract_legal_metadata


async def backfill() -> None:
    async with async_session_factory() as session:
        documents = (await session.execute(select(Document).where(Document.status == "completed"))).scalars().all()
        for document in documents:
            contents = (await session.execute(
                select(DocumentChunk.content)
                .where(DocumentChunk.document_id == document.id)
                .order_by(DocumentChunk.chunk_index)
            )).scalars().all()
            metadata = extract_legal_metadata("\n".join(contents), document.filename)
            document.document_number = metadata.document_number
            document.legal_title = metadata.legal_title
            document.issue_date = metadata.issue_date
            document.expiration_date = metadata.expiration_date
            document.signer = metadata.signer
        await session.commit()


if __name__ == "__main__":
    asyncio.run(backfill())
