from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from .users import User

class Students(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    biography: Optional[str]
    skills: List[str] = Field(default_factory=list, sa_column=Column(ARRAY(String)))
    experience: Optional[str]
    cv_url: Optional[str]
    schedule_url: Optional[str]
    user: Optional[User] = Relationship(back_populates="student_profile")
