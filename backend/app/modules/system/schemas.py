from pydantic import BaseModel


class FeatureState(BaseModel):
    name: str
    enabled: bool
    description: str


class CapabilityResponse(BaseModel):
    modules: dict[str, bool]
    features: dict[str, bool]
    permissions: list[str]
