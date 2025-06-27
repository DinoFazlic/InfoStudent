# backend/app/models/job.py

import enum
from datetime import date, datetime, time
from typing import Optional, List
# … postojeći importi …
from sqlalchemy import DateTime, func, ForeignKey, Enum as SQLEnum   #  ✅  ovo dodati

from sqlmodel import SQLModel, Field, Relationship, Column


from .users import User

class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class Job(SQLModel, table=True):
    __tablename__ = "jobs"                      # ← plural, da se poklapa sa SQL

    id: Optional[int] = Field(default=None, primary_key=True)

    created_by: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    title: str
    description: str
    location: Optional[str] = None
    capacity: int = Field(default=20)
    price: Optional[float] = None
    application_deadline: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    contact_info: Optional[str] = None

    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
        )
    )

    owner: Optional[User] = Relationship(back_populates="jobs")

    schedules: List["JobSchedule"] = Relationship(
        back_populates="job",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    applications: List["JobApplication"] = Relationship(
        back_populates="job",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    saves: List["JobSave"] = Relationship(
    back_populates="job",
    sa_relationship_kwargs={"cascade": "all, delete-orphan"},
)


class JobSchedule(SQLModel, table=True):
    __tablename__ = "job_schedules"            # ← plural

    id: Optional[int] = Field(default=None, primary_key=True)

    job_id: int = Field(
        sa_column=Column(ForeignKey("jobs.id", ondelete="CASCADE"))
    )
    day: str
    start_time: time
    end_time: time

    job: Optional[Job] = Relationship(back_populates="schedules")


class JobApplication(SQLModel, table=True):
    __tablename__ = "job_applications"      

    id: Optional[int] = Field(default=None, primary_key=True)

    job_id: int = Field(
        sa_column=Column(ForeignKey("jobs.id", ondelete="CASCADE"))
    )
    student_id: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    applied_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    status: ApplicationStatus = Field(
        sa_column=Column(
            SQLEnum(ApplicationStatus, name="job_application_status_enum"),
            default=ApplicationStatus.pending,
            server_default=ApplicationStatus.pending.value,
        )
    )

    job: Optional[Job] = Relationship(back_populates="applications")
    student: Optional[User] = Relationship(back_populates="job_applications")


class JobSave(SQLModel, table=True):
    __tablename__ = "job_saves"

    id: Optional[int] = Field(default=None, primary_key=True)

    job_id: int = Field(
        sa_column=Column(ForeignKey("jobs.id", ondelete="CASCADE"))
    )
    student_id: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    saved_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    job: Optional[Job] = Relationship(back_populates="saves")
    student: Optional[User] = Relationship(back_populates="job_saves")
