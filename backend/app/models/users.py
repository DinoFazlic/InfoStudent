from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    student = "student"
    employer = "employer"
    admin = "admin"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    email: str = Field(unique=True, nullable=False)
    contact_phone: Optional[str]
    password_hash: str
    role: UserRole
    created_at: Optional[str] = Field(default=None)
    profile_photo_url: Optional[str]

    # Relationships (ako trebaš):
    student_profile: Optional["StudentProfile"] = Relationship(back_populates="user")
    employer_profile: Optional["EmployerProfile"] = Relationship(back_populates="user")
