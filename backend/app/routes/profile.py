from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.availability import Student_Availability
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.auth import get_current_user
from app.models.users import User
from app.schemas.user_schema import UpdateStudentProfileRequest, UpdateEmployerProfileRequest
from app.controllers.profile_controller import update_profile_photo_controller, update_student_profile_controller, update_employer_profile_controller, upload_cv_controller, upload_schedule_controller

router = APIRouter()

@router.put("/student/profile")
def update_student_profile(
    data: UpdateStudentProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_student_profile_controller(data, db, current_user)

@router.put("/employer/profile")
def update_employer_profile(
    data: UpdateEmployerProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_employer_profile_controller(data, db, current_user)

@router.put("/student/profile/profile-photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_profile_photo_controller(file, db, current_user)

@router.put("/employer/profile/profile-photo")
def upload_employer_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_profile_photo_controller(file, db, current_user)

@router.put("/student/profile/cv")
def upload_student_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return upload_cv_controller(file, db, current_user)

@router.post("/student/upload-schedule")
def upload_schedule(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return upload_schedule_controller(file, db, current_user)


@router.get("/student/availability", response_model=list[dict])
def get_student_availability(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access availability")

    slots = db.query(Student_Availability).filter_by(student_id=current_user.id).all()

    return [
        {
            "day": slot.day,
            "start_time": slot.start_time.strftime("%H:%M"),
            "end_time": slot.end_time.strftime("%H:%M"),
        }
        for slot in slots
    ]