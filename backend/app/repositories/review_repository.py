from typing import List
from sqlmodel import select
from sqlalchemy.orm import Session
from app.models.review import Review

def get_received_reviews(user_id: int, db: Session):
    statement = select(Review).where(Review.reviewee_id == user_id)
    return db.scalars(statement).all()  

def get_given_reviews(user_id: int, db: Session):
    statement = select(Review).where(Review.reviewer_id == user_id)
    return db.scalars(statement).all() 

def delete_review_by_id(review_id: int, db: Session):
    review = db.get(Review, review_id)
    if review:
        db.delete(review)
        db.commit()
        return True
    return False

def update_review_by_id(review: Review, comment: str, rating: int, db: Session):
    review.comment = comment
    review.rating = rating
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def create_review(db: Session, review: Review) -> Review:
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_reviews_for_user(db: Session, user_id: int) -> List[Review]:
    return db.execute(select(Review).where(Review.reviewee_id == user_id)).scalars().all()
