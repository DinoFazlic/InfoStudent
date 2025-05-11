from sqlalchemy.orm import Session
from app.schemas.user_schema import UpdateStudentProfileRequest, UpdateEmployerProfileRequest
from app.models.users import User
from app.services.profile_service import update_student_profile_service, update_employer_profile_service


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