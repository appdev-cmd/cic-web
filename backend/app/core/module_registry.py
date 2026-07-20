from collections.abc import Callable
from dataclasses import dataclass

from fastapi import APIRouter

HealthCheck = Callable[[], object]


@dataclass(frozen=True, slots=True)
class ModuleDefinition:
    name: str
    enabled: bool = True
    router: APIRouter | None = None
    permissions: tuple[str, ...] = ()
    task_names: tuple[str, ...] = ()
    health_checks: tuple[HealthCheck, ...] = ()
    capability_key: str | None = None
    dependencies: tuple[str, ...] = ()


class ModuleRegistry:
    def __init__(self) -> None:
        self._definitions: dict[str, ModuleDefinition] = {}

    def register(self, definition: ModuleDefinition) -> None:
        if definition.name in self._definitions:
            raise ValueError(f"Module đã được đăng ký: {definition.name}")
        self._definitions[definition.name] = definition

    def definitions(self) -> tuple[ModuleDefinition, ...]:
        return tuple(self._definitions.values())

    def enabled_definitions(self) -> tuple[ModuleDefinition, ...]:
        return tuple(item for item in self.definitions() if item.enabled)

    def include_routers(self, router: APIRouter) -> None:
        for definition in self.enabled_definitions():
            if definition.router is not None:
                router.include_router(definition.router)

    def capabilities(self) -> dict[str, bool]:
        return {
            definition.capability_key or definition.name: definition.enabled
            for definition in self.definitions()
        }

    def permissions(self) -> tuple[str, ...]:
        return tuple(
            permission
            for definition in self.enabled_definitions()
            for permission in definition.permissions
        )
