from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
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
