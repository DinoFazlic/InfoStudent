from datetime import date, datetime
from typing import Optional
from sqlmodel import SQLModel

class JobBase(SQLModel):
    title: str
    description: str
    location: Optional[str] = None
    capacity: int = 20
    price: Optional[float] = None
    application_deadline: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    contact_info: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobRead(JobBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_name: Optional[str] = None
    author_avatar_url: Optional[str] = None
    applied: bool
    saved: bool = False

    class Config:
        from_attributes = True
