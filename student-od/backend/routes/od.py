from fastapi import APIRouter
from app.schemas import ODRequest, ODResponse

router = APIRouter(prefix="/od", tags=["OD Requests"])

@router.post("/request", response_model=ODResponse)
def submit_od(request: ODRequest):
    return {
        "status": "Pending",
        "message": "OD request submitted successfully"
    }

@router.get("/student/{student_id}")
def get_student_od(student_id: str):
    return [
        {
            "date": "2026-02-10",
            "venue": "IIT Madras",
            "reason": "Hackathon",
            "status": "Pending"
        }
    ]
