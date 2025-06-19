from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class InternshipBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    stipend: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    application_deadline: Optional[date] = None


class InternshipCreate(InternshipBase):
    pass


class InternshipRead(InternshipBase):
    id: int
    posted_at: datetime

   
    author_id: int
    author_role: str
    author_first_name: Optional[str] = None
    author_last_name: Optional[str] = None
    author_email: Optional[str] = None
    author_avatar_url: Optional[str] = None
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    author_name: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
   
    applied: bool = False
    saved: bool = False

    class Config:
        from_attributes = True

class InternshipUpdate(InternshipBase):
    
    pass