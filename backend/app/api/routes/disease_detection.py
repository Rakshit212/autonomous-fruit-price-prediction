from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.schemas.disease_detection import PlantValidationResult, DiseaseDetectionResponse
from app.services.plant_validator_service import plant_validator_service
from app.services.disease_detection_service import disease_detection_service
import base64

router = APIRouter()

@router.post("/validate-image", response_model=PlantValidationResult)
async def validate_plant_image(file: UploadFile = File(...)):
    """
    Stage 1 Standalone Endpoint:
    Validates whether the uploaded image contains valid plant foliage, crops, leaves, stems, or flowers.
    Does NOT run disease detection.
    """
    contents = await file.read()
    is_valid, error_msg, image = plant_validator_service.validate_file(
        file_bytes=contents, 
        filename=file.filename or "upload.jpg", 
        content_type=file.content_type
    )
    if not is_valid:
        return PlantValidationResult(
            isPlant=False,
            confidence=0.0,
            reason=error_msg or "Invalid image file.",
            status="invalid_image"
        )

    return plant_validator_service.classify_image(image)

@router.post("/analyze", response_model=DiseaseDetectionResponse)
async def analyze_plant_disease_pipeline(file: UploadFile = File(...)):
    """
    Two-Stage Image Analysis Pipeline:
    Stage 1: Plant Image Validation
    Stage 2: Disease Detection (ONLY invoked if Stage 1 confirms isPlant is True).
    """
    # Read image contents
    contents = await file.read()

    # Step 1: File integrity, format, and size validation
    is_valid, error_msg, image = plant_validator_service.validate_file(
        file_bytes=contents, 
        filename=file.filename or "upload.jpg", 
        content_type=file.content_type
    )
    if not is_valid:
        return DiseaseDetectionResponse(
            success=False,
            status="invalid_image",
            isPlant=False,
            plantConfidence=0.0,
            message=error_msg or "Invalid file format or size."
        )

    # Step 2: STAGE 1 - Plant Image Validation
    validation_result = plant_validator_service.classify_image(image)

    # GATEKEEPER CHECK:
    # If the image is NOT a verified plant, immediately reject and STOP processing!
    # The disease detection classifier MUST NEVER BE CALLED!
    if not validation_result.isPlant:
        return DiseaseDetectionResponse(
            success=False,
            status=validation_result.status,  # "invalid_image" or "uncertain_image"
            isPlant=False,
            plantConfidence=validation_result.confidence,
            message=validation_result.reason
        )

    # Step 3: STAGE 2 - Disease Detection
    # Only reaches here if Stage 1 confirmed valid plant image!
    try:
        response = disease_detection_service.analyze_plant_disease(
            image=image, 
            validation_result=validation_result
        )
        return response
    except Exception as e:
        return DiseaseDetectionResponse(
            success=False,
            status="error",
            isPlant=True,
            plantConfidence=validation_result.confidence,
            message="We couldn't complete the disease analysis. Please try again with another clear plant image."
        )
