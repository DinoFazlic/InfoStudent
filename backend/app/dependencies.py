# backend/app/dependencies.py
from fastapi import Depends, Cookie
from typing import Optional
from app.models import User
from app.utils.jwt import verify_token
from app.database import get_db
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.auth import get_current_user, get_current_student, get_current_employer

__all__ = [
    "get_db",
    "get_current_user",
    "get_current_student",
    "get_current_employer",
    "get_current_user_optional",
]

async def get_current_user_optional(
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not access_token:
        return None

    try:
        payload = verify_token(access_token)
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except Exception:
        return None
