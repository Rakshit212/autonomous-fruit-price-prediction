import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroVision AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    PLANT_CONFIDENCE_THRESHOLD: float = float(os.getenv("PLANT_CONFIDENCE_THRESHOLD", "0.80"))
    DISEASE_CONFIDENCE_THRESHOLD: float = float(os.getenv("DISEASE_CONFIDENCE_THRESHOLD", "0.60"))
    MAX_IMAGE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB
    MIN_IMAGE_DIMENSION: int = 50

    class Config:
        env_file = ".env"

settings = Settings()
