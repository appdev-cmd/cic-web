from app.core.module_registry import ModuleDefinition
from app.modules.system.router import router

definition = ModuleDefinition(name="system", router=router, capability_key="system")
