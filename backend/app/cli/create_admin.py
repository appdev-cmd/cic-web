import asyncio
import os

from app.core.security import hash_password
from app.db.session import async_session_factory
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


async def create_admin() -> None:
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    password = os.environ["ADMIN_PASSWORD"]
    full_name = os.getenv("ADMIN_FULL_NAME", "System Administrator")
    async with async_session_factory() as session:
        user = await UserRepository(session).get_by_email(email)
        if user:
            user.hashed_password = hash_password(password)
            user.full_name = full_name
            await session.commit()
            print(f"Updated existing admin {email} password to the current .env value")
            return
        session.add(
            User(
                email=email,
                full_name=full_name,
                hashed_password=hash_password(password),
                role=UserRole.ADMIN,
            )
        )
        await session.commit()
        print(f"Created admin {email}")


if __name__ == "__main__":
    asyncio.run(create_admin())
