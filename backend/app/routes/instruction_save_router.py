from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.models.instruction import Instruction
from app.models.users import User
from app.schemas.instruction_schema import InstructionRead

from app.dependencies import get_db, get_current_student
from app.models.instruction import InstructionSave

router = APIRouter(prefix="/api/instruction-saves", tags=["Instruction Saves"])

# Request schema
class InstructionSaveRequest(BaseModel):
    instruction_id: int

@router.post("", status_code=201)
def save_instruction(
    data: InstructionSaveRequest,
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    # Check if already saved
    existing_save = db.query(InstructionSave).filter_by(
        student_id=student.id,
        instruction_id=data.instruction_id
    ).first()

    if existing_save:
        raise HTTPException(status_code=400, detail="Instruction already saved.")

    save = InstructionSave(
        student_id=student.id,
        instruction_id=data.instruction_id,
    )
    db.add(save)
    db.commit()
    db.refresh(save)

    return {"msg": "Instruction saved successfully."}

@router.delete("/{instruction_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_instruction(
    instruction_id: int,
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    save = db.query(InstructionSave).filter_by(
        student_id=student.id,
        instruction_id=instruction_id
    ).first()

    if not save:
        raise HTTPException(status_code=404, detail="Instruction not saved.")

    db.delete(save)
    db.commit()


@router.get("", response_model=List[InstructionRead])
def get_saved_instructions(
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    saves = db.query(InstructionSave).filter_by(student_id=student.id).all()
    instructions = [db.get(Instruction, s.instruction_id) for s in saves]
    result = []

    for inst in instructions:
        if inst is None:
            continue

        author = db.get(User, inst.created_by)
        author_name = ((author.first_name or "") + " " + (author.last_name or "")).strip() if author else None
        author_name = author_name or (author.email if author else "Nepoznato")
        avatar_url = author.profile_photo_url if author else None

        data = inst.model_dump()
        data["created_by"] = inst.created_by
        data["created_at"] = inst.created_at.isoformat()
        if inst.updated_at:
            data["updated_at"] = inst.updated_at.isoformat()

        data["author_name"] = author_name
        data["author_avatar_url"] = avatar_url
        data["applied"] = False
        data["saved"] = True

        result.append(InstructionRead.model_validate(data))

    return result