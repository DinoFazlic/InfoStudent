from sqlalchemy.orm import Session
from app.repositories.application_repository import ApplicationRepository # Uvezi klasu repozitorija

class ApplicationService:
    def __init__(self, application_repository: ApplicationRepository):
        self.application_repository = application_repository

    def list_applicants_for_job(self, db: Session, job_id: int):
        return self.application_repository.get_job_applications_by_post_id(db, job_id)

    def list_applicants_for_internship(self, db: Session, internship_id: int):
        return self.application_repository.get_internship_applications_by_post_id(db, internship_id)

    def change_job_application_status(self, db: Session, application_id: int, new_status: str):
        return self.application_repository.update_job_application_status(db, application_id, new_status)

    def change_internship_application_status(self, db: Session, application_id: int, new_status: str):
        return self.application_repository.update_internship_application_status(db, application_id, new_status)

# Instanciraj ApplicationService s ApplicationRepository (ovo se obično radi kroz FastAPI-jeve Depends)
# Za testiranje, možeš kreirati instancu ovako (ali u produkciji se osloni na Depends):
# application_service = ApplicationService(ApplicationRepository())