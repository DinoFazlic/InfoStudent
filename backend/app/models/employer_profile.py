from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from .users import User

class Employers(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    company_name: Optional[str]
    company_description: Optional[str]
    address: Optional[str]
    website_url: Optional[str]

    user: Optional[User] = Relationship(back_populates="employer_profile")
