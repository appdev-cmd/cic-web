from app.core.features.definitions import FEATURE_DEFINITIONS, FeatureDefinition


class FeatureRepository:
    """Config-backed feature store; database overrides can be added without changing callers."""

    def list(self) -> tuple[FeatureDefinition, ...]:
        return FEATURE_DEFINITIONS
