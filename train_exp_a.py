import os
import sys
import torch
import yaml
from ultralytics import YOLO
import shutil

print("--- PRE-TRAINING VERIFICATION ---")

# 1. GPU is NVIDIA RTX 2050 & 2. CUDA is available
cuda_avail = torch.cuda.is_available()
print(f"CUDA Available: {cuda_avail}")
if not cuda_avail:
    print("CUDA NOT AVAILABLE. ABORTING.")
    sys.exit(1)

gpu_name = torch.cuda.get_device_name(0)
print(f"GPU Name: {gpu_name}")
if "2050" not in gpu_name:
    print(f"WARNING: Expected RTX 2050, found {gpu_name}")

# 3. Dataset YAML loads successfully & 4. All 5 classes are detected
yaml_path = r"D:\final_year_Project\Blueberry_flower_dataset\data.yaml"
try:
    with open(yaml_path, "r") as f:
        data = yaml.safe_load(f)
    print("Dataset YAML loaded successfully.")
    print(f"Number of classes (nc): {data.get('nc')}")
    print(f"Classes: {data.get('names')}")
    if data.get('nc') != 5:
        print("ERROR: Not exactly 5 classes in YAML. ABORTING.")
        sys.exit(1)
except Exception as e:
    print(f"Failed to load dataset YAML: {e}")
    sys.exit(1)

# 5. Output directory is on D:
project_dir = r"D:\final_year_Project\model_training"
experiment_name = "experiment_A_yolov8n_1024"
out_dir = os.path.join(project_dir, experiment_name)
print(f"Output directory: {project_dir}")
if not project_dir.upper().startswith("D:"):
    print("ERROR: Output directory is not on D: drive. ABORTING.")
    sys.exit(1)

print("---------------------------------")
print("Starting YOLO Training...")

# Pretrained model downloaded to D: (handled by YOLO_CONFIG_DIR in pip environment but we can enforce)
os.environ["YOLO_CONFIG_DIR"] = r"D:\final_year_Project\model_cache"
os.environ["YOLO_WEIGHTS_DIR"] = r"D:\final_year_Project\model_cache"

def run_training(batch_size):
    print(f"\nAttempting training with batch_size={batch_size}")
    model = YOLO("yolov8n.pt")  # Download to D:\final_year_Project\model_cache
    
    # If a previous failed run created the folder, remove it so ultralytics doesn't create experiment_A_yolov8n_10242
    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)
        
    try:
        results = model.train(
            data=yaml_path,
            epochs=100,
            imgsz=1024,
            batch=batch_size,
            patience=15,
            workers=0,
            device='0',
            amp=True,
            project=project_dir,
            name=experiment_name
        )
        print("Training completed successfully.")
        return True
    except RuntimeError as e:
        if "out of memory" in str(e).lower() or "oom" in str(e).lower() or "memory" in str(e).lower():
            print(f"Caught CUDA Out of Memory error with batch={batch_size}.")
            # Clear CUDA cache before retry
            torch.cuda.empty_cache()
            return False
        else:
            raise e

if __name__ == '__main__':
    # Try batch 1 directly because batch 2 causes cv2 System RAM OutOfMemoryError
    print("Batch 2 caused System RAM cv2.OutOfMemoryError. Starting with batch_size=1...")
    run_training(1)
