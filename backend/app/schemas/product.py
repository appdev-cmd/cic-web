import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    sku: str = Field(..., max_length=100)
    name: str = Field(..., max_length=255)
    category: str | None = Field(None, max_length=100)
    brand: str | None = Field(None, max_length=255)
    description: str | None = None
    utility: str | None = None
    use_case: str | None = None
    power: str | None = Field(None, max_length=100)
    weight: str | None = Field(None, max_length=100)
    warranty: str | None = Field(None, max_length=100)
    specifications: str | None = None
    standards: str | None = None
    price: float | None = None
    unit: str | None = Field(None, max_length=50)
    stock: int | None = None
    product_link: str | None = Field(None, max_length=512)
    image_link: str | None = Field(None, max_length=512)
    catalogue_link: str | None = Field(None, max_length=512)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    category: str | None = Field(None, max_length=100)
    brand: str | None = Field(None, max_length=255)
    description: str | None = None
    utility: str | None = None
    use_case: str | None = None
    power: str | None = Field(None, max_length=100)
    weight: str | None = Field(None, max_length=100)
    warranty: str | None = Field(None, max_length=100)
    specifications: str | None = None
    standards: str | None = None
    price: float | None = None
    unit: str | None = Field(None, max_length=50)
    stock: int | None = None
    product_link: str | None = Field(None, max_length=512)
    image_link: str | None = Field(None, max_length=512)
    catalogue_link: str | None = Field(None, max_length=512)


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ProductSearchResponse(BaseModel):
    product: ProductOut
    score: float
