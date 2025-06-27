from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_student
from app.models.job import JobSave
from pydantic import BaseModel
from app.models.job import Job, JobSave
from app.models.users import User
from app.schemas.job_schema import JobRead
from typing import List

router = APIRouter(prefix="/api/job-saves", tags=["Job Saves"])

class SaveJobRequest(BaseModel):
    job_id: int

@router.post("")
def save_job(
    payload: SaveJobRequest,
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    job_id = payload.job_id
    existing = db.query(JobSave).filter_by(student_id=student.id, job_id=job_id).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved.")

    save = JobSave(student_id=student.id, job_id=job_id)
    db.add(save)
    db.commit()
    return {"msg": "Job saved successfully."}


@router.delete("/{job_id}", status_code=204)
def unsave_job(
    job_id: int,
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    job_save = db.query(JobSave).filter_by(student_id=student.id, job_id=job_id).first()
    if not job_save:
        raise HTTPException(status_code=404, detail="Job not saved.")
    
    db.delete(job_save)
    db.commit()
    return

@router.get("", response_model=List[JobRead])
def get_saved_jobs(
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    saves = db.query(JobSave).filter_by(student_id=student.id).all()
    jobs = [db.get(Job, s.job_id) for s in saves]
    result = []
    for job in jobs:
        if job is None: continue
        author = db.get(User, job.created_by)
        data = job.model_dump()
        data["author_name"] = f"{(author.first_name or '')} {(author.last_name or '')}".strip() or author.email
        data["author_avatar_url"] = author.profile_photo_url
        data["applied"] = False
        data["saved"] = True
        result.append(JobRead.model_validate(data))
    return result