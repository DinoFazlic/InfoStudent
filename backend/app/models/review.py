from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from typing_extensions import Annotated

class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    reviewer_id: int = Field(foreign_key="user.id")
    reviewee_id: int = Field(foreign_key="user.id")

    rating: Annotated[int, Field(ge=1, le=5)]
    review_text: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    reviewer: Optional["User"] = Relationship(back_populates="given_reviews", sa_relationship_kwargs={"foreign_keys": "[Review.reviewer_id]"})
    reviewee: Optional["User"] = Relationship(back_populates="received_reviews", sa_relationship_kwargs={"foreign_keys": "[Review.reviewee_id]"})


from .users import User
