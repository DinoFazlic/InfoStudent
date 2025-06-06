# backend/app/models/review.py
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from typing_extensions import Annotated


class Review(SQLModel, table=True):
    __tablename__ = "reviews"                       # obavezno

    id: Optional[int] = Field(default=None, primary_key=True)

    reviewer_id: int = Field(foreign_key="users.id", nullable=False)
    reviewee_id: int = Field(foreign_key="users.id", nullable=False)

    rating: Annotated[int, Field(ge=1, le=5)]
    comment: Optional[str] = None                   # ← unified naziv
    created_at: datetime = Field(default_factory=datetime.utcnow)

    reviewer: "User" = Relationship(
        back_populates="given_reviews",
        sa_relationship_kwargs={"foreign_keys": "[Review.reviewer_id]"},
    )
    reviewee: "User" = Relationship(
        back_populates="received_reviews",
        sa_relationship_kwargs={"foreign_keys": "[Review.reviewee_id]"},
    )


# lazy import na dnu
from .users import User
