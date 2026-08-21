import os
import glob
import hashlib
from collections import defaultdict
import yaml
from PIL import Image

def md5(fname):
    hash_md5 = hashlib.md5()
    try:
        with open(fname, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception:
        return None

dataset_path = r"d:\final_year_Project\Blueberry_flower_dataset"
yaml_path = os.path.join(dataset_path, "data.yaml")

print(f"--- PARSING data.yaml ---")
try:
    with open(yaml_path, 'r') as f:
        data_yaml = yaml.safe_load(f)
    print("YAML Content:")
    print(data_yaml)
except Exception as e:
    print(f"Failed to read data.yaml: {e}")

splits = ["train", "valid", "test"]

report = {
    "images": {"train": defaultdict(int), "valid": defaultdict(int), "test": defaultdict(int), "total": 0},
    "labels": {"train": 0, "valid": 0, "test": 0, "total": 0},
    "missing_labels": {"train": [], "valid": [], "test": []},
    "missing_images": {"train": [], "valid": [], "test": []},
    "objects": {"train": defaultdict(int), "valid": defaultdict(int), "test": defaultdict(int), "total": defaultdict(int)},
    "invalid_annotations": [],
    "image_dims": {"min_w": float('inf'), "min_h": float('inf'), "max_w": 0, "max_h": 0, "total_w": 0, "total_h": 0, "count": 0, "corrupted": 0},
    "box_dims": {"min_w": float('inf'), "min_h": float('inf'), "max_w": 0, "max_h": 0, "total_w": 0, "total_h": 0, "count": 0},
    "hashes": {"train": set(), "valid": set(), "test": set()},
    "leakage": []
}

total_objects = 0
total_images = 0

for split in splits:
    print(f"Processing split: {split}")
    img_dir = os.path.join(dataset_path, split, "images")
    lbl_dir = os.path.join(dataset_path, split, "labels")
    
    img_files = []
    if os.path.exists(img_dir):
        img_files = [f for f in os.listdir(img_dir) if os.path.isfile(os.path.join(img_dir, f))]
        
    lbl_files = []
    if os.path.exists(lbl_dir):
        lbl_files = [f for f in os.listdir(lbl_dir) if os.path.isfile(os.path.join(lbl_dir, f))]
        
    report["labels"][split] = len(lbl_files)
    
    img_basenames = {os.path.splitext(f)[0]: f for f in img_files}
    lbl_basenames = {os.path.splitext(f)[0]: f for f in lbl_files}
    
    for base, img_f in img_basenames.items():
        ext = os.path.splitext(img_f)[1].lower().replace('.', '')
        if not ext: ext = "other"
        report["images"][split][ext] += 1
        total_images += 1
        
        # Check label
        if base not in lbl_basenames:
            report["missing_labels"][split].append(img_f)
            
        # Image quality and dims
        img_path = os.path.join(img_dir, img_f)
        if os.path.getsize(img_path) == 0:
            report["image_dims"]["corrupted"] += 1
            continue
            
        try:
            with Image.open(img_path) as img:
                w, h = img.size
                report["image_dims"]["min_w"] = min(report["image_dims"]["min_w"], w)
                report["image_dims"]["min_h"] = min(report["image_dims"]["min_h"], h)
                report["image_dims"]["max_w"] = max(report["image_dims"]["max_w"], w)
                report["image_dims"]["max_h"] = max(report["image_dims"]["max_h"], h)
                report["image_dims"]["total_w"] += w
                report["image_dims"]["total_h"] += h
                report["image_dims"]["count"] += 1
        except Exception:
            report["image_dims"]["corrupted"] += 1
            
        # Hash for leakage
        h = md5(img_path)
        if h:
            report["hashes"][split].add(h)
            
    for base, lbl_f in lbl_basenames.items():
        if base not in img_basenames:
            report["missing_images"][split].append(lbl_f)
            
        # Parse label
        lbl_path = os.path.join(lbl_dir, lbl_f)
        try:
            with open(lbl_path, 'r') as f:
                lines = f.readlines()
                for line in lines:
                    parts = line.strip().split()
                    if not parts: continue
                    if len(parts) != 5:
                        report["invalid_annotations"].append(f"{lbl_f}: Expected 5 values, got {len(parts)}")
                        continue
                    try:
                        cls_id = int(parts[0])
                        xc, yc, w, h = map(float, parts[1:])
                        if cls_id < 0 or cls_id > 4:
                            report["invalid_annotations"].append(f"{lbl_f}: Invalid class ID {cls_id}")
                        if not (0 <= xc <= 1 and 0 <= yc <= 1 and 0 < w <= 1 and 0 < h <= 1):
                            report["invalid_annotations"].append(f"{lbl_f}: Normalized coords out of bounds")
                        
                        report["objects"][split][cls_id] += 1
                        report["objects"]["total"][cls_id] += 1
                        total_objects += 1
                        
                        report["box_dims"]["min_w"] = min(report["box_dims"]["min_w"], w)
                        report["box_dims"]["min_h"] = min(report["box_dims"]["min_h"], h)
                        report["box_dims"]["max_w"] = max(report["box_dims"]["max_w"], w)
                        report["box_dims"]["max_h"] = max(report["box_dims"]["max_h"], h)
                        report["box_dims"]["total_w"] += w
                        report["box_dims"]["total_h"] += h
                        report["box_dims"]["count"] += 1
                        
                    except ValueError:
                        report["invalid_annotations"].append(f"{lbl_f}: Non-numeric values in annotation")
        except Exception as e:
            report["invalid_annotations"].append(f"{lbl_f}: Failed to read label: {e}")

report["images"]["total"] = total_images

# Check leakage
train_hashes = report["hashes"]["train"]
valid_hashes = report["hashes"]["valid"]
test_hashes = report["hashes"]["test"]

leak_t_v = train_hashes.intersection(valid_hashes)
leak_t_t = train_hashes.intersection(test_hashes)
leak_v_t = valid_hashes.intersection(test_hashes)

report["leakage"] = {
    "train_valid": len(leak_t_v),
    "train_test": len(leak_t_t),
    "valid_test": len(leak_v_t)
}

print(f"\n--- AUDIT REPORT SUMMARY ---")
import json
print(json.dumps({k: v for k, v in report.items() if k not in ["hashes"]}, indent=2))
