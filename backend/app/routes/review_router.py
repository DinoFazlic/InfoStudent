from fastapi import APIRouter, Depends
from app.controllers.review_controller import get_received_reviews_controller, get_given_reviews_controller

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/received")
def get_reviews_received(current_user_reviews = Depends(get_received_reviews_controller)):
    return current_user_reviews

@router.get("/given")
def get_reviews_given(current_user_reviews = Depends(get_given_reviews_controller)):
    return current_user_reviews
