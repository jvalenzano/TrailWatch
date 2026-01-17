from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://user:password@localhost:5432/trailwatch"
    google_cloud_project: Optional[str] = None
    google_cloud_location: Optional[str] = None
    google_genai_use_vertexai: bool = False

    model_config = SettingsConfigDict(env_file=(".env", ".env.test"), extra="ignore")

settings = Settings()
