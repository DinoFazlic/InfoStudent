from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.users import User
import os
from typing import Optional

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    token = request.cookies.get("access_token")
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        return None

    user = db.query(User).filter(User.id == user_id).first()
    return user

def get_current_student(user: User = Depends(get_current_user)):
    if user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized as student")
    return user

def get_current_employer(user: User = Depends(get_current_user)):
    if user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized as employer")
    return user
