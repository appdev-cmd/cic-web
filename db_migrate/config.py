"""Local ETL connection settings loaded from environment variables only."""

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env.local")


def required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def port(name: str, default: int) -> int:
    raw = os.getenv(name, str(default)).strip()
    try:
        return int(raw)
    except ValueError as error:
        raise RuntimeError(f"Environment variable {name} must be an integer") from error


MYSQL = {
    "host": required("DB_MIGRATE_MYSQL_HOST"),
    "port": port("DB_MIGRATE_MYSQL_PORT", 3306),
    "user": required("DB_MIGRATE_MYSQL_USER"),
    "password": required("DB_MIGRATE_MYSQL_PASSWORD"),
    "database": required("DB_MIGRATE_MYSQL_DATABASE"),
}

POSTGRES = {
    "host": required("DB_MIGRATE_POSTGRES_HOST"),
    "port": port("DB_MIGRATE_POSTGRES_PORT", 5432),
    "user": required("DB_MIGRATE_POSTGRES_USER"),
    "password": required("DB_MIGRATE_POSTGRES_PASSWORD"),
    "dbname": required("DB_MIGRATE_POSTGRES_DATABASE"),
}

MANIFEST_PATH = os.getenv("DB_MIGRATE_MANIFEST_PATH", "manifest.json")
