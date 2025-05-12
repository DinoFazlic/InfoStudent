from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from sqlmodel import select
from datetime import datetime

from app.database import get_db
from app.models.messages import Message
from app.schemas.messages_schema import MessageCreate, MessageRead
from app.models.users import User
from jose import jwt, JWTError
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(request: Request, db: Session) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ✅ Send message
@router.post("/", response_model=MessageRead)
def send_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    msg = Message(
        sender_id=user.id,
        receiver_id=data.receiver_id,
        content=data.content,
        timestamp=datetime.utcnow()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg  # ✅ Pydantic-friendly SQLModel instance



@router.get("/{other_user_id}", response_model=list[MessageRead])
def get_chat(
    other_user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    stmt = select(Message).where(
        ((Message.sender_id == user.id) & (Message.receiver_id == other_user_id)) |
        ((Message.sender_id == other_user_id) & (Message.receiver_id == user.id))
    ).order_by(Message.timestamp)
    return db.execute(stmt).scalars().all()
