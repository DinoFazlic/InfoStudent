from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from app.dependencies import get_db
from app.models.job import JobApplication
from app.models.internship import InternshipApplication
from app.schemas.application_schema import ApplicationStatusUpdate
from app.services import application_service
from app.controllers import application_controller # Import the controller functions
from app.schemas.application_schema import (
    ApplicationStatusUpdate,
    JobApplicationOut,
    InternshipApplicationOut,
)
from typing import List


router = APIRouter(prefix="/api", tags=["Applications"])

# === GET applicants by post ===

@router.get("/jobs-applications/by-post/{job_id}")
def get_job_applicants(job_id: int, db: Session = Depends(get_db)):
    return application_controller.get_job_applicants(db, job_id)


@router.get("/internship-applications/by-post/{internship_id}")
def get_internship_applicants(internship_id: int, db: Session = Depends(get_db)):
    return application_controller.get_internship_applicants(db, internship_id)

# === PUT status update ===

@router.put("/applications/job/{application_id}/status")
def update_job_status(application_id: int, payload: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    app = application_controller.update_job_status_controller(application_id, payload.status, db)
    if not app:
        raise HTTPException(404, "Application not found")
    return {"msg": "Status updated", "new_status": app.status}


@router.put("/applications/internship/{application_id}/status")
def update_internship_status(application_id: int, payload: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    app = application_controller.update_internship_status_controller(application_id, payload.status, db)
    if not app:
        raise HTTPException(404, "Application not found")
    return {"msg": "Status updated", "new_status": app.status}

@router.get("/job-applications/by-post/{job_id}", response_model=List[JobApplicationOut])
def get_job_applicants(job_id: int, db: Session = Depends(get_db)):
    return application_controller.get_job_applicants(db, job_id)

@router.get("/internship-applications/by-post/{internship_id}", response_model=List[InternshipApplicationOut])
def get_internship_applicants(internship_id: int, db: Session = Depends(get_db)):
    return application_controller.get_internship_applicants(db, internship_id)