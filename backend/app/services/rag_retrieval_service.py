from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.document import LegalDocument
from app.models.document_upload import Document, DocumentChunk


@dataclass(slots=True)
class RetrievedSource:
    title: str
    content: str
    page: int | None
    source_type: str
    distance: float
    chapter: str | None = None
    article: str | None = None
    clause: str | None = None


class RagRetrievalService:
    """Hierarchical document selection followed by hybrid chunk retrieval."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def retrieve(
        self, query: str, query_embedding: list[float] | None, limit: int | None = None
    ) -> list[RetrievedSource]:
        final_limit = min(limit or settings.RAG_FINAL_CHUNKS, settings.RAG_FINAL_CHUNKS)
        document_ids = await self._select_documents(query_embedding) if query_embedding else []
        chunk_sources = await self._hybrid_chunks(query, query_embedding, document_ids)
        legal_sources = await self._legal_documents(query_embedding)
        candidates = [*chunk_sources, *legal_sources]
        candidates.sort(key=lambda item: item[0], reverse=True)

        selected: list[RetrievedSource] = []
        used_chars = 0
        seen_hashes: set[int] = set()
        for _, source in candidates:
            fingerprint = hash(source.content.strip().lower())
            if fingerprint in seen_hashes:
                continue
            if used_chars + len(source.content) > settings.RAG_MAX_CONTEXT_CHARS:
                continue
            selected.append(source)
            seen_hashes.add(fingerprint)
            used_chars += len(source.content)
            if len(selected) >= final_limit:
                break
        return selected

    async def _select_documents(self, embedding: list[float]) -> list[UUID]:
        distance = Document.embedding.cosine_distance(embedding).label("distance")
        statement = (
            select(Document.id, distance)
            .where(Document.status == "completed", Document.embedding.is_not(None))
            .order_by(distance)
            .limit(settings.RAG_DOCUMENT_CANDIDATES)
        )
        result = await self.session.execute(statement)
        return [row[0] for row in result.all()]

    async def _hybrid_chunks(
        self, query: str, embedding: list[float] | None, document_ids: list[UUID]
    ) -> list[tuple[float, RetrievedSource]]:
        vector_rows = []
        if embedding:
            distance = DocumentChunk.embedding.cosine_distance(embedding).label("distance")
            vector_statement = select(DocumentChunk, Document.filename, distance).join(Document, Document.id == DocumentChunk.document_id).where(DocumentChunk.embedding.is_not(None))
            if document_ids:
                vector_statement = vector_statement.where(DocumentChunk.document_id.in_(document_ids))
            vector_rows = (await self.session.execute(vector_statement.order_by(distance).limit(settings.RAG_VECTOR_CANDIDATES))).all()

        search_query = func.plainto_tsquery("simple", query)
        rank = func.ts_rank_cd(
            func.to_tsvector("simple", DocumentChunk.content), search_query
        ).label("rank")
        keyword_statement = (
            select(DocumentChunk, Document.filename, rank)
            .join(Document, Document.id == DocumentChunk.document_id)
            .where(func.to_tsvector("simple", DocumentChunk.content).op("@@")(search_query))
        )
        if document_ids:
            keyword_statement = keyword_statement.where(
                DocumentChunk.document_id.in_(document_ids)
            )
        keyword_rows = (
            await self.session.execute(
                keyword_statement.order_by(rank.desc()).limit(settings.RAG_KEYWORD_CANDIDATES)
            )
        ).all()

        scores: dict[UUID, float] = {}
        sources: dict[UUID, RetrievedSource] = {}
        for position, (chunk, filename, chunk_distance) in enumerate(vector_rows, start=1):
            scores[chunk.id] = scores.get(chunk.id, 0.0) + 1 / (60 + position)
            sources[chunk.id] = self._chunk_source(chunk, filename, float(chunk_distance))
        for position, (chunk, filename, _rank) in enumerate(keyword_rows, start=1):
            scores[chunk.id] = scores.get(chunk.id, 0.0) + 1 / (60 + position)
            sources.setdefault(chunk.id, self._chunk_source(chunk, filename, 1.0))
        return [(scores[chunk_id], source) for chunk_id, source in sources.items()]

    async def _legal_documents(
        self, embedding: list[float] | None
    ) -> list[tuple[float, RetrievedSource]]:
        if embedding is None:
            return []
        distance = LegalDocument.embedding.cosine_distance(embedding).label("distance")
        statement = (
            select(LegalDocument, distance)
            .where(LegalDocument.embedding.is_not(None))
            .order_by(distance)
            .limit(settings.RAG_DOCUMENT_CANDIDATES)
        )
        rows = (await self.session.execute(statement)).all()
        return [
            (
                1 / (60 + position),
                RetrievedSource(
                    title=document.title,
                    content=document.content,
                    page=None,
                    source_type="Google Sheets",
                    distance=float(doc_distance),
                ),
            )
            for position, (document, doc_distance) in enumerate(rows, start=1)
        ]

    @staticmethod
    def _chunk_source(
        chunk: DocumentChunk, filename: str, distance: float
    ) -> RetrievedSource:
        return RetrievedSource(
            title=filename,
            content=chunk.content,
            page=chunk.page_number,
            source_type="Document chunk",
            distance=distance,
            chapter=chunk.chapter,
            article=chunk.article,
            clause=chunk.clause,
        )
