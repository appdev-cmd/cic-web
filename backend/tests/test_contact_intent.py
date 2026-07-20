import pytest

from app.services.contact_intent import contact_reason


@pytest.mark.parametrize(
    ("query", "is_product", "expected"),
    [
        ("Tôi muốn gặp người thật để tư vấn", False, "human_advisor"),
        ("Nhờ nhân viên tư vấn gọi lại", True, "human_advisor"),
        ("Tôi cần báo giá 20 bản quyền", True, "advanced_product_advice"),
        ("Tư vấn giải pháp tổng thể cho doanh nghiệp", True, "advanced_product_advice"),
        ("Giá 3DsMax là bao nhiêu?", True, None),
        ("Điều kiện cấp phép xây dựng?", False, None),
    ],
)
def test_contact_reason(query, is_product, expected):
    assert contact_reason(query, is_product_query=is_product) == expected
