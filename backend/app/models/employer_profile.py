from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from .users import User


    user: Optional[User] = Relationship(back_populates="employer_profile")
