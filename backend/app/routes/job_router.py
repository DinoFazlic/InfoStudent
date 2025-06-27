from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user_optional, get_current_user
from app.models.job import Job, JobApplication, JobSave
from app.models.users import User
from app.schemas.job_schema import JobCreate, JobRead, JobUpdate

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("", response_model=list[JobRead])
def list_jobs(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
    search: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
):
    query = db.query(Job)

    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) |
            (Job.description.ilike(f"%{search}%"))
        )

    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))

    if min_price is not None:
        query = query.filter(Job.price >= min_price)

    rows = query.order_by(Job.created_at.desc()).all()


    # Check if user is a student
    applied_job_ids = set()
    saved_job_ids = set()

    if user and user.role == "student":
        # Get job IDs the student applied to
        applied_job_ids = {
            job_id for (job_id,) in db.query(JobApplication.job_id).filter(
                JobApplication.student_id == user.id
            ).all()
        }

        saved_job_ids = {
            job_id for (job_id,) in db.query(JobSave.job_id).filter(
                JobSave.student_id == user.id
            ).all()
        }

    out = []
    for j in rows:
        if j.id in saved_job_ids:
            continue
        
        u = db.get(User, j.created_by)
        data = j.model_dump()
        data["created_by"] = j.created_by

        if u:
            data["author_name"]       = f"{u.first_name or ''} {u.last_name or ''}".strip() or u.email
            data["author_avatar_url"] = u.profile_photo_url

        # Mark if applied — only if student, otherwise always False
        data["applied"] = j.id in applied_job_ids
        data["saved"] = j.id in saved_job_ids

        out.append(JobRead.model_validate(data))

    return out

@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):

    if user.role not in ["employer"]:
        raise HTTPException(status_code=403, detail="Only employers or admins can create jobs.")

    job = Job(**payload.dict(exclude_unset=True), created_by=user.id)
    db.add(job)
    db.commit()
    db.refresh(job)

    name = f"{(user.first_name or '')} {(user.last_name or '')}".strip() or user.email
    data = {
        **job.dict(),
        "author_name": name,
        "author_avatar_url": user.profile_photo_url,
        "applied": False,  
        "saved": False   
    }
    return JobRead.model_validate(data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if job.created_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this job.")

    db.delete(job)
    db.commit()


@router.put("/{id}", response_model=JobRead)
def update_job(
    id: int,
    payload: JobCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.created_by != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this job")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    author = db.get(User, job.created_by)
    return JobRead.model_validate({
        **job.dict(),
        "author_name": f"{author.first_name or ''} {author.last_name or ''}".strip() or author.email,
        "author_avatar_url": author.profile_photo_url,
        "applied": False,
        "saved": False,
    })