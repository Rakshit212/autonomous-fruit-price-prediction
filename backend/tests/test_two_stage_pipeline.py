import io
import unittest
import numpy as np
from PIL import Image, ImageDraw
import requests
from app.services.plant_validator_service import plant_validator_service
from app.services.disease_detection_service import disease_detection_service
from app.core.config import settings

class TestTwoStagePipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        np.random.seed(42)
        cls.api_url = "http://127.0.0.1:8000/api/disease-detection/analyze"

    def _create_image_bytes(self, img: Image.Image, format="JPEG") -> bytes:
        buf = io.BytesIO()
        img.save(buf, format=format)
        return buf.getvalue()

    # =========================================================================
    # 10 PLANT IMAGE GENERATORS
    # =========================================================================
    def _gen_healthy_leaf(self):
        # 1. Healthy green leaf
        arr = np.full((300, 300, 3), [34, 139, 34], dtype=np.uint8)
        noise = np.random.normal(0, 18, (300, 300, 3)).astype(np.int16)
        img = Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(img)
        draw.line([(150, 20), (150, 280)], fill=(70, 180, 70), width=4)
        return img

    def _gen_diseased_leaf(self):
        # 2. Diseased leaf (Alternaria / Blight)
        img = self._gen_healthy_leaf()
        draw = ImageDraw.Draw(img)
        draw.ellipse([80, 80, 140, 140], fill=(160, 140, 30), outline=(100, 60, 15))
        draw.ellipse([95, 95, 125, 125], fill=(80, 45, 10))
        return img

    def _gen_tomato_plant(self):
        # 3. Tomato plant (foliage + red fruits)
        arr = np.full((300, 300, 3), [45, 130, 40], dtype=np.uint8)
        noise = np.random.normal(0, 15, (300, 300, 3)).astype(np.int16)
        img = Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(img)
        draw.ellipse([100, 120, 160, 180], fill=(210, 35, 30))
        draw.ellipse([180, 160, 230, 210], fill=(220, 40, 35))
        return img

    def _gen_potato_leaf(self):
        # 4. Potato leaf with chlorosis halo
        arr = np.full((300, 300, 3), [50, 140, 45], dtype=np.uint8)
        noise = np.random.normal(0, 14, (300, 300, 3)).astype(np.int16)
        img = Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(img)
        draw.ellipse([110, 100, 190, 180], fill=(155, 150, 40))
        return img

    def _gen_rice_plant(self):
        # 5. Rice plant paddy foliage
        arr = np.full((300, 300, 3), [55, 165, 60], dtype=np.uint8)
        noise = np.random.normal(0, 15, (300, 300, 3)).astype(np.int16)
        return Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))

    def _gen_wheat_plant(self):
        # 6. Wheat plant golden-green crop
        arr = np.full((300, 300, 3), [110, 145, 45], dtype=np.uint8)
        noise = np.random.normal(0, 12, (300, 300, 3)).astype(np.int16)
        return Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))

    def _gen_fruit_plant(self):
        # 7. Fruit plant (blueberry clusters)
        arr = np.full((300, 300, 3), [40, 125, 45], dtype=np.uint8)
        noise = np.random.normal(0, 15, (300, 300, 3)).astype(np.int16)
        img = Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(img)
        draw.ellipse([120, 120, 160, 160], fill=(45, 55, 130))
        return img

    def _gen_flower(self):
        # 8. Flower blossom with foliage
        arr = np.full((300, 300, 3), [45, 130, 50], dtype=np.uint8)
        noise = np.random.normal(0, 15, (300, 300, 3)).astype(np.int16)
        img = Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(img)
        draw.ellipse([110, 110, 190, 190], fill=(230, 45, 120))
        return img

    def _gen_crop_field(self):
        # 9. Crop field
        arr = np.zeros((300, 300, 3), dtype=np.uint8)
        for y in range(300):
            arr[y, :] = [45, 145, 50] if (y // 30) % 2 == 0 else [70, 55, 35]
        noise = np.random.normal(0, 12, (300, 300, 3)).astype(np.int16)
        return Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))

    def _gen_closeup_leaf(self):
        # 10. Close-up leaf blade
        arr = np.full((300, 300, 3), [28, 128, 30], dtype=np.uint8)
        noise = np.random.normal(0, 15, (300, 300, 3)).astype(np.int16)
        img = Image.fromarray(np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(img)
        draw.line([(0, 150), (300, 150)], fill=(65, 160, 65), width=6)
        return img

    # =========================================================================
    # 15 NON-PLANT IMAGE GENERATORS
    # =========================================================================
    def _gen_human(self):
        # 1. Human
        arr = np.clip(np.full((300, 300, 3), [210, 150, 125]) + np.random.normal(0, 12, (300, 300, 3)), 0, 255).astype(np.uint8)
        return Image.fromarray(arr)

    def _gen_face(self):
        # 2. Face
        img = self._gen_human()
        draw = ImageDraw.Draw(img)
        draw.ellipse([80, 90, 120, 120], fill=(35, 30, 25))
        draw.ellipse([180, 90, 220, 120], fill=(35, 30, 25))
        return img

    def _gen_car(self):
        # 3. Car
        arr = np.clip(np.full((300, 300, 3), [85, 88, 92]) + np.random.normal(0, 10, (300, 300, 3)), 0, 255).astype(np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.rectangle([30, 120, 270, 220], fill=(130, 135, 140))
        return img

    def _gen_motorcycle(self):
        # 4. Motorcycle (dark metal & chrome)
        arr = np.clip(np.full((300, 300, 3), [40, 42, 45]) + np.random.normal(0, 12, (300, 300, 3)), 0, 255).astype(np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.ellipse([40, 180, 110, 250], outline=(180, 180, 185), width=8)
        draw.ellipse([190, 180, 260, 250], outline=(180, 180, 185), width=8)
        return img

    def _gen_building(self):
        # 5. Building (concrete grid)
        arr = np.full((300, 300, 3), [170, 170, 175], dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        for r in range(30, 270, 50):
            for c in range(30, 270, 50):
                draw.rectangle([c, r, c + 35, r + 35], fill=(30, 45, 65))
        return img

    def _gen_phone(self):
        # 6. Phone
        arr = np.full((300, 300, 3), [135, 95, 60], dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle([90, 30, 210, 270], radius=15, fill=(15, 15, 20))
        return img

    def _gen_laptop(self):
        # 7. Laptop
        arr = np.full((300, 300, 3), [180, 180, 185], dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.rectangle([50, 40, 250, 180], fill=(20, 20, 25))
        draw.rectangle([30, 185, 270, 240], fill=(120, 125, 130))
        return img

    def _gen_dog(self):
        # 8. Dog (golden retriever brown coat)
        arr = np.clip(np.full((300, 300, 3), [180, 120, 60]) + np.random.normal(0, 18, (300, 300, 3)), 0, 255).astype(np.uint8)
        return Image.fromarray(arr)

    def _gen_cat(self):
        # 9. Cat (gray tabby fur)
        arr = np.clip(np.full((300, 300, 3), [110, 110, 115]) + np.random.normal(0, 20, (300, 300, 3)), 0, 255).astype(np.uint8)
        return Image.fromarray(arr)

    def _gen_food(self):
        # 10. Food (cooked noodles / soup plate)
        arr = np.clip(np.full((300, 300, 3), [200, 140, 50]) + np.random.normal(0, 15, (300, 300, 3)), 0, 255).astype(np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.ellipse([40, 40, 260, 260], outline=(240, 240, 240), width=10)
        return img

    def _gen_document(self):
        # 11. Document
        arr = np.full((300, 300, 3), 248, dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        for y in range(30, 280, 20):
            draw.line([(35, y), (250, y)], fill=(15, 15, 15), width=2)
        return img

    def _gen_random_object(self):
        # 12. Random object (plastic bottle/mug)
        arr = np.full((300, 300, 3), [120, 120, 125], dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.rectangle([100, 80, 200, 230], fill=(220, 80, 40))
        return img

    def _gen_road(self):
        # 13. Road (black asphalt with yellow centerline)
        arr = np.clip(np.full((300, 300, 3), [50, 50, 52]) + np.random.normal(0, 10, (300, 300, 3)), 0, 255).astype(np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.line([(150, 0), (150, 300)], fill=(230, 190, 30), width=6)
        return img

    def _gen_furniture(self):
        # 14. Furniture (wooden chair)
        arr = np.full((300, 300, 3), [210, 210, 215], dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.rectangle([80, 80, 220, 140], fill=(130, 75, 40))
        draw.rectangle([90, 140, 110, 260], fill=(100, 55, 30))
        draw.rectangle([190, 140, 210, 260], fill=(100, 55, 30))
        return img

    def _gen_screenshot(self):
        # 15. Screenshot (browser / UI window)
        arr = np.full((300, 300, 3), 240, dtype=np.uint8)
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.rectangle([0, 0, 300, 40], fill=(45, 50, 60))
        draw.ellipse([15, 15, 25, 25], fill=(235, 80, 70))
        draw.ellipse([35, 15, 45, 25], fill=(245, 180, 60))
        draw.ellipse([55, 15, 65, 25], fill=(70, 190, 80))
        return img

    # =========================================================================
    # TESTS
    # =========================================================================
    def test_all_10_plant_categories_accepted(self):
        plants = [
            ("1. Healthy Green Leaf", self._gen_healthy_leaf()),
            ("2. Diseased Leaf", self._gen_diseased_leaf()),
            ("3. Tomato Plant", self._gen_tomato_plant()),
            ("4. Potato Leaf", self._gen_potato_leaf()),
            ("5. Rice Plant", self._gen_rice_plant()),
            ("6. Wheat Plant", self._gen_wheat_plant()),
            ("7. Fruit Plant", self._gen_fruit_plant()),
            ("8. Flower", self._gen_flower()),
            ("9. Crop Field", self._gen_crop_field()),
            ("10. Close-up Leaf", self._gen_closeup_leaf()),
        ]

        for name, img in plants:
            with self.subTest(plant=name):
                res = plant_validator_service.classify_image(img)
                self.assertTrue(
                    res.isPlant, 
                    f"{name} should be accepted as plant. Got conf={res.confidence}, status={res.status}, reason={res.reason}"
                )
                self.assertGreaterEqual(res.confidence, settings.PLANT_CONFIDENCE_THRESHOLD)

                # Confirm disease model can be called and works
                d_res = disease_detection_service.analyze_plant_disease(img, res)
                self.assertTrue(d_res.success)
                self.assertIsNotNone(d_res.disease)

    def test_all_15_non_plant_categories_rejected(self):
        non_plants = [
            ("1. Human", self._gen_human()),
            ("2. Face", self._gen_face()),
            ("3. Car", self._gen_car()),
            ("4. Motorcycle", self._gen_motorcycle()),
            ("5. Building", self._gen_building()),
            ("6. Phone", self._gen_phone()),
            ("7. Laptop", self._gen_laptop()),
            ("8. Dog", self._gen_dog()),
            ("9. Cat", self._gen_cat()),
            ("10. Food", self._gen_food()),
            ("11. Document", self._gen_document()),
            ("12. Random Object", self._gen_random_object()),
            ("13. Road", self._gen_road()),
            ("14. Furniture", self._gen_furniture()),
            ("15. Screenshot", self._gen_screenshot()),
        ]

        for name, img in non_plants:
            with self.subTest(non_plant=name):
                res = plant_validator_service.classify_image(img)
                self.assertFalse(
                    res.isPlant, 
                    f"{name} MUST be rejected! Got conf={res.confidence}, status={res.status}"
                )
                self.assertIn(res.status, ["invalid_image", "uncertain_image"])

                # Verify Stage 2 cannot run
                with self.assertRaises(ValueError):
                    disease_detection_service.analyze_plant_disease(img, res)

    def test_http_api_non_plant_rejection(self):
        car_bytes = self._create_image_bytes(self._gen_car())
        res = requests.post(self.api_url, files={"file": ("car.jpg", car_bytes, "image/jpeg")})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertEqual(data["status"], "invalid_image")
        self.assertIsNone(data["disease"])
        self.assertIsNone(data["recommendation"])

if __name__ == "__main__":
    unittest.main()
