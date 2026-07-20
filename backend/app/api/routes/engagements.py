import re
import uuid
from datetime import date, time, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.conversation import Conversation, Message
from app.models.lead import CustomerLead, LeadStatusHistory
from app.models.product import Product
from app.models.user import User

router = APIRouter(prefix="/engagements", tags=["customer engagements"])


def _phone(value: str) -> str:
    digits = re.sub(r"\D", "", value)
    if len(digits) not in (9, 10, 11):
        raise HTTPException(status_code=422, detail="Số điện thoại không hợp lệ")
    return digits


async def _owned_conversation(session: AsyncSession, conversation_id: uuid.UUID, user: User) -> Conversation:
    result = await session.execute(select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user.id))
    conversation = result.scalar_one_or_none()
    if conversation is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hội thoại của tài khoản này")
    return conversation


async def _lead(session: AsyncSession, *, conversation: Conversation, name: str, phone: str, need: str, product: str | None = None) -> CustomerLead:
    lead = CustomerLead(full_name=name.strip(), phone_number=_phone(phone), customer_need=need, product_interest=product, conversation_id=conversation.id, source="chat", status="new")
    session.add(lead)
    await session.flush()
    session.add(LeadStatusHistory(lead_id=lead.id, new_status="new", note="Tạo từ thao tác trong chatbot"))
    return lead


class QuotationCreate(BaseModel):
    conversation_id: uuid.UUID
    product_id: uuid.UUID
    customer_name: str = Field(min_length=2, max_length=255)
    phone_number: str = Field(min_length=9, max_length=20)
    quantity: int = Field(ge=1, le=999)


class AppointmentCreate(BaseModel):
    conversation_id: uuid.UUID
    customer_name: str = Field(min_length=2, max_length=255)
    phone_number: str = Field(min_length=9, max_length=20)
    appointment_date: date
    appointment_time: time
    channel: str = Field(min_length=2, max_length=50)


class FeedbackCreate(BaseModel):
    message_id: uuid.UUID
    helpful: bool
    reason: str | None = Field(default=None, max_length=2000)


@router.post("/quotations", status_code=status.HTTP_201_CREATED)
async def create_quotation(payload: QuotationCreate, session: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    conversation = await _owned_conversation(session, payload.conversation_id, user)
    product = await session.get(Product, payload.product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    lead = await _lead(session, conversation=conversation, name=payload.customer_name, phone=payload.phone_number, need=f"Yêu cầu báo giá {payload.quantity} {product.unit or 'sản phẩm'}", product=product.name)
    total = float(product.price or 0) * payload.quantity
    result = await session.execute(text("insert into quotations (lead_id,product_id,product_name,quantity,customer_name,phone_number,total,status) values (:lead_id,:product_id,:product_name,:quantity,:customer_name,:phone,:total,'submitted') returning id,status"), {"lead_id": lead.id, "product_id": product.id, "product_name": product.name, "quantity": payload.quantity, "customer_name": payload.customer_name.strip(), "phone": _phone(payload.phone_number), "total": total})
    row = result.mappings().one()
    await session.commit()
    return {"id": row["id"], "status": row["status"], "total": total, "message": "Đã tạo yêu cầu báo giá. Chuyên viên CIC sẽ xác nhận giá chính thức."}


@router.post("/appointments", status_code=status.HTTP_201_CREATED)
async def create_appointment(payload: AppointmentCreate, session: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    if datetime.combine(payload.appointment_date, payload.appointment_time) <= datetime.now():
        raise HTTPException(status_code=422, detail="Thời gian tư vấn phải ở trong tương lai")
    conversation = await _owned_conversation(session, payload.conversation_id, user)
    lead = await _lead(session, conversation=conversation, name=payload.customer_name, phone=payload.phone_number, need="Đặt lịch tư vấn")
    result = await session.execute(text("insert into appointments (lead_id,customer_name,phone_number,appointment_date,appointment_time,channel,status) values (:lead_id,:name,:phone,:day,:time,:channel,'scheduled') returning id,status"), {"lead_id": lead.id, "name": payload.customer_name.strip(), "phone": _phone(payload.phone_number), "day": payload.appointment_date, "time": payload.appointment_time, "channel": payload.channel})
    row = result.mappings().one()
    await session.commit()
    return {"id": row["id"], "status": row["status"], "message": "Đã đặt lịch tư vấn thành công."}


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def create_feedback(payload: FeedbackCreate, session: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await session.execute(select(Message).join(Conversation).where(Message.id == payload.message_id, Message.role == "assistant", Conversation.user_id == user.id))
    if result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy câu trả lời của tài khoản này")
    created = await session.execute(text("insert into customer_feedback (message_id,helpful,reason) values (:message_id,:helpful,:reason) returning id"), {"message_id": payload.message_id, "helpful": payload.helpful, "reason": payload.reason})
    feedback_id = created.scalar_one()
    await session.commit()
    return {"id": feedback_id, "message": "Cảm ơn anh/chị đã phản hồi."}
