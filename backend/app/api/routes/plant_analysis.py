from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.schemas.plant_analysis import PlantAnalysisRequest, PlantAnalysisResponse
from app.services.plant_analysis_service import plant_analysis_service
from app.services.plant_validator_service import plant_validator_service

router = APIRouter()

@router.post("/analyze", response_model=PlantAnalysisResponse)
async def analyze_plant(request: PlantAnalysisRequest):
    result = plant_analysis_service.analyze_plant(crop=request.crop)
    return PlantAnalysisResponse(success=True, status="analyzed", isPlant=True, data=result)

@router.post("/upload-and-analyze", response_model=PlantAnalysisResponse)
async def upload_and_analyze_plant(
    file: UploadFile = File(...),
    crop: Optional[str] = Form("Blueberry")
):
    """
    Two-Stage Plant Analysis with Stage 1 Validation:
    Validates that the uploaded image actually contains a plant before analyzing growth stages.
    """
    contents = await file.read()
    is_valid, error_msg, image = plant_validator_service.validate_file(
        file_bytes=contents,
        filename=file.filename or "plant.jpg",
        content_type=file.content_type
    )
    if not is_valid:
        return PlantAnalysisResponse(
            success=False,
            status="invalid_image",
            isPlant=False,
            plantConfidence=0.0,
            message=error_msg or "Invalid image file."
        )

    validation_result = plant_validator_service.classify_image(image)
    if not validation_result.isPlant:
        return PlantAnalysisResponse(
            success=False,
            status=validation_result.status,
            isPlant=False,
            plantConfidence=validation_result.confidence,
            message=validation_result.reason
        )

    # Valid plant -> proceed to analysis
    result = plant_analysis_service.analyze_plant(crop=crop or "Blueberry")
    return PlantAnalysisResponse(
        success=True,
        status="analyzed",
        isPlant=True,
        plantConfidence=validation_result.confidence,
        data=result
    )
