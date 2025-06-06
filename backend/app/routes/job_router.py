from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.job import Job
from app.models.users import User
from app.schemas.job_schema import JobCreate, JobRead

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("", response_model=list[JobRead])
def list_jobs(db: Session = Depends(get_db)):
    rows = db.query(Job).order_by(Job.created_at.desc()).all()
    out = []
    for j in rows:
        u = db.get(User, j.created_by)
        data = j.model_dump()
        if u:
            data["author_name"]       = f"{u.first_name or ''} {u.last_name or ''}".strip() or u.email
            data["author_avatar_url"] = u.profile_photo_url
        out.append(JobRead.model_validate(data))
    return out

@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    job = Job(**payload.dict(exclude_unset=True), created_by=user.id)
    db.add(job)
    db.commit(); db.refresh(job)

    name = f"{(user.first_name or '')} {(user.last_name or '')}".strip() or user.email
    data = {**job.dict(), "author_name": name, "author_avatar_url": user.profile_photo_url}
    return JobRead.model_validate(data)
