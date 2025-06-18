from sqlalchemy.orm import Session
# Ukloni selectinload jer ce se dohvatiti putem servisa/repozitorija
# from app.models.job import JobApplication
# from app.models.internship import InternshipApplication
from app.schemas.application_schema import ApplicationStatusUpdate
from app.services.application_service import ApplicationService # Uvezi klasu servisa
from app.repositories.application_repository import ApplicationRepository # Uvezi klasu repozitorija


# Kreiraj instancu ApplicationRepository (ovo se obično radi sa Depends u ruterima, ali za controller se može i ovako)
application_repository_instance = ApplicationRepository()
# Kreiraj instancu ApplicationService i prosledi joj instancu repozitorija
application_service_instance = ApplicationService(application_repository_instance)


def get_job_applicants(db: Session, job_id: int):
    # Sada pozivamo metodu iz servisa, koja koristi repozitorij sa joinedload
    return application_service_instance.list_applicants_for_job(db, job_id)

def get_internship_applicants(db: Session, internship_id: int):
    # Sada pozivamo metodu iz servisa, koja koristi repozitorij sa joinedload
    return application_service_instance.list_applicants_for_internship(db, internship_id)

def update_job_status_controller(application_id: int, new_status: str, db: Session):
    return application_service_instance.change_job_application_status(db, application_id, new_status)

def update_internship_status_controller(application_id: int, new_status: str, db: Session):
    return application_service_instance.change_internship_application_status(db, application_id, new_status)