import re
from decimal import Decimal
from numbers import Real


CONTACT_PRICE_LABELS = {
    "lien he",
    "liên hệ",
    "contact",
    "call",
    "bao gia",
    "báo giá",
}


def parse_price(value: object) -> float | None:
    """Convert common Vietnamese spreadsheet price formats to a number.

    Text such as ``6,500,000 ₫`` or ``6.500.000 VNĐ`` becomes ``6500000``.
    Empty cells and contact-for-price labels are represented as ``None``.
    """
    if value is None:
        return None
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, Real) and not isinstance(value, bool):
        return float(value)

    raw = str(value).strip()
    if not raw:
        return None
    if raw.casefold() in CONTACT_PRICE_LABELS:
        return None

    numeric = re.sub(r"[^0-9,.-]", "", raw)
    if not numeric or numeric in {"-", ".", ","}:
        return None

    # Product prices are normally whole VND amounts. Repeated separators, or a
    # single separator followed by exactly three digits, are thousands marks.
    for separator in (",", "."):
        if numeric.count(separator) > 1:
            numeric = numeric.replace(separator, "")
    if "," in numeric and "." in numeric:
        numeric = numeric.replace(",", "").replace(".", "")
    elif "," in numeric:
        head, tail = numeric.rsplit(",", 1)
        numeric = head + tail if len(tail) == 3 else head + "." + tail
    elif "." in numeric:
        head, tail = numeric.rsplit(".", 1)
        numeric = head + tail if len(tail) == 3 else numeric

    try:
        return float(numeric)
    except ValueError:
        return None
