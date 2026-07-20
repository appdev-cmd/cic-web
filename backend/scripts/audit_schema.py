import asyncio

from sqlalchemy import text

from app.db.session import engine


async def main() -> None:
    async with engine.connect() as connection:
        result = await connection.execute(
            text(
                "SELECT table_name FROM information_schema.tables "
                "WHERE table_schema = 'public' AND table_type = 'BASE TABLE' "
                "ORDER BY table_name"
            )
        )
        tables = list(result.scalars())
        print("TABLES", tables)

        for table in tables:
            if table != "alembic_version":
                count = await connection.scalar(text(f'SELECT count(*) FROM "{table}"'))
                print(f"{table}: {count}")

        links = (
            await connection.execute(
                text(
                    "SELECT count(*) FILTER (WHERE category IS NOT NULL "
                    "AND length(btrim(category)) > 0) AS legacy, "
                    "count(*) FILTER (WHERE category_id IS NOT NULL) AS linked "
                    "FROM products"
                )
            )
        ).one()
        print("PRODUCT_CATEGORY_LINKS", links)

        orphan_count = await connection.scalar(
            text(
                "SELECT count(*) FROM products p "
                "LEFT JOIN product_categories c ON c.id = p.category_id "
                "WHERE p.category_id IS NOT NULL AND c.id IS NULL"
            )
        )
        print("ORPHANS", orphan_count)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
