HUMAN_ADVISOR_TERMS = (
    "người thật", "nhân viên tư vấn", "tư vấn viên", "chuyên viên", "gọi lại",
    "liên hệ tôi", "liên hệ lại", "gặp nhân viên", "gặp tư vấn", "hỗ trợ trực tiếp",
)

ADVANCED_PRODUCT_TERMS = (
    "chuyên sâu", "chi tiết kỹ thuật", "tư vấn kỹ", "giải pháp tổng thể",
    "triển khai", "tích hợp", "tương thích", "khảo sát", "demo", "báo giá",
    "đặt mua", "mua số lượng", "dự án", "doanh nghiệp",
)


def contact_reason(query: str, *, is_product_query: bool) -> str | None:
    normalized = " ".join(query.casefold().split())
    if any(term in normalized for term in HUMAN_ADVISOR_TERMS):
        return "human_advisor"
    if is_product_query and any(term in normalized for term in ADVANCED_PRODUCT_TERMS):
        return "advanced_product_advice"
    return None
