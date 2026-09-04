from pydantic import BaseModel, Field
from typing import Optional, List

class PlantValidationResult(BaseModel):
    isPlant: bool
    confidence: float
    reason: str
    status: str = "valid"  # "valid", "invalid_image", "uncertain_image"
    details: Optional[dict] = None

class DiseaseDetectionResponse(BaseModel):
    success: bool
    status: str  # "analyzed", "invalid_image", "uncertain_image", "uncertain_disease", "error"
    isPlant: bool
    plantConfidence: float
    message: Optional[str] = None
    
    # Disease details (ONLY populated if isPlant is True and diseaseConfidence >= threshold)
    disease: Optional[str] = None
    diseaseConfidence: Optional[float] = None
    severity: Optional[int] = None
    riskLevel: Optional[str] = None  # "Low", "Moderate", "High", "Critical"
    symptoms: Optional[List[str]] = None
    detectedEvidence: Optional[List[str]] = None
    riskFactors: Optional[List[str]] = None
    recommendedActions: Optional[List[str]] = None
    recommendation: Optional[str] = None
    plantStage: Optional[str] = None
    imageUrl: Optional[str] = None
