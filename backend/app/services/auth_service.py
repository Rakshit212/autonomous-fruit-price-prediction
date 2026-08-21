from app.schemas.auth import UserResponse

class AuthService:
    @staticmethod
    def login(email: str, password: str) -> dict:
        # Mock logic
        if email == "test@example.com" and password == "password":
            return {
                "token": "mock-jwt-token-123456",
                "user": UserResponse(
                    id="usr_001",
                    name="John Farmer",
                    email=email,
                    role="user"
                )
            }
        return None

auth_service = AuthService()
