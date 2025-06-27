# app/routes/job_application_router.py
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_student
from app.models.job import JobApplication 
from app.models.student_profile import StudentProfile
from app.utils.file import save_uploaded_file

router = APIRouter(prefix="/api/job-applications", tags=["Job Applications"])

@router.post("", status_code=201)
def apply_to_job(
    job_id: int = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    student = Depends(get_current_student)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == student.id).first()

    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found.")

    if file:
        print(f"Received file: {file.filename if file else 'No file'}")
        filename = save_uploaded_file(file, "app/static/cv_uploads")
        cv_url = f"/static/cv_uploads/{filename}"
    elif profile.cv_url:
        cv_url = profile.cv_url
    else:
        raise HTTPException(status_code=400, detail="No CV available. Please upload one.")

    application = JobApplication(
        student_id=student.id,
        job_id=job_id,
        cv_url=cv_url,
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return {"msg": "Application submitted successfully."}
