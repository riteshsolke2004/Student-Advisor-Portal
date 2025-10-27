from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings from environment variables"""

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # JWT Configuration
    JWT_SECRET_KEY: str = "YOUR_SECRET_KEY"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS Configuration
    CORS_ORIGINS: str = ""

    # Firebase Configuration
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_CREDENTIALS: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_PATH: str = "serviceAccountKey.json"

    # Application Limits
    MESSAGE_LENGTH_LIMIT: int = 2000
    ROOM_MEMBERS_LIMIT: int = 100
    FILE_SIZE_LIMIT_MB: int = 10

    # Pydantic v2 config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",   # so extra vars in .env won't crash
    )

@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings"""
    return Settings()