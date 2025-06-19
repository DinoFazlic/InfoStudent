from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.dependencies import get_db, get_current_student
from app.models.internship import InternshipSave
from app.models import User
from app.models import Internship
from app.schemas.internship_schema import InternshipRead
from typing import List

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

@router.get("", response_model=List[InternshipRead])
def get_saved_internships(
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    saves = db.query(InternshipSave).filter_by(student_id=student.id).all()
    internships = [db.get(Internship, s.internship_id) for s in saves]
    result = []
    for internship in internships:
        if internship is None:
            continue
        author = db.get(User, internship.created_by)
        data = internship.model_dump()
        data["author_name"] = f"{(author.first_name or '')} {(author.last_name or '')}".strip() or author.email
        data["author_avatar_url"] = author.profile_photo_url
        data["applied"] = False
        data["saved"] = True
        data["author_id"] = internship.created_by
        data["author_role"] = author.role
        result.append(InternshipRead.model_validate(data))
    return result