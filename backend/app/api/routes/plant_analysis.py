from fastapi import APIRouter
from app.schemas.plant_analysis import PlantAnalysisRequest, PlantAnalysisResponse
from app.services.plant_analysis_service import plant_analysis_service

router = APIRouter()

@router.post("/analyze", response_model=PlantAnalysisResponse)
async def analyze_plant(request: PlantAnalysisRequest):
    result = plant_analysis_service.analyze_plant(crop=request.crop)
    return PlantAnalysisResponse(success=True, data=result)
