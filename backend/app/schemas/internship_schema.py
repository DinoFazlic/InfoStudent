# app/schemas/internship_schema.py
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel


# --------- shared fields ---------
class InternshipBase(BaseModel):
    title: str
    description: str
    company: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[float] = None
    contact_email: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class InternshipCreate(InternshipBase):
    pass


class InternshipRead(InternshipBase):
    id: int
    posted_at: datetime
    author_name: Optional[str] = None
    author_avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}
