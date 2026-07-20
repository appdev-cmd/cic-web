import pytest

from app.utils.price import parse_price


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("6,500,000 ₫", 6_500_000.0),
        ("16.000.000 VNĐ", 16_000_000.0),
        ("2 950 000 đ", 2_950_000.0),
        (6500000, 6_500_000.0),
        ("Liên hệ", None),
        ("Báo giá", None),
        ("", None),
        (None, None),
    ],
)
def test_parse_price(raw, expected):
    assert parse_price(raw) == expected
