# Blueberry Flower Detection & Weather Dashboard

## Overview
This project combines a custom-trained YOLOv8 computer vision model for detecting the growth stages of blueberry flowers with a modern, dynamic Weather Dashboard built in React. The backend is powered by FastAPI.

## Features
- **Object Detection**: Train and run a YOLOv8 model for classifying and detecting 5 stages of blueberry flowers: `bud`, `extendedbud`, `fullbloom`, `greenfruit`, and `petalfall`.
- **Weather Dashboard**: A sleek, responsive dashboard built with Vite + React.
- **API Backend**: FastAPI application with modular routing for authentication and model inference (coming soon).

## Technology Stack
- **Frontend**: React, Vite, TailwindCSS, TypeScript
- **Backend**: FastAPI, Python 3.13, PyTorch 2.6.0
- **Machine Learning**: Ultralytics YOLOv8

## Project Structure
- `backend/`: FastAPI server and Python requirements.
- `frontend/`: Vite + React UI application.
- `train_exp_A.py`: Core script for training the YOLO model locally.
- `verify.py`: Diagnostic script for checking CUDA compatibility.

## Requirements
- Python 3.10+
- Node.js 18+
- (Optional) NVIDIA GPU with CUDA support for model training.

## Installation & Setup

### Environment Variables
For security, sensitive keys and credentials are NOT stored in GitHub. You must create your own `.env` files.

1. Navigate to the `frontend/` directory.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and add your OpenWeatherMap API key:
   `VITE_WEATHER_API_KEY=your_actual_key_here`

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Dataset
**Note**: The dataset (`Blueberry_flower_dataset`) is excluded from Git due to its large size. To train the model locally:
1. Ensure the dataset folder is placed at the root of the project.
2. The folder must contain `train/`, `valid/`, `test/`, and a valid YOLO `data.yaml`.

## Model and Training
**Note**: The trained weights (`.pt` files) are excluded from the repository.
- **Training**: Run `python train_exp_A.py` to initiate training locally. Output checkpoints will be saved to the local `model_training/` directory.
- **Inference**: (Coming soon) The FastAPI backend will load the `best.pt` weights from local storage to run inference.

## Security
Secrets, credentials, `.env` files, and local caches are strictly excluded via `.gitignore`. 

## License
MIT License
