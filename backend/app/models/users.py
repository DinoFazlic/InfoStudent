from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    email: str = Field(unique=True, nullable=False)
    contact_phone: Optional[str]
    password_hash: str
    role: Optional[str]
    created_at: Optional[str] = Field(default=None)
    profile_photo_url: Optional[str]

    student_profile: Optional["Students"] = Relationship(back_populates="user")
    employer_profile: Optional["Employers"] = Relationship(back_populates="user")

    given_reviews: List["Review"] = Relationship(
        back_populates="reviewer",
        sa_relationship_kwargs={"foreign_keys": "[Review.reviewer_id]"}
    )
    
    received_reviews: List["Review"] = Relationship(
        back_populates="reviewee",
        sa_relationship_kwargs={"foreign_keys": "[Review.reviewee_id]"}
    )

from .student_profile import Students
from .employer_profile import Employers
from .review import Review