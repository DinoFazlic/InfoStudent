from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date, time
from enum import Enum
from sqlalchemy import Column, Enum as PgEnum
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY



# === ENUMS ===

class UserRole(str, Enum):
    student = "student"
    employer = "employer"
    admin = "admin"

class DayOfWeek(str, Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"

class SubjectEnum(str, Enum):
    biology = "biology"
    mathematics = "mathematics"
    physics = "physics"
    programming = "programming"
    informatics = "informatics"
    history = "history"
    chemistry = "chemistry"
    geography = "geography"
    english = "english"
    other_languages = "other_languages"
    literature = "literature"
    economics = "economics"
    art = "art"
    music = "music"
    philosophy = "philosophy"
    psychology = "psychology"
    sociology = "sociology"
    physical_education = "physical_education"


# === TABLES ===

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    email: str = Field(unique=True, nullable=False)
    contact_phone: Optional[str]
    password_hash: str
    role: UserRole = Field(sa_column=Column(PgEnum(UserRole), nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    profile_photo_url: Optional[str]

    student_profile: Optional["StudentProfile"] = Relationship(back_populates="user")
    employer_profile: Optional["EmployerProfile"] = Relationship(back_populates="user")


class StudentProfile(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    biography: Optional[str]
    skills: Optional[List[str]] = Field(
    default=None,
    sa_column=Column(ARRAY(String)))
    experience: Optional[str]
    cv_url: Optional[str]

    user: User = Relationship(back_populates="student_profile")


class EmployerProfile(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    company_name: str
    company_description: Optional[str]
    address: Optional[str]
    website_url: Optional[str]

    user: User = Relationship(back_populates="employer_profile")


class Instruction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="user.id")
    title: str
    description: str
    hourly_rate: Optional[float]
    contact_info: Optional[str]
    subject: SubjectEnum = Field(sa_column=Column(PgEnum(SubjectEnum), nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class InstructionSchedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    instruction_id: int = Field(foreign_key="instruction.id")
    day: DayOfWeek = Field(sa_column=Column(PgEnum(DayOfWeek), nullable=False))
    start_time: time
    end_time: time


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="user.id")
    title: str
    description: str
    location: Optional[str]
    capacity: int = 20
    price: Optional[float]
    application_deadline: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    contact_info: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class JobSchedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id")
    day: DayOfWeek = Field(sa_column=Column(PgEnum(DayOfWeek), nullable=False))
    start_time: time
    end_time: time


class JobApplication(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id")
    student_id: int = Field(foreign_key="user.id")
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

    class Config:
        unique_together = ("job_id", "student_id")


class StudentAvailability(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    day: DayOfWeek = Field(sa_column=Column(PgEnum(DayOfWeek), nullable=False))
    start_time: time
    end_time: time
