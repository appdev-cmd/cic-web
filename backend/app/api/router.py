from fastapi import APIRouter

from app.modules.registry import module_registry

api_router = APIRouter()
module_registry.include_routers(api_router)
