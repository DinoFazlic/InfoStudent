# backend/app/models/student_profile.py
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import ARRAY, TEXT   # ⬅️ NEW

class StudentProfile(SQLModel, table=True):
    __tablename__ = "student_profiles"           # 100 % isto kao u bazi

    user_id: int = Field(
        primary_key=True,
        foreign_key="users.id",
        nullable=False,
        index=True,
    )

    biography: Optional[str] = None
    skills: Optional[List[str]] = Field(
        sa_column=Column(ARRAY(TEXT))             # ⬅️ mapiramo na TEXT[]
    )
    experience: Optional[str] = None
    cv_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # back-ref ka User
    user: "User" = Relationship(back_populates="student_profile")
    
from .users import User