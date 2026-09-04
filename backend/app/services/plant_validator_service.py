import io
import math
import numpy as np
from PIL import Image
from typing import Tuple, Optional
from app.core.config import settings
from app.schemas.disease_detection import PlantValidationResult

class PlantValidatorService:
    def __init__(self):
        self.plant_threshold = settings.PLANT_CONFIDENCE_THRESHOLD
        self.max_size_bytes = settings.MAX_IMAGE_SIZE_BYTES
        self.min_dimension = settings.MIN_IMAGE_DIMENSION
        self.allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        self.allowed_extensions = [".jpg", ".jpeg", ".png"]

    def validate_file(self, file_bytes: bytes, filename: str, content_type: Optional[str] = None) -> Tuple[bool, Optional[str], Optional[Image.Image]]:
        """
        Validates file size, integrity, MIME type, and decodability.
        Returns (is_valid, error_message, PIL.Image).
        """
        # Check empty file
        if not file_bytes or len(file_bytes) == 0:
            return False, "Uploaded file is empty.", None

        # Check maximum file size (5MB)
        if len(file_bytes) > self.max_size_bytes:
            return False, f"Image is too large. Maximum allowed size is {self.max_size_bytes // (1024 * 1024)} MB.", None

        # Check file extension
        ext = ""
        if filename and "." in filename:
            ext = "." + filename.rsplit(".", 1)[-1].lower()
            if ext not in self.allowed_extensions:
                return False, "Unsupported image format. Please upload JPG, JPEG, or PNG.", None

        # Check MIME type if provided
        if content_type and content_type.lower() not in self.allowed_types:
            # If extension is valid allow it, otherwise reject
            if ext not in self.allowed_extensions:
                return False, "Unsupported image format. Please upload JPG, JPEG, or PNG.", None

        # Try decoding image with Pillow
        try:
            image = Image.open(io.BytesIO(file_bytes))
            image.load()  # Force reading entire image data
        except Exception:
            return False, "Unable to read this image. Please upload a valid JPG, JPEG, or PNG image.", None

        # Validate format
        if image.format not in ["JPEG", "PNG", "MPO"]:
            return False, "Unsupported image format. Please upload JPG, JPEG, or PNG.", None

        # Validate dimensions
        width, height = image.size
        if width < self.min_dimension or height < self.min_dimension:
            return False, f"Image resolution is too small ({width}x{height}). Minimum required is {self.min_dimension}x{self.min_dimension} pixels.", None

        # Convert RGBA/Palette to RGB
        if image.mode != "RGB":
            image = image.convert("RGB")

        return True, None, image

    def assess_quality(self, image: Image.Image) -> Tuple[bool, Optional[str]]:
        """
        Checks for extreme darkness, brightness, or severe blurriness.
        Returns (is_clear, reason_if_unclear).
        """
        # Resize for fast metric computation
        small = image.resize((256, 256), Image.Resampling.BILINEAR)
        gray = np.array(small.convert("L"), dtype=np.float32)

        mean_val = float(np.mean(gray))
        
        # Check extreme darkness (underexposure / pitch black)
        if mean_val < 15.0 or np.mean(gray < 10) > 0.85:
            return False, "Image is too dark to clearly identify plant structures."

        # Check extreme brightness (overexposure / blank white)
        if mean_val > 245.0 or np.mean(gray > 245) > 0.85:
            return False, "Image is overexposed or contains mostly white space."

        # Compute Laplacian variance for blurriness detection
        # Simple 3x3 discrete Laplacian filter kernel:
        # [ 0,  1,  0]
        # [ 1, -4,  1]
        # [ 0,  1,  0]
        padded = np.pad(gray, 1, mode="edge")
        laplacian = (
            padded[:-2, 1:-1] +
            padded[2:, 1:-1] +
            padded[1:-1, :-2] +
            padded[1:-1, 2:] -
            4.0 * gray
        )
        blur_variance = float(np.var(laplacian))

        # Severely blurry images have very low Laplacian variance
        if blur_variance < 8.0:
            return False, "Image is too blurry to identify plant features clearly."

        return True, None

    def _rgb_to_hsv_np(self, rgb_array: np.ndarray) -> np.ndarray:
        """Vectorized RGB to HSV conversion in numpy."""
        arr = rgb_array.astype(np.float32) / 255.0
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        cmax = np.maximum(np.maximum(r, g), b)
        cmin = np.minimum(np.minimum(r, g), b)
        delta = cmax - cmin

        h = np.zeros_like(delta)
        # delta != 0
        mask_d = delta > 1e-6
        mask_r = mask_d & (cmax == r)
        mask_g = mask_d & (cmax == g)
        mask_b = mask_d & (cmax == b)

        h[mask_r] = (60.0 * ((g[mask_r] - b[mask_r]) / delta[mask_r]) + 360.0) % 360.0
        h[mask_g] = (60.0 * ((b[mask_g] - r[mask_g]) / delta[mask_g]) + 120.0) % 360.0
        h[mask_b] = (60.0 * ((r[mask_b] - g[mask_b]) / delta[mask_b]) + 240.0) % 360.0

        s = np.zeros_like(cmax)
        mask_cmax = cmax > 1e-6
        s[mask_cmax] = delta[mask_cmax] / cmax[mask_cmax]

        v = cmax
        return np.stack([h, s, v], axis=-1)

    def classify_image(self, image: Image.Image) -> PlantValidationResult:
        """
        Stage 1: Performs visual content validation to determine if the image is a plant.
        Combines:
          1. Quality assessment (darkness, overexposure, blur).
          2. Agricultural Indices: ExG (Excess Green), GLI (Green Leaf Index).
          3. Diseased/Necrotic Leaf & Floral/Fruit Signatures.
          4. Non-Plant Discriminators: YCbCr Skin (human), Paper/Doc, Metallic/Neutral (vehicles/electronics),
             Rectilinear Architecture Gradients (buildings/furniture).
        """
        # Step A: Image Quality Assessment
        is_clear, quality_reason = self.assess_quality(image)
        if not is_clear:
            return PlantValidationResult(
                isPlant=False,
                confidence=0.45,
                reason=quality_reason or "Image quality is insufficient. Please upload a clear photo.",
                status="uncertain_image"
            )

        # Step B: Standardize resolution for analysis (384x384)
        sample = image.resize((384, 384), Image.Resampling.BILINEAR)
        rgb = np.array(sample, dtype=np.float32)
        r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        total_pixels = float(r.size)

        # Step C: Agricultural Vegetation Indices
        # 1. Excess Green Index (ExG): 2*G - R - B
        exg = (2.0 * g) - r - b
        mean_exg = float(np.mean(exg))

        # HSV Color Space Analysis
        hsv = self._rgb_to_hsv_np(rgb)
        h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]

        # 2. True Plant Foliage Chlorophyll Signature:
        # Green channel dominance, adequate brightness, and non-neutral saturation
        green_mask = (g > r + 6.0) & (g > b + 6.0) & (g >= 55.0) & (s >= 0.18)
        gli = np.zeros_like(exg)
        denom = 2.0 * g + r + b
        valid_denom = denom > 1e-5
        gli[valid_denom] = exg[valid_denom] / denom[valid_denom]

        gli_healthy_ratio = float(np.sum(green_mask & (gli > 0.08))) / total_pixels
        exg_strong_ratio = float(np.sum(green_mask & (exg > 25.0))) / total_pixels
        exg_pos_ratio = float(np.sum(green_mask & (exg > 10.0))) / total_pixels

        # 3. Diseased / Necrotic / Chlorotic Leaf Signature (Yellowing, Blight spots, Rust)
        # Chlorosis: yellow/amber leaf tissue (R & G both vibrant, low B, non-food balanced)
        chlorosis_mask = (r >= 60.0) & (g >= 60.0) & (np.abs(r - g) <= 35.0) & (g > b + 25.0) & (s >= 0.20)
        # Necrotic brown lesions/spots within foliage
        necrotic_mask = (r >= 60.0) & (r <= 165.0) & (g >= 45.0) & (g <= 145.0) & (b <= 75.0) & (r > b + 15.0) & (g > b + 10.0) & (s >= 0.22)
        diseased_leaf_ratio = float(np.sum(chlorosis_mask | necrotic_mask)) / total_pixels

        # 4. Flower / Fruit Pigmentation (berries, tomatoes, blossoms) with plant foliage context
        floral_fruit_mask = (
            (((h >= 340.0) | (h <= 15.0)) | ((h >= 270.0) & (h <= 340.0))) & 
            (s >= 0.35) & (v >= 0.20)
        )
        floral_fruit_ratio = float(np.sum(floral_fruit_mask)) / total_pixels

        # 5. Organic Texture & Spatial Gradient
        gray = np.array(sample.convert("L"), dtype=np.float32)
        gx = np.abs(gray[:, 1:] - gray[:, :-1])
        gy = np.abs(gray[1:, :] - gray[:-1, :])
        mean_gx = float(np.mean(gx))
        mean_gy = float(np.mean(gy))
        edge_energy = (mean_gx + mean_gy) / 2.0
        # Rectilinear alignment ratio (man-made structures have large axis imbalance)
        grad_ratio = abs(mean_gx - mean_gy) / (mean_gx + mean_gy + 1e-5)

        # Step D: Non-Plant Discriminators
        # 1. Human Skin Tone Detection (YCbCr Standard Model)
        cb = 128.0 - (0.168736 * r) - (0.331264 * g) + (0.5 * b)
        cr = 128.0 + (0.5 * r) - (0.418688 * g) - (0.081312 * b)
        skin_mask = (cr >= 133.0) & (cr <= 173.0) & (cb >= 77.0) & (cb <= 127.0)
        skin_ratio = float(np.sum(skin_mask)) / total_pixels

        # 2. Document / Paper / Screenshot Profile
        # Large uniform white/light background with high contrast dark marks
        paper_mask = (v >= 0.88) & (s <= 0.10)
        paper_ratio = float(np.sum(paper_mask)) / total_pixels

        # 3. Metallic / Asphalt / Electronic Device Neutral Profile
        neutral_mask = (s <= 0.12) | ((r < 60.0) & (g < 60.0) & (b < 65.0))
        neutral_ratio = float(np.sum(neutral_mask)) / total_pixels

        # 4. Architecture / Building Grid Lines
        building_score = 1.0 if (grad_ratio > 0.35 and neutral_ratio > 0.40) else 0.0

        # Step E: Multi-Factor Scoring & Confidence Computation
        confidence = 0.0

        # Plant Evidence
        if gli_healthy_ratio > 0.20 or exg_strong_ratio > 0.20:
            # Clear healthy green vegetation / canopy
            confidence = 0.75 + min(0.23, gli_healthy_ratio * 0.30)
        elif gli_healthy_ratio > 0.08 or exg_pos_ratio > 0.20:
            confidence = 0.60 + (gli_healthy_ratio * 1.5)
        elif diseased_leaf_ratio > 0.15 and (gli_healthy_ratio > 0.03 or exg_pos_ratio > 0.05):
            # Predominantly diseased/chlorotic leaf with foliar context
            confidence = 0.72 + min(0.22, diseased_leaf_ratio * 0.45)
        elif floral_fruit_ratio > 0.15 and (exg_pos_ratio > 0.05 or gli_healthy_ratio > 0.05):
            # Fruiting or flowering crop with foliage
            confidence = 0.72 + min(0.25, (floral_fruit_ratio * 0.45) + (gli_healthy_ratio * 0.35))
        else:
            # Minimal organic plant presence
            confidence = 0.08 + (exg_pos_ratio * 0.30) + (diseased_leaf_ratio * 0.20)

        # Texture adjustment
        if 4.0 <= edge_energy <= 35.0:
            confidence += 0.04  # Organic cellular/leaf venation
        elif edge_energy < 2.0 and gli_healthy_ratio < 0.20 and diseased_leaf_ratio < 0.20:
            confidence -= 0.20  # Flat synthetic non-plant surface

        # Negative Penalties for Non-Plant Classes
        # Human face/body
        if skin_ratio > 0.35 and gli_healthy_ratio < 0.15:
            confidence = min(confidence, 0.12)
        elif skin_ratio > 0.20 and gli_healthy_ratio < 0.10:
            confidence = min(confidence, 0.20)

        # Documents/Screenshots
        if paper_ratio > 0.55 and gli_healthy_ratio < 0.05:
            confidence = min(confidence, 0.05)

        # Cars/Vehicles/Electronics/Asphalt
        if neutral_ratio > 0.50 and gli_healthy_ratio < 0.08:
            confidence = min(confidence, 0.15)
        elif neutral_ratio > 0.35 and gli_healthy_ratio < 0.05:
            confidence = min(confidence, 0.25)

        # Buildings / Architectural structures
        if building_score > 0.5 and gli_healthy_ratio < 0.08:
            confidence = min(confidence, 0.18)

        # Clamp confidence
        confidence = float(np.clip(confidence, 0.01, 0.99))
        confidence = round(confidence, 2)

        # Step F: Gatekeeping Classification Decision
        if confidence >= self.plant_threshold:
            return PlantValidationResult(
                isPlant=True,
                confidence=confidence,
                reason="Plant leaf/crop structure detected with clear organic foliage features.",
                status="valid",
                details={
                    "gli_healthy_ratio": round(gli_healthy_ratio, 3),
                    "exg_pos_ratio": round(exg_pos_ratio, 3),
                    "diseased_leaf_ratio": round(diseased_leaf_ratio, 3),
                    "edge_energy": round(edge_energy, 2)
                }
            )
        elif confidence >= 0.50:
            return PlantValidationResult(
                isPlant=False,
                confidence=confidence,
                reason="Image not clear enough: lacks distinct plant structures or is ambiguous.",
                status="uncertain_image",
                details={
                    "gli_healthy_ratio": round(gli_healthy_ratio, 3),
                    "confidence": confidence
                }
            )
        else:
            reason = "No meaningful plant content detected."
            if skin_ratio > 0.20:
                reason = "Human subject detected. Please upload an image of a plant, crop, or leaf."
            elif paper_ratio > 0.50:
                reason = "Document or text detected. Please upload an image of a plant, crop, or leaf."
            elif neutral_ratio > 0.40:
                reason = "Non-plant object (vehicle, building, electronics, or furniture) detected."

            return PlantValidationResult(
                isPlant=False,
                confidence=confidence,
                reason=reason,
                status="invalid_image",
                details={
                    "skin_ratio": round(skin_ratio, 3),
                    "neutral_ratio": round(neutral_ratio, 3),
                    "paper_ratio": round(paper_ratio, 3)
                }
            )

plant_validator_service = PlantValidatorService()
