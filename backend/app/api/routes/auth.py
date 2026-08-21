from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, AuthResponse
from app.services.auth_service import auth_service

router = APIRouter()

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    result = auth_service.login(email=request.email, password=request.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return AuthResponse(success=True, token=result["token"], user=result["user"])
