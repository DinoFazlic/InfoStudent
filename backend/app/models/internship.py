import enum
from datetime import date, datetime
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship, Column

from sqlalchemy import DateTime, func, ForeignKey, Enum as SQLEnum

from .users import User
from .employer_profile import EmployerProfile # Corrected import for EmployerProfile

class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class Internship(SQLModel, table=True):
    __tablename__ = "internship"

    id: Optional[int] = Field(default=None, primary_key=True)

    created_by: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    title: str
    description: str
    location: Optional[str] = None
    stipend: Optional[float] = None

    posted_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    application_deadline: Optional[date] = None

    owner: Optional[User] = Relationship(back_populates="internships")

    applications: List["InternshipApplication"] = Relationship(
        back_populates="internship",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )

class InternshipApplication(SQLModel, table=True):
    __tablename__ = "internship_application"

    id: Optional[int] = Field(default=None, primary_key=True)

    internship_id: int = Field(
        sa_column=Column(ForeignKey("internship.id", ondelete="CASCADE"))
    )
    student_id: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    cv_url: Optional[str] = None

    applied_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    status: ApplicationStatus = Field(
        sa_column=Column(
            SQLEnum(ApplicationStatus, name="internship_application_status_enum"),
            default=ApplicationStatus.pending,
            server_default=ApplicationStatus.pending.value,
        )
    )

    internship: Optional[Internship] = Relationship(back_populates="applications")
    student: Optional[User] = Relationship(back_populates="internship_applications")

class InternshipSave(SQLModel, table=True):
    __tablename__ = "internship_saves"

    id: Optional[int] = Field(default=None, primary_key=True)

    internship_id: int = Field(
        sa_column=Column(ForeignKey("internship.id", ondelete="CASCADE"))
    )

    student_id: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    saved_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )