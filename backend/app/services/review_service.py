from sqlalchemy.orm import Session
from app.models.users import User
from app.models.review import Review
from app.repositories.review_repository import create_review, get_received_reviews, get_given_reviews, delete_review_by_id, get_reviews_for_user, update_review_by_id
from app.schemas.review_schema import ReviewCreate, ReviewReceivedSchema, ReviewGivenSchema, ReviewUpdateSchema
from sqlmodel import select

def get_reviews_received_service(current_user: User, db: Session):
    reviews = get_received_reviews(current_user.id, db)
    return [
        ReviewReceivedSchema(
            reviewer_id=r.reviewer_id,
            reviewer_name=(
                r.reviewer.employer_profile.company_name
                if r.reviewer and r.reviewer.role == "employer" and r.reviewer.employer_profile and r.reviewer.employer_profile.company_name
                else f"{r.reviewer.first_name} {r.reviewer.last_name}" if r.reviewer else "Anonymous"
            ),
            comment=r.comment,
            rating=r.rating,
            avatar_url=(
                f"http://localhost:8000{r.reviewer.profile_photo_url}"
                if r.reviewer and r.reviewer.profile_photo_url
                else None
            )
        )
        for r in reviews
    ]

def get_reviews_given_service(current_user: User, db: Session):
    reviews = get_given_reviews(current_user.id, db)
    return [
        ReviewGivenSchema(
            id=r.id,
            reviewee_id=r.reviewee_id,
            reviewee_name=(
                r.reviewee.employer_profile.company_name
                if r.reviewee and r.reviewee.role == "employer" and r.reviewee.employer_profile and r.reviewee.employer_profile.company_name
                else f"{r.reviewee.first_name} {r.reviewee.last_name}" if r.reviewee else "Unknown"
            ),
            comment=r.comment,
            rating=r.rating,
            avatar_url=(
                f"http://localhost:8000{r.reviewee.profile_photo_url}"
                if r.reviewee and r.reviewee.profile_photo_url
                else None
            )
        )
        for r in reviews
    ]

def delete_review_service(review_id: int, current_user: User, db: Session):
    review = db.get(Review, review_id)
    if not review:
        return {"error": "Review not found"}, 404

    if review.reviewer_id != current_user.id:
        return {"error": "You can only delete your own reviews"}, 403

    success = delete_review_by_id(review_id, db)
    if success:
        return {"message": "Review deleted"}, 200
    return {"error": "Deletion failed"}, 500

def update_review_service(review_id: int, data: ReviewUpdateSchema, current_user: User, db: Session):
    review = db.get(Review, review_id)
    if not review:
        return {"error": "Review not found"}, 404

    if review.reviewer_id != current_user.id:
        return {"error": "You can only update your own reviews"}, 403

    updated = update_review_by_id(review, data.comment, data.rating, db)

    return {
        "id": updated.id,
        "reviewee_name": (
            updated.reviewee.employer_profile.company_name
            if updated.reviewee and updated.reviewee.role == "employer"
            and updated.reviewee.employer_profile and updated.reviewee.employer_profile.company_name
            else f"{updated.reviewee.first_name} {updated.reviewee.last_name}" if updated.reviewee else "Unknown"
        ),
        "comment": updated.comment,
        "rating": updated.rating,
        "avatar_url": (
            f"http://localhost:8000{updated.reviewee.profile_photo_url}"
            if updated.reviewee and updated.reviewee.profile_photo_url
            else None
        )
    }, 200

def add_review(db: Session, reviewer_id: int, data: ReviewCreate) -> Review:
    # Check if this reviewer has already reviewed this user
    existing = db.exec(select(Review).where(Review.reviewer_id == reviewer_id, Review.reviewee_id == data.reviewee_id)).first()
    if existing:
        return {"error": "You have already reviewed this user."}, 400

    new_review = Review(
        reviewer_id=reviewer_id,
        reviewee_id=data.reviewee_id,
        rating=data.rating,
        comment=data.comment,
    )
    return create_review(db, new_review)

def get_user_reviews(db: Session, user_id: int):
    return get_reviews_for_user(db, user_id)

# Public: get received reviews for arbitrary user (no auth needed)
def get_reviews_received_for_user_service(user_id: int, db: Session):
    """Return reviews received by specified user (public view)."""
    reviews = get_received_reviews(user_id, db)
    return [
        ReviewReceivedSchema(
            reviewer_id=r.reviewer_id,
            reviewer_name=(
                r.reviewer.employer_profile.company_name
                if r.reviewer and r.reviewer.role == "employer" and r.reviewer.employer_profile and r.reviewer.employer_profile.company_name
                else f"{r.reviewer.first_name} {r.reviewer.last_name}" if r.reviewer else "Anonymous"
            ),
            comment=r.comment,
            rating=r.rating,
            avatar_url=(
                f"http://localhost:8000{r.reviewer.profile_photo_url}"
                if r.reviewer and r.reviewer.profile_photo_url
                else None
            ),
        )
        for r in reviews
    ]
