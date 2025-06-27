from datetime import datetime
from pydantic import Field 
from typing import Optional
from pydantic import BaseModel

class ReviewReceivedSchema(BaseModel):
    reviewer_id: int 
    reviewer_name: str
    comment: str
    rating: int
    avatar_url: Optional[str] = None 

class ReviewGivenSchema(BaseModel):
    id: int
    reviewee_id: int
    reviewee_name: str
    comment: str
    rating: int
    avatar_url: Optional[str] = None 

class ReviewUpdateSchema(BaseModel):
    comment: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)

class ReviewCreate(BaseModel):
    reviewee_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    reviewer_id: int
    reviewee_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True