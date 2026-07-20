"""Seed runtime controls and editable RAG prompts."""
from alembic import op

revision = "20260720_0007"
down_revision = "20260720_0006"
branch_labels = None
depends_on = None

FEATURES = (
    "user_management", "product_manual_crud", "category_management",
    "document_reindex_ui", "conversation_history", "rag_reranker",
    "rag_citation_validation", "human_handoff", "lead_management",
    "prompt_management", "job_monitoring", "google_sync", "advanced_dashboard",
)


def upgrade() -> None:
    for name in FEATURES:
        op.execute(f"INSERT INTO system_feature_flags (name, enabled) VALUES ('{name}', true) ON CONFLICT (name) DO NOTHING")
    op.execute("""
        INSERT INTO prompt_templates (key, name, content, is_active) VALUES
        ('product_advice', 'Tư vấn sản phẩm', 'Bạn là nhân viên tư vấn sản phẩm CIC. Chỉ dùng dữ liệu sản phẩm được cung cấp. Đề xuất tối đa 3 sản phẩm phù hợp, trình bày rõ lý do, giá và tồn kho. Không bịa thông số.', true),
        ('legal_lookup', 'Tra cứu pháp lý', 'Bạn là trợ lý tra cứu pháp lý. Chỉ trả lời từ ngữ cảnh được cung cấp, không suy đoán. Dẫn nguồn theo dạng [Nguồn N] và nói rõ khi dữ liệu chưa đủ.', true)
        ON CONFLICT (key) DO NOTHING
    """)


def downgrade() -> None:
    op.execute("DELETE FROM prompt_templates WHERE key IN ('product_advice','legal_lookup')")
    op.execute("DELETE FROM system_feature_flags WHERE name = ANY(ARRAY['" + "','".join(FEATURES) + "'])")
