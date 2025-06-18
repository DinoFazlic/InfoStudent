from sqlalchemy.orm import Session, joinedload
from app.models.job import JobApplication
from app.models.internship import InternshipApplication
from app.models.student_profile import StudentProfile # Import StudentProfile model
from app.models.users import User # Import User model

class ApplicationRepository:
    def get_job_applications_by_post_id(self, db: Session, job_id: int):
        return (
            db.query(JobApplication)
            .options(
                joinedload(JobApplication.student_profile).joinedload(StudentProfile.user)
            )
            .filter(JobApplication.job_id == job_id)
            .all()
        )

    def get_internship_applications_by_post_id(self, db: Session, internship_id: int):
        return (
            db.query(InternshipApplication)
            .options(
                joinedload(InternshipApplication.student_profile).joinedload(StudentProfile.user)
            )
            .filter(InternshipApplication.internship_id == internship_id)
            .all()
        )

    def update_job_application_status(self, db: Session, application_id: int, new_status: str):
        app = db.query(JobApplication).filter(JobApplication.id == application_id).first()
        if app:
            app.status = new_status
            db.commit()
            db.refresh(app) # Refresh the object to get updated values
        return app

    def update_internship_application_status(self, db: Session, application_id: int, new_status: str):
        app = db.query(InternshipApplication).filter(InternshipApplication.id == application_id).first()
        if app:
            app.status = new_status
            db.commit()
            db.refresh(app) # Refresh the object to get updated values
        return app