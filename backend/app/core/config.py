import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroVision AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    class Config:
        env_file = ".env"

settings = Settings()
