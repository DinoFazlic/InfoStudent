from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_student
from app.models.job import JobSave
from pydantic import BaseModel


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