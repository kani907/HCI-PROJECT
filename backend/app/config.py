from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    BASIC_PATH: Path
    RATINGS_PATH: Path
    PREFERENCES_PATH: Path
    ADMIN_NAME: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    TOTAL_VIDEOS: int

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
