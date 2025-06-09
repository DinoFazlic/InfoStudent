# backend/app/models/employer_profile.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class EmployerProfile(SQLModel, table=True):          # ← OVO ime mora postojati!
    __tablename__ = "employer_profiles"

    user_id: int = Field(
        primary_key=True,
        foreign_key="users.id",
        nullable=False,
        index=True,
    )

    company_name: Optional[str] = None
    company_description: Optional[str] = None
    address: Optional[str] = None
    website_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # back-ref ka User
    user: "User" = Relationship(back_populates="employer_profile")

# lazy import – staviti NA KRAJ fajla
from .users import User
