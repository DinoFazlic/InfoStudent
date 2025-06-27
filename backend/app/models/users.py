# backend/app/models/users.py

from datetime import datetime
from typing import List, Optional,TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime, func

if TYPE_CHECKING:
    from .job import Job, JobSchedule, JobApplication, JobSave
    from .student_profile import StudentProfile
    from .employer_profile import EmployerProfile
    from .review import Review
    from .instruction import Instruction
    from .internship import Internship, InternshipApplication

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    email: str = Field(unique=True, nullable=False)
    contact_phone: Optional[str]
    password_hash: str
    role: Optional[str]

    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    profile_photo_url: Optional[str]
    cv_url: Optional[str]  # URL na PDF/CV

    # ================== RELACIJE ==================
    student_profile: Optional["StudentProfile"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"uselist": False},
    )

    employer_profile: Optional["EmployerProfile"] = Relationship(
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

    jobs: List["Job"] = Relationship(back_populates="owner")
    
    internships: List["Internship"] = Relationship(back_populates="owner")
    
    job_applications: List["JobApplication"] = Relationship(back_populates="student")
    
    internship_applications: List["InternshipApplication"] = Relationship(
        back_populates="student"
    )

    job_saves: List["JobSave"] = Relationship(
    back_populates="student",
    sa_relationship_kwargs={"cascade": "all, delete-orphan"},
)

