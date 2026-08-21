import uuid
import datetime
from app.schemas.plant_analysis import PlantAnalysisResult

class PlantAnalysisService:
    @staticmethod
    def analyze_plant(crop: str) -> PlantAnalysisResult:
        # Generate mock data
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return PlantAnalysisResult(
            id=str(uuid.uuid4())[:8],
            date=now,
            crop=crop.capitalize(),
            stage="Full Bloom",
            health_score=85,
            disease_detected="None",
            notes="Plant appears healthy. Good canopy development.",
            fruit_count=1245
        )

plant_analysis_service = PlantAnalysisService()
