from fastapi import APIRouter, HTTPException
from uuid import uuid4
from app.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

OFFICIAL_DOMAIN = "@cit.edu.in"   # change to your college domain

@router.post("/login", response_model=LoginResponse)
def student_login(data: LoginRequest):
    if not data.email.endswith(OFFICIAL_DOMAIN):
        raise HTTPException(
            status_code=401,
            detail="Use official college email to login"
        )

    return {
        "student_id": str(uuid4()),
        "name": "Student Name",
        "roll": data.email.split("@")[0],
        "department": "AI & DS"
    }
