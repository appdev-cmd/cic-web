from app.api.routes import auth, documents, engagements, leads, operations, products, rag
from app.core.config import settings
from app.core.module_registry import ModuleDefinition, ModuleRegistry
from app.modules.categories.definition import definition as categories_definition
from app.modules.system.definition import definition as system_definition

module_registry = ModuleRegistry()
module_registry.register(ModuleDefinition("auth", router=auth.router))
module_registry.register(ModuleDefinition("operations", router=operations.router))
module_registry.register(ModuleDefinition("leads", router=leads.router))
module_registry.register(ModuleDefinition("engagements", router=engagements.router))
module_registry.register(
    ModuleDefinition("products", enabled="products" not in settings.DISABLED_MODULES, router=products.router, capability_key="products")
)
module_registry.register(
    ModuleDefinition("documents", enabled="documents" not in settings.DISABLED_MODULES, router=documents.router, capability_key="documents")
)
module_registry.register(ModuleDefinition("rag", enabled="rag" not in settings.DISABLED_MODULES, router=rag.router, capability_key="chat"))
module_registry.register(categories_definition)
module_registry.register(system_definition)
