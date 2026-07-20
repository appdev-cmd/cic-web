from fastapi import APIRouter

from app.core.module_registry import ModuleDefinition, ModuleRegistry


def test_registry_only_includes_enabled_modules() -> None:
    enabled_router = APIRouter()
    enabled_router.add_api_route("/enabled", lambda: {"ok": True})
    disabled_router = APIRouter()
    disabled_router.add_api_route("/disabled", lambda: {"ok": True})

    registry = ModuleRegistry()
    registry.register(ModuleDefinition("enabled", enabled=True, router=enabled_router))
    registry.register(ModuleDefinition("disabled", enabled=False, router=disabled_router))
    root = APIRouter()
    registry.include_routers(root)

    assert len(root.routes) == 1
    included_router = root.routes[0]
    paths = {route.path for route in included_router.original_router.routes}
    assert "/enabled" in paths
    assert "/disabled" not in paths
    assert registry.capabilities() == {"enabled": True, "disabled": False}


def test_registry_rejects_duplicate_module_names() -> None:
    registry = ModuleRegistry()
    registry.register(ModuleDefinition("products"))

    try:
        registry.register(ModuleDefinition("products"))
    except ValueError as exc:
        assert "products" in str(exc)
    else:
        raise AssertionError("Registry phải từ chối module trùng tên")
