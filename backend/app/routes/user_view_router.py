from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_db
from app.models.users import User
from schemas.user_schema import UserRead
from app.utils.auth import get_current_user

router = APIRouter()

from sqlalchemy.orm import selectinload

@router.get("/{user_id}", response_model=UserRead)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.exec(
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.student_profile),
            selectinload(User.employer_profile),
        )
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

