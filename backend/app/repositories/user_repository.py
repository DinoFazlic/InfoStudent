from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.user_schema import LoginRequest
from fastapi import HTTPException

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(data: LoginRequest, db: Session):
    user = user_repository.get_user_by_email(db, data.email)

    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    return user
