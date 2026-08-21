from pydantic import BaseModel
from typing import Optional, List

class PlantAnalysisRequest(BaseModel):
    crop: str

class PlantAnalysisResult(BaseModel):
    id: str
    date: str
    crop: str
    stage: str
    health_score: int
    disease_detected: Optional[str]
    notes: str
    fruit_count: int

class PlantAnalysisResponse(BaseModel):
    success: bool
    data: PlantAnalysisResult
