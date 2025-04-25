from sqlalchemy import Column, Integer, String, Enum, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    student = 'student'
    employer = 'employer'
    admin = 'admin'

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    city = Column(String)
    email = Column(String, unique=True, nullable=False, index=True)
    contact_phone = Column(String)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole, name="user_role", create_type=False), nullable=False)
    created_at = Column(TIMESTAMP, server_default="now()")
    profile_photo_url = Column(Text, nullable=True)

