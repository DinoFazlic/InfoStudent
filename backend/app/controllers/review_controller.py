from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import review_service
from app.schemas.review_schema import ReviewCreate, ReviewUpdateSchema
from app.utils.auth import get_current_user
from app.database import get_db
from app.services.review_service import get_reviews_received_service, get_reviews_given_service, delete_review_service, update_review_service
from app.models.users import User

def get_received_reviews_controller(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_reviews_received_service(current_user, db)

def get_given_reviews_controller(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_reviews_given_service(current_user, db)

def delete_review_controller(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return delete_review_service(review_id, current_user, db)

def update_review_controller(
    review_id: int,
    data: ReviewUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_review_service(review_id, data, current_user, db)

def leave_review_controller(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if review_data.reviewee_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot review yourself.")
    return review_service.add_review(db, reviewer_id=current_user.id, data=review_data)


def get_reviews_of_user_controller(
    user_id: int,
    db: Session = Depends(get_db)
):
    return review_service.get_user_reviews(db, user_id)