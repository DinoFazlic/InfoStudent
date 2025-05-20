from sqlalchemy.orm import Session
from app.models.users import User
from app.repositories.review_repository import get_received_reviews, get_given_reviews
from app.schemas.review_schema import ReviewReceivedSchema, ReviewGivenSchema

def get_reviews_received_service(current_user: User, db: Session):
    reviews = get_received_reviews(current_user.id, db)
    return [
        ReviewReceivedSchema(
            reviewer_name = (
                r.reviewer.employer_profile.company_name
                if r.reviewer and r.reviewer.role == "employer" and r.reviewer.employer_profile and r.reviewer.employer_profile.company_name
                else f"{r.reviewer.first_name} {r.reviewer.last_name}" if r.reviewer else "Anonymous"
            ),   
            review_text=r.review_text,
            rating=r.rating
        )
        for r in reviews
    ]

def get_reviews_given_service(current_user: User, db: Session):
    reviews = get_given_reviews(current_user.id, db)
    return [
        ReviewGivenSchema(
            reviewee_name = (
                r.reviewee.employer_profile.company_name
                if r.reviewee and r.reviewee.role == "employer" and r.reviewee.employer_profile and r.reviewee.employer_profile.company_name
                else f"{r.reviewee.first_name} {r.reviewee.last_name}" if r.reviewee else "Unknown"
            ),
            review_text=r.review_text,
            rating=r.rating
        )
        for r in reviews
    ]
