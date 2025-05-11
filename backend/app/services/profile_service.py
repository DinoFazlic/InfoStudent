from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.user_schema import UpdateStudentProfileRequest, UpdateEmployerProfileRequest


def update_student_profile_service(
    data: UpdateStudentProfileRequest,
    db: Session,
    current_user: User
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Forbidden")

    # Update user fields
    for key in ["first_name", "last_name", "city", "contact_phone"]:
        value = getattr(data, key, None)
        if value is not None:
            setattr(current_user, key, value)

    # Update student profile fields
    student = current_user.student_profile
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    for key in ["biography", "skills", "experience", "cv_url"]:
        value = getattr(data, key, None)
        if value is not None:
            setattr(student, key, value)

    db.commit()
    return {"msg": "User and student profile updated successfully"}
def update_employer_profile_service(
    data: UpdateEmployerProfileRequest,
    db: Session,
    current_user: User
):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Forbidden")

    # Update user fields
    for field in ["first_name", "last_name", "city", "contact_phone"]:
        value = getattr(data, field, None)
        if value is not None:
            setattr(current_user, field, value)

    # Update employer profile fields
    employer = current_user.employer_profile
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")

    for field in ["company_name", "company_description", "address", "website_url"]:
        value = getattr(data, field, None)
        if value is not None:
            setattr(employer, field, value)

    db.commit()
    return {"msg": "User and employer profile updated successfully"}