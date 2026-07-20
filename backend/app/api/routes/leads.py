import re
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.lead import CustomerLead, HumanHandoff, LeadStatusHistory
from app.models.user import User

router = APIRouter(prefix="/leads", tags=["customer leads"])


class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    phone_number: str = Field(min_length=9, max_length=20)
    email: EmailStr | None = None
    company: str | None = Field(default=None, max_length=255)
    customer_need: str = Field(min_length=3, max_length=4000)
    product_interest: str | None = Field(default=None, max_length=2000)
    conversation_id: uuid.UUID
    contact_reason: str = Field(default="human_advisor", max_length=100)


class LeadCreated(BaseModel):
    id: uuid.UUID
    status: str
    message: str


@router.post("/", response_model=LeadCreated, status_code=status.HTTP_201_CREATED)
async def create_lead(
    payload: LeadCreate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> LeadCreated:
    digits = re.sub(r"\D", "", payload.phone_number)
    if len(digits) not in (9, 10, 11):
        raise HTTPException(status_code=422, detail="Số điện thoại không hợp lệ")

    result = await session.execute(
        select(Conversation).where(
            Conversation.id == payload.conversation_id,
            Conversation.user_id == user.id,
        )
    )
    conversation = result.scalar_one_or_none()
    if conversation is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hội thoại của khách hàng")

    lead = CustomerLead(
        full_name=payload.full_name.strip(),
        phone_number=digits,
        email=str(payload.email) if payload.email else None,
        company=payload.company.strip() if payload.company else None,
        customer_need=payload.customer_need.strip(),
        product_interest=payload.product_interest.strip() if payload.product_interest else None,
        conversation_id=conversation.id,
        source="chat",
        status="new",
    )
    session.add(lead)
    await session.flush()
    session.add(LeadStatusHistory(lead_id=lead.id, new_status="new", note="Khách hàng gửi thông tin từ chatbot"))
    session.add(HumanHandoff(
        conversation_id=conversation.id,
        lead_id=lead.id,
        reason=payload.contact_reason,
        priority="high" if payload.contact_reason == "human_advisor" else "normal",
    ))
    conversation.handoff = True
    conversation.status = "waiting_for_advisor"
    await session.commit()
    return LeadCreated(id=lead.id, status=lead.status, message="Đã ghi nhận thông tin. Chuyên viên CIC sẽ liên hệ sớm.")
