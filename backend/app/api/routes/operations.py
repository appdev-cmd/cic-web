from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole

router = APIRouter(prefix="/operations", tags=["admin operations"])

RESOURCES = {
    "conversations": ("conversations", "updated_at", ("id", "session_id", "status", "current_intent", "handoff", "updated_at")),
    "leads": ("customer_leads", "created_at", ("id", "full_name", "phone_number", "customer_need", "product_interest", "status", "created_at")),
    "quotations": ("quotations", "created_at", ("id", "customer_name", "phone_number", "product_name", "quantity", "total", "status", "created_at")),
    "appointments": ("appointments", "appointment_date", ("id", "customer_name", "phone_number", "appointment_date", "appointment_time", "channel", "status")),
    "feedback": ("customer_feedback", "created_at", ("id", "message_id", "helpful", "reason", "created_at")),
}

@router.get("/summary")
async def summary(session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN))):
    names = {"products": "products", "documents": "legal_documents", **{key: value[0] for key, value in RESOURCES.items()}}
    output = {}
    for key, table in names.items():
        output[key] = (await session.execute(text(f'SELECT count(*) FROM "{table}"'))).scalar_one()
    return output

@router.get("/{resource}")
async def list_resource(resource: str, limit: int = 100, session: AsyncSession = Depends(get_db), _: User = Depends(require_roles(UserRole.ADMIN))):
    config = RESOURCES.get(resource)
    if not config:
        raise HTTPException(status_code=404, detail="Nhóm dữ liệu không tồn tại")
    table, order_by, columns = config
    safe_limit = min(max(limit, 1), 500)
    result = await session.execute(text(f'SELECT {", ".join(columns)} FROM "{table}" ORDER BY "{order_by}" DESC LIMIT {safe_limit}'))
    return [dict(row._mapping) for row in result]
