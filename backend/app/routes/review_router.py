from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.users import User
from app.utils.auth import get_current_user
from app.schemas.review_schema import ReviewCreate, ReviewOut, ReviewUpdateSchema
from app.controllers.review_controller import (
    get_received_reviews_controller,
    get_given_reviews_controller,
    delete_review_controller,
    get_reviews_of_user_controller,
    leave_review_controller,
    update_review_controller,
)

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/received")
def get_reviews_received(current_user_reviews = Depends(get_received_reviews_controller)):
    return current_user_reviews

@router.get("/given")
def get_reviews_given(current_user_reviews = Depends(get_given_reviews_controller)):
    return current_user_reviews

@router.get("/received/{user_id}")
def get_reviews_received_public(user_id: int, db: Session = Depends(get_db)):
    """Public endpoint to fetch reviews received by a given user (no auth required)."""
    from app.services.review_service import get_reviews_received_for_user_service
    return get_reviews_received_for_user_service(user_id, db)

@router.delete("/{review_id}")
def delete_review(review_id: int, result=Depends(delete_review_controller)):
    if isinstance(result, tuple):
        body, status = result
        raise HTTPException(status_code=status, detail="Greška prilikom brisanja recenzije.")
    return result

@router.put("/{review_id}")
def update_review(
    review_id: int,
    data: ReviewUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = update_review_controller(review_id=review_id, data=data, current_user=current_user, db=db)

    if isinstance(result, tuple):
        body, status = result
        error_msg = body["error"] if isinstance(body, dict) and "error" in body else str(body)
        raise HTTPException(status_code=status, detail=error_msg)
    return result

@router.post("", response_model=ReviewOut)
def leave_review(
    review_data: ReviewCreate,
    result=Depends(leave_review_controller)
):
    return result

@router.get("/user/{user_id}", response_model=List[ReviewOut])
def get_reviews(user_id: int, result=Depends(get_reviews_of_user_controller)):
    return result
