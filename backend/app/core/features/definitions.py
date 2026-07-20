from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class FeatureDefinition:
    name: str
    enabled_by_default: bool
    description: str
    roles: tuple[str, ...] = ()


FEATURE_DEFINITIONS = (
    FeatureDefinition("user_management", False, "Quản lý người dùng"),
    FeatureDefinition("product_manual_crud", False, "CRUD sản phẩm thủ công"),
    FeatureDefinition("category_management", True, "Quản lý danh mục sản phẩm"),
    FeatureDefinition("document_reindex_ui", True, "Reindex tài liệu trên giao diện"),
    FeatureDefinition("conversation_history", False, "Lịch sử hội thoại"),
    FeatureDefinition("rag_reranker", False, "Reranker cho RAG"),
    FeatureDefinition("rag_citation_validation", False, "Kiểm chứng citation"),
    FeatureDefinition("human_handoff", False, "Chuyển nhân viên hỗ trợ"),
    FeatureDefinition("lead_management", False, "Quản lý lead"),
    FeatureDefinition("prompt_management", False, "Quản lý prompt"),
    FeatureDefinition("job_monitoring", False, "Theo dõi tác vụ nền"),
    FeatureDefinition("google_sync", False, "Đồng bộ Google"),
    FeatureDefinition("advanced_dashboard", False, "Dashboard nâng cao"),
)
