from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.auth import get_current_user
from app.models.users import User
from app.schemas.user_schema import UpdateStudentProfileRequest, UpdateEmployerProfileRequest
from app.controllers.profile_controller import update_student_profile_controller, update_employer_profile_controller

router = APIRouter()

@router.put("/users/me/student")
def update_student_profile(
    data: UpdateStudentProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_student_profile_controller(data, db, current_user)

@router.put("/users/me/employer")
def update_employer_profile(
    data: UpdateEmployerProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_employer_profile_controller(data, db, current_user)