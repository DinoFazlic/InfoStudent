from sqlalchemy.orm import Session
from app.schemas.user_schema import UpdateStudentProfileRequest, UpdateEmployerProfileRequest
from app.models.users import User
from app.services.profile_service import update_student_profile_service, update_employer_profile_service, update_profile_photo_service, update_student_cv_service, update_student_schedule_service
from fastapi import UploadFile


def update_student_profile_controller(
    data: UpdateStudentProfileRequest,
    db: Session,
    current_user: User
):
    return update_student_profile_service(data, db, current_user)

def update_employer_profile_controller(
    data: UpdateEmployerProfileRequest,
    db: Session,
    current_user: User
):
    return update_employer_profile_service(data, db, current_user)


def update_profile_photo_controller(file: UploadFile, db: Session, current_user: User):
    return update_profile_photo_service(file, db, current_user)


def upload_cv_controller(file: UploadFile, db: Session, current_user: User):
    return update_student_cv_service(file, db, current_user)

def upload_schedule_controller(file: UploadFile, db: Session, current_user: User):
    return update_student_schedule_service(file, db, current_user)