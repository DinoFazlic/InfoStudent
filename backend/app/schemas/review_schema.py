from pydantic import BaseModel

class ReviewReceivedSchema(BaseModel):
    reviewer_name: str
    review_text: str
    rating: int

class ReviewGivenSchema(BaseModel):
    reviewee_name: str
    review_text: str
    rating: int
