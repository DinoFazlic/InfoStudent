from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    __tablename__ = "users"                     # ← obavezno

    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    email: str = Field(unique=True, nullable=False)
    contact_phone: Optional[str]
    password_hash: str
    role: Optional[str]
    created_at: Optional[datetime] = None
    profile_photo_url: Optional[str]

      # ================== RELATIONS ==================
    student_profile: Optional["StudentProfile"] = Relationship(
    back_populates="user",
    sa_relationship_kwargs={"uselist": False},
    )

    employer_profile: Optional["EmployerProfile"] = Relationship(   # ← isto ime
        back_populates="user",
        sa_relationship_kwargs={"uselist": False},
    )

    given_reviews: List["Review"] = Relationship(
        back_populates="reviewer",
        sa_relationship_kwargs={"foreign_keys": "[Review.reviewer_id]"},
    )
    received_reviews: List["Review"] = Relationship(
        back_populates="reviewee",
        sa_relationship_kwargs={"foreign_keys": "[Review.reviewee_id]"},
    )

    instructions: List["Instruction"] = Relationship(back_populates="author")

# --- lazy imports (NA DNU fajla) -----------------------------------------
from .student_profile import StudentProfile            # ③ promijenjeno
from .employer_profile import EmployerProfile          # ④ promijenjeno ako treba
from .review import Review
from .instruction import Instruction