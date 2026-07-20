import argparse
import asyncio

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import async_session_factory
from app.models.user import User, UserRole


async def create_user(email: str, password: str, full_name: str, role: UserRole) -> None:
    async with async_session_factory() as session:
        existing = await session.scalar(select(User).where(User.email == email))
        if existing:
            existing.full_name = full_name
            existing.hashed_password = hash_password(password)
            existing.role = role
            existing.is_active = True
            action = "updated"
        else:
            session.add(User(email=email, full_name=full_name, hashed_password=hash_password(password), role=role, is_active=True))
            action = "created"
        await session.commit()
        print(f"{action}:{email}:{role.value}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or update a RAG CIC user")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--role", choices=[role.value for role in UserRole], default=UserRole.EMPLOYEE.value)
    args = parser.parse_args()
    asyncio.run(create_user(args.email, args.password, args.name, UserRole(args.role)))
