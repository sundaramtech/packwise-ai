from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import uuid
from datetime import datetime
from backend.database import db

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class SignupReq(BaseModel):
    full_name: str
    email: str
    password: str
    user_type: str

class LoginReq(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(req: SignupReq):
    # Check existing
    for u in db.users:
        if u["email"].lower() == req.email.lower():
            raise HTTPException(status_code=400, detail="User with this email already exists")
    
    new_user = {
        "id": f"u-{uuid.uuid4().hex[:8]}",
        "full_name": req.full_name,
        "email": req.email.lower(),
        "password_hash": req.password,  # standard string comparison for demo security
        "user_type": req.user_type,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    db.users.append(new_user)
    db.save()

    token = f"jwt-token-{new_user['id']}"
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "full_name": new_user["full_name"],
            "email": new_user["email"],
            "user_type": new_user["user_type"]
        }
    }

@router.post("/login")
def login(req: LoginReq):
    for u in db.users:
        if u["email"].lower() == req.email.lower() and u["password_hash"] == req.password:
            token = f"jwt-token-{u['id']}"
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": u["id"],
                    "full_name": u["full_name"],
                    "email": u["email"],
                    "user_type": u["user_type"]
                }
            }
    raise HTTPException(status_code=401, detail="Invalid email or password")

@router.get("/me")
def get_current_user(user_id: str = "u-demo"):
    for u in db.users:
        if u["id"] == user_id:
            return {
                "id": u["id"],
                "full_name": u["full_name"],
                "email": u["email"],
                "user_type": u["user_type"]
            }
    return {
        "id": "u-guest",
        "full_name": "Guest User",
        "email": "guest@packwise.ai",
        "user_type": "Packaging Professional"
    }
