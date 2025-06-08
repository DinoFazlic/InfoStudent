from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

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
