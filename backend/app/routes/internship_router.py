# app/routes/internship_router.py
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dependencies import get_db, get_current_user
from app.models       import Internship, User
from app.schemas.internship_schema import InternshipCreate, InternshipRead
from app.models.internship import InternshipSave, InternshipApplication
from app.dependencies import get_current_user_optional


router = APIRouter(prefix="/api/internships", tags=["internships"])

@router.get("", response_model=List[InternshipRead])
def list_internships(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
,
):
    out: list[InternshipRead] = []

    saved_internship_ids = set()
    applied_internship_ids = set()

    if user and user.role == "student":
        # Get IDs of internships the student applied to
        applied_internship_ids = {
            row.internship_id
            for row in db.query(InternshipApplication.internship_id)
            .filter(InternshipApplication.student_id == user.id)
            .all()
        }
        # Get IDs of internships the student saved
        saved_internship_ids = {
            row.internship_id
            for row in db.query(InternshipSave.internship_id)
            .filter(InternshipSave.student_id == user.id)
            .all()
        }

    for row in db.query(Internship).order_by(Internship.posted_at.desc()):
        u: User | None = db.get(User, row.created_by)
        data = row.model_dump()
        data["created_by"] = row.created_by
        data["author_name"] = (f"{u.first_name or ''} {u.last_name or ''}".strip() if u else "Nepoznato")
        data["author_avatar_url"] = u.profile_photo_url if u else None
        data["applied"] = row.id in applied_internship_ids
        data["saved"] = row.id in saved_internship_ids

        out.append(InternshipRead.model_validate(data))

    return out




@router.post("", response_model=InternshipRead, status_code=status.HTTP_201_CREATED)
def create_internship(
    payload: InternshipCreate,
    db: Session = Depends(get_db),
    me:  User   = Depends(get_current_user),       # samo employer / admin?
):
    if me.role not in ("employer", "admin"):
        raise HTTPException(status_code=403, detail="Samo poslodavci kreiraju prakse")

    intern = Internship(**payload.model_dump(exclude_unset=True), created_by=me.id)
    db.add(intern); db.commit(); db.refresh(intern)

    data = intern.model_dump()
    data["created_at"]        = intern.posted_at.isoformat()
    data["author_name"]       = f"{me.first_name or ''} {me.last_name or ''}".strip() or me.email
    data["author_avatar_url"] = me.profile_photo_url
    return InternshipRead.model_validate(data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(
    id: int,
    db: Session = Depends(get_db),
    me: User = Depends(get_current_user),
):
    internship = db.query(Internship).filter(Internship.id == id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found.")

    if internship.created_by != me.id and me.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this internship.")

    db.delete(internship)
    db.commit()
