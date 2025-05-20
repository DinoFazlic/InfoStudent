from fastapi import Depends
from sqlalchemy.orm import Session
from app.utils.auth import get_current_user
from app.database import get_db
from app.services.review_service import get_reviews_received_service, get_reviews_given_service
from app.models.users import User

def get_received_reviews_controller(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_reviews_received_service(current_user, db)

def get_given_reviews_controller(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_reviews_given_service(current_user, db)
