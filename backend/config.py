# backend/config.py

from pydantic_settings import BaseSettings
from functools import lru_cache
from motor.motor_asyncio import AsyncIOMotorClient


class Settings(BaseSettings):
    # MongoDB
    MONGO_URI: str
    DATABASE_NAME: str

    # JWT settings
    JWT_SECRET: str
    JWT_ALGORITHM: str

    # SMTP Email configuration
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_SENDER: str
    MAIL_PASSWORD: str

    class Config:
        env_file = "./backend/.env"  # relative path from project root


@lru_cache()
def get_settings():
    return Settings()


# Load settings once
settings = get_settings()

# MongoDB client
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]
