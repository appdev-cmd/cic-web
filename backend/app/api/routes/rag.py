import re
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.models.system_config import FeatureFlag, PromptTemplate
from app.core.features.service import FeatureService
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductOut
from app.services.embedding_service import get_embedding
from app.services.llm_service import LLMUnavailableError, call_llm
from app.services.rag_retrieval_service import RagRetrievalService
from app.services.contact_intent import contact_reason

router = APIRouter(prefix="/rag", tags=["rag"])
LEGAL_DISCLAIMER = (
    "Thông tin trên nhằm hỗ trợ tra cứu và không thay thế ý kiến tư vấn chuyên môn."
)
PRODUCT_TERMS = (
    "sản phẩm", "thiết bị", "giá", "báo giá", "tồn kho", "còn hàng", "mua", "tư vấn",
    "máy khoan", "máy cắt", "máy đo", "bảo hộ", "dụng cụ", "công suất", "bảo hành", "thương hiệu",
)

# Product catalogue questions are not limited to physical machines. CIC also
# sells software licences and technical services, so these terms must be routed
# to the product database instead of the legal-document index.
PRODUCT_CATALOG_TERMS = (
    "phần mềm", "software", "ứng dụng", "bản quyền", "license", "licence",
    "dịch vụ", "giải pháp", "render", "3d", "bim", "cad", "revit",
    "autocad", "sketchup", "lumion", "enscape", "v-ray", "vray",
)


def _is_product_query(query: str) -> bool:
    normalized = query.casefold()
    return any(term in normalized for term in (*PRODUCT_TERMS, *PRODUCT_CATALOG_TERMS))


async def _active_prompt(session: AsyncSession, key: str, fallback: str) -> str:
    try:
        item = (await session.execute(select(PromptTemplate).where(PromptTemplate.key == key, PromptTemplate.is_active.is_(True)))).scalar_one_or_none()
        return item.content if item else fallback
    except (AttributeError, TypeError):
        return fallback


async def _feature_enabled(session: AsyncSession, name: str) -> bool:
    enabled = FeatureService().is_enabled(name, "admin")
    try:
        flag = (await session.execute(select(FeatureFlag).where(FeatureFlag.name == name))).scalar_one_or_none()
        return flag.enabled if flag is not None else enabled
    except (AttributeError, TypeError):
        return enabled


def _validate_citations(answer: str, source_count: int) -> str:
    invalid = False
    def replace(match: re.Match[str]) -> str:
        nonlocal invalid
        if int(match.group(1)) <= source_count:
            return match.group(0)
        invalid = True
        return ""
    cleaned = re.sub(r"\[Nguồn\s+(\d+)\]", replace, answer, flags=re.IGNORECASE)
    if invalid:
        cleaned = cleaned.rstrip() + "\n\nLưu ý: hệ thống đã loại bỏ trích dẫn không khớp với dữ liệu tra cứu."
    return cleaned


async def _answer_product_query(query: str, session: AsyncSession) -> "QueryResponse":
    repository = ProductRepository(session)
    products = await repository.search_by_keyword(query, limit=6)
    if not products:
        products = await repository.list_products(limit=6)
    if not products:
        return QueryResponse(answer="Hiện chưa có dữ liệu sản phẩm phù hợp trong hệ thống.", sources=[])
    blocks = []
    for product in products:
        price = f"{float(product.price):,.0f} đồng" if product.price is not None else "Liên hệ"
        stock = str(product.stock) if product.stock is not None else "chưa cập nhật"
        blocks.append(
            f"- {product.name} (SKU: {product.sku}); danh mục: {product.category or 'chưa phân loại'}; "
            f"thương hiệu: {product.brand or 'chưa cập nhật'}; giá: {price}; tồn kho: {stock}; "
            f"công dụng: {product.use_case or product.utility or product.description or 'chưa cập nhật'}; "
            f"công suất: {product.power or 'chưa cập nhật'}; bảo hành: {product.warranty or 'chưa cập nhật'}."
        )
    prompt = "DỮ LIỆU SẢN PHẨM:\n" + "\n".join(blocks) + f"\n\nNHU CẦU KHÁCH HÀNG: {query}"
    instruction = await _active_prompt(session, "product_advice", (
        "Bạn là nhân viên tư vấn sản phẩm của CIC. Chỉ dùng dữ liệu sản phẩm được cung cấp. "
        "Hãy đề xuất tối đa 3 sản phẩm phù hợp, nêu ngắn gọn lý do, giá và tồn kho. "
        "Không bịa thông số; nếu thiếu dữ liệu hãy nói rõ chưa cập nhật."
    ))
    try:
        answer = await call_llm(prompt, instruction)
    except LLMUnavailableError:
        recommendations = []
        for product in products[:3]:
            price = f"{float(product.price):,.0f} đồng" if product.price is not None else "Liên hệ"
            recommendations.append(
                f"- **{product.name}** (SKU: {product.sku}) — Giá: {price}; tồn kho: {product.stock if product.stock is not None else 'chưa cập nhật'}."
            )
        answer = "Dịch vụ AI đang bận, nhưng tôi đã tra cứu được các sản phẩm phù hợp trong dữ liệu CIC:\n\n" + "\n".join(recommendations)
    return QueryResponse(
        answer=answer,
        sources=[],
        products=[ProductOut.model_validate(product) for product in products[:3]],
    )


class QueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    limit: int = Field(default=8, ge=1, le=8)
    conversation_id: uuid.UUID | None = None


class SourceItem(BaseModel):
    title: str
    content: str
    page: int | None = None
    source_type: str
    distance: float
    chapter: str | None = None
    article: str | None = None
    clause: str | None = None


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceItem]
    conversation_id: uuid.UUID | None = None
    requires_contact: bool = False
    contact_reason: str | None = None
    message_id: uuid.UUID | None = None
    products: list[ProductOut] = Field(default_factory=list)


async def _get_conversation(
    session: AsyncSession, user: User, conversation_id: uuid.UUID | None
) -> Conversation:
    if conversation_id:
        result = await session.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user.id,
            )
        )
        conversation = result.scalar_one_or_none()
        if conversation is None:
            raise HTTPException(status_code=404, detail="Không tìm thấy hội thoại của tài khoản này")
        return conversation
    conversation = Conversation(user_id=user.id, session_id=f"{user.id}:{uuid.uuid4()}")
    session.add(conversation)
    await session.flush()
    return conversation


async def _save_exchange(
    session: AsyncSession,
    conversation: Conversation,
    query: str,
    response: QueryResponse,
    intent: str,
) -> QueryResponse:
    conversation.current_intent = intent
    session.add(Message(conversation_id=conversation.id, role="user", content=query, intent=intent))
    assistant_message = Message(conversation_id=conversation.id, role="assistant", content=response.answer, intent=intent)
    session.add(assistant_message)
    await session.flush()
    await session.commit()
    response.conversation_id = conversation.id
    response.message_id = assistant_message.id
    return response


@router.post("/query", response_model=QueryResponse)
async def query_rag(
    payload: QueryRequest,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> QueryResponse:
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")
    conversation = await _get_conversation(session, user, payload.conversation_id)
    is_product = _is_product_query(query)
    reason = contact_reason(query, is_product_query=is_product)
    if reason == "human_advisor":
        response = QueryResponse(
            answer=("Tôi sẽ chuyển yêu cầu đến chuyên viên CIC. Anh/chị vui lòng để lại "
                    "họ tên và số điện thoại trong biểu mẫu bên dưới để chúng tôi liên hệ."),
            sources=[], requires_contact=True, contact_reason=reason,
        )
        return await _save_exchange(session, conversation, query, response, "human_handoff")
    if is_product:
        response = await _answer_product_query(query, session)
        if reason:
            response.requires_contact = True
            response.contact_reason = reason
            response.answer += "\n\nNếu cần tư vấn chuyên sâu theo dự án, anh/chị vui lòng để lại thông tin để chuyên viên CIC liên hệ."
        return await _save_exchange(session, conversation, query, response, "product_advice")
    try:
        embedding = await get_embedding(query, max_retries=1)
    except Exception:
        embedding = None
    sources = await RagRetrievalService(session).retrieve(query, embedding, payload.limit)
    if not sources:
        response = QueryResponse(
            answer=f"Chưa có đủ dữ liệu để trả lời câu hỏi này.\n\n{LEGAL_DISCLAIMER}",
            sources=[],
        )
        return await _save_exchange(session, conversation, query, response, "legal_lookup")

    blocks: list[str] = []
    for index, source in enumerate(sources, start=1):
        location = " — ".join(
            value
            for value in (source.chapter, source.article, source.clause)
            if value
        )
        blocks.append(
            f"[Nguồn {index}] {source.title}"
            f"{f' — {location}' if location else ''}"
            f"{f' — trang {source.page}' if source.page else ''}\n{source.content}"
        )

    system_instruction = await _active_prompt(session, "legal_lookup", (
        "Bạn là trợ lý tra cứu pháp lý. Chỉ trả lời bằng thông tin trong ngữ cảnh. "
        "Không suy đoán hoặc bổ sung kiến thức bên ngoài. Dẫn nguồn theo dạng [Nguồn N], "
        "nêu số hiệu, điều và khoản khi ngữ cảnh có cung cấp. Nếu ngữ cảnh không đủ, "
        "hãy nói rõ chưa có đủ dữ liệu."
    ))
    prompt = (
        "NGỮ CẢNH:\n\n"
        + "\n\n".join(blocks)
        + f"\n\nCÂU HỎI: {query}\n\nHãy trả lời ngắn gọn, chính xác và có dẫn nguồn."
    )
    try:
        answer = await call_llm(prompt, system_instruction)
    except LLMUnavailableError:
        excerpts = [source.content.strip()[:600] for source in sources[:3] if source.content.strip()]
        answer = "Dịch vụ AI đang bận. Nội dung liên quan đã tra cứu được trong dữ liệu pháp lý:\n\n" + "\n\n".join(excerpts)
    if await _feature_enabled(session, "rag_citation_validation"):
        answer = _validate_citations(answer, len(sources))
    if LEGAL_DISCLAIMER not in answer:
        answer = f"{answer.rstrip()}\n\n{LEGAL_DISCLAIMER}"
    response = QueryResponse(answer=answer, sources=[])
    return await _save_exchange(session, conversation, query, response, "legal_lookup")
