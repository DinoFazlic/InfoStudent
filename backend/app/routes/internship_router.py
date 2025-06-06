# app/routes/internship_router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.dependencies import get_db, get_current_user
from app.models       import Internship, User
from app.schemas.internship_schema import InternshipCreate, InternshipRead

router = APIRouter(prefix="/api/internships", tags=["internships"])

@router.get("", response_model=List[InternshipRead])
def list_internships(db: Session = Depends(get_db)):
    out: list[InternshipRead] = []
    for row in db.query(Internship).order_by(Internship.posted_at.desc()):
        u: User | None = db.get(User, row.created_by)
        data = row.model_dump()
        data["created_at"]        = row.posted_at.isoformat()
        data["author_name"]       = (f"{u.first_name or ''} {u.last_name or ''}".strip()
                                     if u else "Nepoznato")
        data["author_avatar_url"] = u.profile_photo_url if u else None
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
