from functools import lru_cache
from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed application configuration."""

    model_config = SettingsConfigDict(env_file="../.env", extra="ignore", case_sensitive=True)

    APP_NAME: str = "RAG CIC API"
    APP_ENV: Literal["development", "test", "production"] = "development"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "development-only-secret-change-me-123"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = (
        "postgresql+asyncpg://rag_cic:rag_cic_dev_password@localhost:5432/rag_cic"
    )
    REDIS_URL: str = "redis://localhost:6379/0"
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # LLM Configuration
    LLM_PROVIDER: str = "gemini"
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4.1-mini"
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "gemini-embedding-001"
    GEMINI_EMBEDDING_DIMENSIONS: int = 768
    GEMINI_EMBEDDING_INTERVAL_SECONDS: float = 3.0
    GEMINI_EMBEDDING_MAX_RETRIES: int = 100
    
    # Google Configuration
    GOOGLE_SERVICE_ACCOUNT_FILE: str | None = None
    GOOGLE_SPREADSHEET_ID: str | None = None
    GOOGLE_DRIVE_FOLDER_ID: str | None = None
    GOOGLE_SHEET_RANGE: str | None = None
    GOOGLE_WORKSHEET_NAME: str = "1. Luật Xây dựng"
    GOOGLE_PRODUCT_SPREADSHEET_ID: str | None = None
    GOOGLE_PRODUCT_WORKSHEET_NAME: str = "Trang tính1"
    GOOGLE_SYNC_ENABLED: bool = False
    GOOGLE_SYNC_INTERVAL_SECONDS: int = 60
    PRODUCT_CHROMA_COLLECTION: str = "products"
    CUSTOMER_LEADS_EXCEL_PATH: str = "data/customer_leads.xlsx"
    
    # RAG & Validation Configuration
    EMBEDDING_BATCH_SIZE: int = 64
    RAG_DOCUMENT_CANDIDATES: int = 12
    RAG_VECTOR_CANDIDATES: int = 30
    RAG_KEYWORD_CANDIDATES: int = 30
    RAG_FINAL_CHUNKS: int = 8
    RAG_MAX_CONTEXT_CHARS: int = 24000
    PRODUCT_MAX_SEMANTIC_DISTANCE: float = 0.65
    VIETNAM_MOBILE_PREFIXES: str = "03,05,07,08,09"
    REJECT_DEMO_PHONES: bool = False
    SEED_SAMPLE_DOCUMENTS: bool = False
    ANONYMIZED_TELEMETRY: bool = False
    DISABLED_MODULES: set[str] = set()
    ENABLED_FEATURES: set[str] = set()
    DISABLED_FEATURES: set[str] = set()
    
    # MinIO Configuration
    MINIO_ROOT_USER: str = "minioadmin"
    MINIO_ROOT_PASSWORD: str = "change-me-minio"
    MINIO_ENDPOINT: str = "minio:9000"

    @model_validator(mode="after")
    def reject_default_secret_in_production(self) -> "Settings":
        if self.APP_ENV == "production" and (
            "change-me" in self.SECRET_KEY or "development-only" in self.SECRET_KEY
        ):
            raise ValueError("SECRET_KEY mặc định không được phép trong production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
