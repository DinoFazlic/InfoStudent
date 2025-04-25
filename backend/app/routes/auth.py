from fastapi import APIRouter, Depends, HTTPException, Response, BackgroundTasks, Body
from sqlalchemy.orm import Session
from app.models import User, UserRole
from app.schemas import RegisterRequest, LoginRequest, ResetPasswordRequest
from app.database import get_db 
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from app.utils.email import send_email_async

load_dotenv() 

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
RESET_SECRET = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(req.password)

    user = User(
        first_name=req.first_name,
        last_name=req.last_name,
        email=req.email,
        contact_phone=req.contact_phone,
        city=req.city,
        role=req.role,
        password_hash=hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"msg": "Registration successful"}


@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    payload = {
        "sub": str(user.id),
        "role": user.role.value,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  
        samesite="lax",  
        max_age = ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    return {"msg": "Login successful"}



@router.post("/forgot-password")
async def forgot_password(
    email: str, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    reset_token = jwt.encode(
        {"sub": user.email, "exp": datetime.utcnow() + timedelta(minutes=30)},
        RESET_SECRET,
        algorithm="HS256"
    )

    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"

    subject = "Password Reset Request"
    body = f"Hi!\n\nClick the link to reset your password: {reset_link}\nIf you didn't request this, ignore this email."

    background_tasks.add_task(send_email_async, user.email, subject, body)

    return {"msg": "Reset link sent to your email."}



@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    token = data.token
    new_password = data.new_password

    try:
        payload = jwt.decode(token, RESET_SECRET, algorithms=["HS256"])
        email = payload.get("sub")
        exp = payload.get("exp")

        if not email or (exp and datetime.utcfromtimestamp(exp) < datetime.utcnow()):
            raise HTTPException(status_code=400, detail="Invalid or expired token")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    hashed_password = pwd_context.hash(new_password)
    user.password_hash = hashed_password
    db.commit()
    return {"msg": "Password reset successful"}
