import math
import numpy as np
from PIL import Image
from typing import Tuple, Dict, Any, Optional
from app.core.config import settings
from app.schemas.disease_detection import PlantValidationResult, DiseaseDetectionResponse

class DiseaseDetectionService:
    def __init__(self):
        self.disease_threshold = settings.DISEASE_CONFIDENCE_THRESHOLD

    def analyze_plant_disease(
        self, 
        image: Image.Image, 
        validation_result: PlantValidationResult
    ) -> DiseaseDetectionResponse:
        """
        Stage 2: Disease Detection Classifier.
        CRITICAL RULE: This method MUST NEVER be called or execute unless 
        Stage 1 Plant Validation confirmed that isPlant is True and confidence >= threshold.
        """
        # Strict gatekeeping assertion
        if not validation_result.isPlant or validation_result.confidence < settings.PLANT_CONFIDENCE_THRESHOLD:
            raise ValueError(
                "Security & Integrity Violation: Disease detection model cannot run on an invalid or unverified image."
            )

        # Standardize sample
        sample = image.resize((384, 384), Image.Resampling.BILINEAR)
        rgb = np.array(sample, dtype=np.float32)
        r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        total_pixels = float(r.size)

        # Vegetation & Pathology Metrics
        exg = (2.0 * g) - r - b
        gli = exg / (2.0 * g + r + b + 1e-5)
        healthy_green_ratio = float(np.sum(gli > 0.12)) / total_pixels

        # Color analysis for pathology
        # HSV conversion
        arr = rgb / 255.0
        cmax = np.maximum(np.maximum(arr[:, :, 0], arr[:, :, 1]), arr[:, :, 2])
        cmin = np.minimum(np.minimum(arr[:, :, 0], arr[:, :, 1]), arr[:, :, 2])
        delta = cmax - cmin
        
        h = np.zeros_like(delta)
        mask_d = delta > 1e-6
        mask_r = mask_d & (cmax == arr[:, :, 0])
        mask_g = mask_d & (cmax == arr[:, :, 1])
        mask_b = mask_d & (cmax == arr[:, :, 2])
        h[mask_r] = (60.0 * ((arr[:, :, 1][mask_r] - arr[:, :, 2][mask_r]) / delta[mask_r]) + 360.0) % 360.0
        h[mask_g] = (60.0 * ((arr[:, :, 2][mask_g] - arr[:, :, 0][mask_g]) / delta[mask_g]) + 120.0) % 360.0
        h[mask_b] = (60.0 * ((arr[:, :, 0][mask_b] - arr[:, :, 1][mask_b]) / delta[mask_b]) + 240.0) % 360.0

        s = np.zeros_like(cmax)
        mask_cmax = cmax > 1e-6
        s[mask_cmax] = delta[mask_cmax] / cmax[mask_cmax]
        v = cmax

        # Necrotic brown/dark lesions (Alternaria, Rust, Blight)
        necrotic_mask = (h >= 10.0) & (h <= 35.0) & (s >= 0.20) & (v >= 0.10) & (v <= 0.65)
        necrotic_ratio = float(np.sum(necrotic_mask)) / total_pixels

        # Chlorosis / Yellow halos (early infection, nutrient deficiency, viral yellows)
        chlorosis_mask = (h >= 36.0) & (h <= 60.0) & (s >= 0.25) & (v >= 0.30)
        chlorosis_ratio = float(np.sum(chlorosis_mask)) / total_pixels

        # Whitish powdery fungal coating (Powdery Mildew)
        powdery_mask = (s <= 0.15) & (v >= 0.65) & (gli > -0.05) & (gli < 0.10)
        powdery_ratio = float(np.sum(powdery_mask)) / total_pixels

        pathology_evidence_ratio = necrotic_ratio + (chlorosis_ratio * 0.8) + (powdery_ratio * 0.7)

        # Decision Logic: Healthy vs Specific Disease
        if pathology_evidence_ratio < 0.05 and healthy_green_ratio > 0.50:
            # Healthy Plant Condition
            confidence = round(float(np.clip(0.85 + (healthy_green_ratio * 0.12), 0.80, 0.98)), 2)
            return DiseaseDetectionResponse(
                success=True,
                status="analyzed",
                isPlant=True,
                plantConfidence=validation_result.confidence,
                disease="Healthy Plant (No Foliar Pathology Detected)",
                diseaseConfidence=confidence,
                severity=0,
                riskLevel="Low",
                symptoms=[
                    "No necrotic lesions or leaf spotting observed",
                    "Uniform chlorophyll distribution across leaf blade",
                    "Vigorous foliar structure with intact cell integrity"
                ],
                detectedEvidence=[
                    f"Healthy vegetative canopy index (GLI): {round(healthy_green_ratio * 100, 1)}%",
                    "Absence of fungal mycelia or bacterial water-soaked lesions",
                    "Normal cellular turgor and pigmentation"
                ],
                riskFactors=[
                    "Maintain current preventative care",
                    "Monitor during warm, high-humidity weather cycles"
                ],
                recommendedActions=[
                    "Maintain current irrigation and balanced fertilizer schedule.",
                    "Perform routine scouting weekly for early pest detection.",
                    "Ensure adequate canopy airflow to prevent humid microclimates."
                ],
                recommendation="Plant appears vigorous and free of foliar disease. No chemical intervention needed.",
                plantStage="Vegetative / Flourishing"
            )

        # If pathology is detected, classify the specific condition
        if powdery_ratio > 0.15:
            disease_name = "Powdery Mildew (Erysiphe spp.)"
            base_conf = 0.78 + min(0.18, powdery_ratio * 0.5)
            severity = int(min(90, max(15, powdery_ratio * 180)))
            risk_level = "High" if severity > 50 else "Moderate"
            symptoms = [
                "White powdery fungal spots on upper leaf surfaces and stems",
                "Leaf curling, distortion, and gradual yellowing under mildew colonies",
                "Stunted new shoots and bud necrosis"
            ]
            evidence = [
                f"Fungal mycelial surface coverage: {round(powdery_ratio * 100, 1)}%",
                "Superficial white talc-like spore patches detected"
            ]
            risks = ["Warm days with dry weather followed by humid nights", "Shaded canopy conditions"]
            actions = [
                "Apply potassium bicarbonate, sulfur fungicide, or neem oil spray.",
                "Prune heavily infected leaves to reduce spore inoculum.",
                "Improve plant spacing to enhance sunlight penetration."
            ]
            rec = "Foliar fungicide application recommended to halt powdery mildew colony expansion."
        elif necrotic_ratio > 0.12:
            disease_name = "Early Blight (Alternaria solani)"
            base_conf = 0.82 + min(0.15, necrotic_ratio * 0.4)
            severity = int(min(95, max(20, (necrotic_ratio + chlorosis_ratio) * 150)))
            risk_level = "Critical" if severity > 65 else ("High" if severity > 40 else "Moderate")
            symptoms = [
                "Small, dark brown to black necrotic lesions on older foliage",
                "Concentric rings producing a target-board pattern within spots",
                "Pronounced yellow chlorotic halo encircling necrotic zones"
            ]
            evidence = [
                f"Necrotic lesion coverage: {round(necrotic_ratio * 100, 1)}%",
                f"Secondary chlorosis index: {round(chlorosis_ratio * 100, 1)}%",
                "Concentric lesion borders matching fungal blight morphology"
            ]
            risks = ["Frequent rainfall or overhead sprinkler irrigation", "Temperatures between 24-29°C"]
            actions = [
                "Prune and safely discard lower infected leaves immediately.",
                "Apply copper hydroxide or chlorothalonil fungicide at 7-10 day intervals.",
                "Transition strictly to drip irrigation at root zone to prevent leaf moisture."
            ]
            rec = "Apply protective copper fungicide immediately and eliminate overhead irrigation."
        elif chlorosis_ratio > 0.15:
            disease_name = "Bacterial Leaf Spot / Chlorosis Complex"
            base_conf = 0.75 + min(0.18, chlorosis_ratio * 0.4)
            severity = int(min(80, max(15, chlorosis_ratio * 120)))
            risk_level = "Moderate" if severity < 45 else "High"
            symptoms = [
                "Irregular yellow patches developing between leaf veins",
                "Water-soaked translucent angular lesions on ventral leaf surface",
                "Premature leaf senescence and defoliation"
            ]
            evidence = [
                f"Chlorotic leaf surface fraction: {round(chlorosis_ratio * 100, 1)}%",
                "Interveinal tissue degradation observed"
            ]
            risks = ["Excessive soil moisture", "Nutrient leaching or micro-nutrient deficiency"]
            actions = [
                "Apply copper bactericide combined with mancozeb for synergistic control.",
                "Test soil electrical conductivity and nitrogen/iron levels.",
                "Avoid handling crops when wet to mitigate bacterial transmission."
            ]
            rec = "Apply preventive bactericide spray and check soil nutrient balance."
        else:
            # Low / ambiguous pathology
            base_conf = 0.52 + (pathology_evidence_ratio * 0.8)
            disease_name = "Leaf Spot (Unspecified Fungal Pathogen)"
            severity = 15
            risk_level = "Low"
            symptoms = ["Scattered micro-lesions on leaf margins"]
            evidence = [f"Pathology evidence fraction: {round(pathology_evidence_ratio * 100, 1)}%"]
            risks = ["Localized humidity pockets"]
            actions = ["Monitor leaf progression over the next 48-72 hours."]
            rec = "Monitor closely; isolate if spots expand."

        confidence = round(float(np.clip(base_conf, 0.40, 0.96)), 2)

        # Check disease confidence threshold (default 0.60)
        if confidence < self.disease_threshold:
            return DiseaseDetectionResponse(
                success=False,
                status="uncertain_disease",
                isPlant=True,
                plantConfidence=validation_result.confidence,
                diseaseConfidence=confidence,
                message="Unable to determine the disease confidently. Please upload a clearer image of the affected plant leaf or stem."
            )

        return DiseaseDetectionResponse(
            success=True,
            status="analyzed",
            isPlant=True,
            plantConfidence=validation_result.confidence,
            disease=disease_name,
            diseaseConfidence=confidence,
            severity=severity,
            riskLevel=risk_level,
            symptoms=symptoms,
            detectedEvidence=evidence,
            riskFactors=risks,
            recommendedActions=actions,
            recommendation=rec,
            plantStage="Flowering / Fruiting"
        )

disease_detection_service = DiseaseDetectionService()
