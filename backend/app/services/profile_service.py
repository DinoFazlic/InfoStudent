from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.user_schema import UpdateStudentProfileRequest, UpdateEmployerProfileRequest
from app.utils.file import save_uploaded_file
import os
from app.utils.pdf_utils import extract_text_from_pdf
from app.services.schedule_parser import parse_pdf_schedule_matrix
from app.models.availability import Student_Availability
from datetime import datetime





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


UPLOAD_FOLDER = "app/static/profile_photos"

def update_profile_photo_service(file: UploadFile, db: Session, current_user: User):
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Invalid file format")

    filename = save_uploaded_file(file, UPLOAD_FOLDER)
    current_user.profile_photo_url = f"/static/profile_photos/{filename}"
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"photo_url": current_user.profile_photo_url}

CV_UPLOAD_FOLDER = "app/static/cv_uploads"

def update_student_cv_service(file: UploadFile, db: Session, current_user: User):
    if not file.filename.lower().endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid CV format")

    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can upload CVs")

    filename = save_uploaded_file(file, CV_UPLOAD_FOLDER)

    student_profile = current_user.student_profile
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    student_profile.cv_url = f"/static/cv_uploads/{filename}"
    db.add(student_profile)
    db.commit()
    db.refresh(student_profile)

    return {"cv_url": student_profile.cv_url}

SCHEDULE_UPLOAD_FOLDER = "app/static/schedule_uploads"

def update_student_schedule_service(file: UploadFile, db: Session, current_user: User):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can upload schedules")

    filename = save_uploaded_file(file, SCHEDULE_UPLOAD_FOLDER)
    full_path = os.path.join(SCHEDULE_UPLOAD_FOLDER, filename)

    try:
        parsed_slots = parse_pdf_schedule_matrix(full_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse schedule: {e}")

    # TERMINAL OUTPUT
    print("\n Schedule PDF:")
    for slot in parsed_slots:
        print(f"🔹 {slot['day']}: {slot['start_time']} - {slot['end_time']}")

    existing = db.query(Student_Availability).filter_by(student_id=current_user.id).all()

    for availability in existing:
        db.delete(availability)

    for slot in parsed_slots:
        availability = Student_Availability(
            student_id=current_user.id,
            day=slot["day"],
            start_time=datetime.strptime(slot["start_time"], "%H:%M").time(),
            end_time=datetime.strptime(slot["end_time"], "%H:%M").time()
        )
        db.add(availability)

    # UPDATE PROFILE 
    student_profile = current_user.student_profile
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    student_profile.schedule_url = f"/static/schedule_uploads/{filename}"
    db.add(student_profile)
    db.commit()

    return {
        "schedule_url": student_profile.schedule_url,
        "parsed_slots": len(parsed_slots),
        "message": "Schedule successfully updated!"
    }