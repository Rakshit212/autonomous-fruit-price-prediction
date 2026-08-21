import os
import glob
import pandas as pd
from collections import defaultdict
try:
    from ultralytics import YOLO
except ImportError:
    pass

# 1. Inspect Dataset
dataset_path = r"D:\final_year_Project\Blueberry_flower_dataset"
splits = ["train", "valid", "test"]
dataset_stats = {}

for split in splits:
    img_dir = os.path.join(dataset_path, split, "images")
    lbl_dir = os.path.join(dataset_path, split, "labels")
    
    images = glob.glob(os.path.join(img_dir, "*.jpg")) + glob.glob(os.path.join(img_dir, "*.png"))
    labels = glob.glob(os.path.join(lbl_dir, "*.txt"))
    
    class_counts = defaultdict(int)
    for lbl in labels:
        with open(lbl, 'r') as f:
            for line in f:
                parts = line.strip().split()
                if parts:
                    class_id = int(parts[0])
                    class_counts[class_id] += 1
    
    dataset_stats[split] = {
        "images": len(images),
        "labels": len(labels),
        "class_counts": dict(class_counts)
    }

print("=== DATASET STATS ===")
print(dataset_stats)

# 2. Check Training History
print("\n=== TRAINING HISTORY ===")
runs_path = r"D:\final_year_Project\runs"
if os.path.exists(runs_path):
    print("Found runs path")
else:
    print("No runs path found")
    
# 3. Model Inference
model_path = r"D:\final_year_Project\best.pt"
print(f"\n=== MODEL INFERENCE ===")
if os.path.exists(model_path):
    print("Loading best.pt...")
    try:
        model = YOLO(model_path)
        print("Model loaded successfully!")
        
        img_path = r"D:\final_year_Project\plant.png"
        for conf in [0.25, 0.40, 0.50]:
            print(f"\nRunning inference at {conf} confidence...")
            results = model(img_path, conf=conf)
            result = results[0]
            counts = defaultdict(int)
            for box in result.boxes:
                cls_id = int(box.cls[0].item())
                counts[model.names[cls_id]] += 1
            print(f"Conf {conf}: {dict(counts)}")
    except Exception as e:
        print(f"Failed to load/run model: {e}")
else:
    print(f"{model_path} not found.")

