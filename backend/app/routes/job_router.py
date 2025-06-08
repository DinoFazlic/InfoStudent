from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.job import Job, JobApplication, JobSave
from app.models.users import User
from app.schemas.job_schema import JobCreate, JobRead

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("", response_model=list[JobRead])
def list_jobs(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    rows = db.query(Job).order_by(Job.created_at.desc()).all()

    # Check if user is a student
    applied_job_ids = set()
    saved_job_ids = set()


    if user.role == "student":
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

