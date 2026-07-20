from app.core.features.repository import FeatureRepository
from app.core.config import settings


class FeatureService:
    def __init__(self, repository: FeatureRepository | None = None) -> None:
        self.repository = repository or FeatureRepository()

    def states_for_role(self, role: str) -> dict[str, bool]:
        states: dict[str, bool] = {}
        for feature in self.repository.list():
            enabled = feature.enabled_by_default
            if feature.name in settings.ENABLED_FEATURES:
                enabled = True
            if feature.name in settings.DISABLED_FEATURES:
                enabled = False
            states[feature.name] = enabled and (not feature.roles or role in feature.roles)
        return states

    def is_enabled(self, name: str, role: str) -> bool:
        return self.states_for_role(role).get(name, False)
