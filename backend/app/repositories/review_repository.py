from sqlmodel import select
from sqlalchemy.orm import Session
from app.models.review import Review

def get_received_reviews(user_id: int, db: Session):
    statement = select(Review).where(Review.reviewee_id == user_id)
    return db.scalars(statement).all()  

def get_given_reviews(user_id: int, db: Session):
    statement = select(Review).where(Review.reviewer_id == user_id)
    return db.scalars(statement).all() 
