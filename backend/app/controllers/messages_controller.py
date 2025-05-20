from fastapi import APIRouter, Depends
from sqlmodel import select, Session
from app.database import get_db
from app.models.messages import Message
from app.models.users import User
from app.utils.auth import get_current_user  # 👈 ovde sad koristiš iz utils

router = APIRouter()

@router.get("/chat/{other_user_id}")
def get_chat_messages(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user_id = current_user.id

    stmt = select(Message).where(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == other_user_id)) |
        ((Message.sender_id == other_user_id) & (Message.receiver_id == current_user_id))
    ).order_by(Message.timestamp)

    result = db.execute(stmt)
    return result.scalars().all()

@router.get("/contacts")
def get_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    stmt = select(Message).where(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    )

    result = db.execute(stmt).scalars().all()

    contact_ids = set()
    for msg in result:
        if msg.sender_id != user_id:
            contact_ids.add(msg.sender_id)
        if msg.receiver_id != user_id:
            contact_ids.add(msg.receiver_id)

    contacts = db.query(User).filter(User.id.in_(contact_ids)).all()
    return [{"id": u.id, "email": u.email} for u in contacts]
