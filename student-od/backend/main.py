from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import date
import re
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="Student OD Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
EMAIL_PATTERN = r"^[a-z]+\.{1}[a-z]+[0-9]{4}@citchennai\.net$"


class LoginRequest(BaseModel):
    email: EmailStr


class ODRequest(BaseModel):
    student_email: EmailStr
    student_name: str
    roll_no: str
    department: str
    section: str
    reason: str
    venue: str
    description: str




@app.get("/")
def root():
    return {"message": "Student OD Backend is running"}


@app.post("/auth/login")
def login(data: LoginRequest):
    email = data.email.lower()

    if not re.match(EMAIL_PATTERN, email):
        raise HTTPException(
            status_code=401,
            detail="Invalid college email format. Use name.departmentYEAR@citchennai.net"
        )

    username = email.split("@")[0]

    return {
        "student_id": "STU123",
        "email": email,
        "username": username,
        "status": "login successful"
    }


@app.post("/od/request")
def submit_od(data: ODRequest):
    return {
        "status": "Pending",
        "message": "OD request submitted successfully"
    }
