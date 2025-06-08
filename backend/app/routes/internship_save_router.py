from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.dependencies import get_db, get_current_student
from app.models.internship import InternshipSave
from app.models import User

router = APIRouter(prefix="/api/internship-saves", tags=["Internship Saves"])

class InternshipSaveRequest(BaseModel):
    internship_id: int

@router.post("", status_code=201)
def save_internship(
    data: InternshipSaveRequest,
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    existing_save = db.query(InternshipSave).filter_by(
        student_id=student.id, internship_id=data.internship_id
    ).first()

    if existing_save:
        raise HTTPException(status_code=400, detail="Internship already saved.")

    save = InternshipSave(
        student_id=student.id,
        internship_id=data.internship_id,
    )
    db.add(save)
    db.commit()
    db.refresh(save)
    return {"msg": "Internship saved."}


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_internship(
    internship_id: int,
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    save = (
        db.query(InternshipSave)
        .filter(
            InternshipSave.internship_id == internship_id,
            InternshipSave.student_id == student.id
        )
        .first()
    )
    if not save:
        raise HTTPException(status_code=404, detail="Internship not saved yet.")

    db.delete(save)
    db.commit()