# app/routes/instruction_router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.repositories.instruction_repository import (
    create_instruction as repo_create,
    list_instructions  as repo_list,
)
from app.schemas.instruction_schema import InstructionCreate, InstructionRead
from app.models.users import User

router = APIRouter(prefix="/api/instructions", tags=["instructions"])


@router.get("", response_model=list[InstructionRead])
def get_all(db: Session = Depends(get_db)):
    rows = repo_list(db)
    return [InstructionRead.model_validate(r, from_attributes=True) for r in rows]


@router.post(
    "",
    response_model=InstructionRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: InstructionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # 1) spremi u bazu
    row = repo_create(db, data=data.dict(), user_id=user.id)

    # 2) obogati podatak za klijent (nije obavezno, ali često zgodno)
    #row.author_name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email

    # 3) vrati Pydantic objekt
    return InstructionRead.model_validate(row, from_attributes=True)
