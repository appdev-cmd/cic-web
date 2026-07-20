from app.core.module_registry import ModuleDefinition
from app.core.config import settings
from app.modules.categories.permissions import PERMISSIONS
from app.modules.categories.router import router

definition = ModuleDefinition(
    name="categories",
    enabled="categories" not in settings.DISABLED_MODULES,
    router=router,
    permissions=PERMISSIONS,
    capability_key="categories",
)
