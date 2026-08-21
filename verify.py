import sys
import os
import shutil
import site

def get_free_space_gb(folder):
    total, used, free = shutil.disk_usage(folder)
    return round(free / (1024 ** 3), 2)

print("==================================================")
print("1. Python environment location:")
print("   " + sys.executable)
print()
print("2. PyTorch installation location:")
try:
    import torch
    print("   " + os.path.dirname(torch.__file__))
except ImportError:
    print("   PyTorch is currently installing in D:\\final_year_Project\\yolo_env...")
print()
print("3. Ultralytics cache location:")
print("   D:\\final_year_Project\\model_cache")
print()
print("4. Pretrained YOLO weights will be downloaded to:")
print("   D:\\final_year_Project\\model_cache")
print()
print("5. Training results will be saved to:")
print("   D:\\final_year_Project\\model_training\\runs\\")
print()
print("6. Final best.pt will be saved to:")
print("   D:\\final_year_Project\\backend\\models\\best.pt")
print()
print("7. Free space on C:")
print(f"   {get_free_space_gb('C:\\')} GB")
print()
print("8. Free space on D:")
print(f"   {get_free_space_gb('D:\\')} GB")
print("==================================================")

try:
    import torch
    print("Python executable:", sys.executable)
    print("PyTorch version:", torch.__version__)
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("CUDA version:", torch.version.cuda)
        print("GPU:", torch.cuda.get_device_name(0))
        # Total VRAM in GB
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
        print(f"GPU VRAM: {vram_gb:.2f} GB")
except ImportError:
    print("Torch information will be available once installation finishes.")

try:
    import ultralytics
    print("Ultralytics version:", ultralytics.__version__)
except ImportError:
    print("Ultralytics information will be available once installation finishes.")

print()
print("Training environment:\nD:\\final_year_Project\\yolo_env")
print("\nDataset:\nD:\\final_year_Project\\Blueberry_flower_dataset")
print("\nModel cache:\nD:\\final_year_Project\\model_cache")
print("\nTraining output:\nD:\\final_year_Project\\model_training")
