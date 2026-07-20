import pytest

from app.api.routes.rag import _is_product_query


@pytest.mark.parametrize(
    "query",
    (
        "Phần mềm render 3D nào đang có?",
        "CIC có bán bản quyền Revit không?",
        "Tư vấn giải pháp BIM",
        "What software licenses are available?",
    ),
)
def test_software_and_service_queries_are_product_queries(query: str) -> None:
    assert _is_product_query(query) is True


def test_explicit_legal_query_is_not_a_product_query() -> None:
    assert _is_product_query("Điều kiện cấp giấy phép xây dựng là gì?") is False
