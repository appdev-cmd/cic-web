import uuid
from sqlalchemy import case, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product


class ProductRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, product_id: uuid.UUID) -> Product | None:
        return await self.session.get(Product, product_id)

    async def get_by_sku(self, sku: str) -> Product | None:
        result = await self.session.execute(
            select(Product).where(Product.sku == sku.strip())
        )
        return result.scalar_one_or_none()

    async def create_product(self, product: Product) -> Product:
        self.session.add(product)
        return product

    async def list_products(
        self, skip: int = 0, limit: int = 50, category: str | None = None
    ) -> list[Product]:
        stmt = select(Product)
        if category:
            stmt = stmt.where(Product.category == category.strip())
        stmt = stmt.offset(skip).limit(limit).order_by(Product.sku)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def search_by_keyword(self, query: str, limit: int = 10) -> list[Product]:
        """Tìm kiếm từ khóa thô bằng ILIKE trên SKU, tên, mô tả, thương hiệu, công dụng, thông số, tiêu chuẩn."""
        stopwords = {"sản", "phẩm", "thiết", "bị", "giá", "bao", "nhiêu", "cho", "tôi", "giúp", "tư", "vấn", "của", "công", "ty", "đang", "có", "nào"}
        tokens = [token.strip("?.!;:()[]").casefold() for token in query.replace("/", " ").replace(",", " ").split()]
        tokens = [token for token in tokens if len(token) >= 2 and token not in stopwords]
        filters = []
        token_matches = []
        for token in (tokens or [query]):
            search_filter = f"%{token}%"
            matches = (
                Product.sku.ilike(search_filter), Product.name.ilike(search_filter),
                Product.description.ilike(search_filter), Product.brand.ilike(search_filter),
                Product.utility.ilike(search_filter), Product.use_case.ilike(search_filter),
                Product.specifications.ilike(search_filter), Product.standards.ilike(search_filter),
            )
            filters.extend(matches)
            token_matches.append(or_(*matches))
        relevance = sum((case((match, 1), else_=0) for match in token_matches), 0)
        stmt = (
            select(Product)
            .where(or_(*filters))
            .order_by(relevance.desc(), Product.name.asc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def search_by_semantic(
        self, query_embedding: list[float], limit: int = 10
    ) -> list[tuple[Product, float]]:
        """Tìm kiếm tương đồng ngữ nghĩa bằng khoảng cách Cosine của pgvector."""
        # cosine_distance = 1 - cosine_similarity
        distance_col = Product.embedding.cosine_distance(query_embedding).label("distance")
        stmt = (
            select(Product, distance_col)
            .order_by("distance")
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return [(row[0], float(row[1])) for row in result.all() if row[1] is not None]
