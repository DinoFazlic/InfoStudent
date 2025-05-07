from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import Response
from app.schemas.user_schema import RegisterRequest, LoginRequest
from app.services import user_service
from app.routes import auth 
from app.utils.jwt import create_access_token
from jose import jwt
import os 
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def register_controller(data: RegisterRequest, response: Response, db: Session):
    try:
        user = user_service.register_user(data, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    token = auth.create_access_token({"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  
        samesite="lax"
    )

    return {"message": "User registered successfully", "user_id": user.id}


def login_controller(data: LoginRequest, response: Response, db: Session):
    user = user_service.login_user(data, db)

    payload = {
        "sub": str(user.id),
        "role": user.role,
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