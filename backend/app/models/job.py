from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date, datetime, time
from .users import User

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
    created_at: Optional[datetime] = Field(default=None)
    updated_at: Optional[datetime] = Field(default=None)

class Job_Schedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id")
    day: str
    start_time: time
    end_time: time

class Job_Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id")
    student_id: int = Field(foreign_key="user.id")
    applied_at: Optional[datetime] = Field(default=None)
    status: str = Field(default="pending")
