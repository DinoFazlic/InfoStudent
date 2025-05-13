from pydantic import BaseModel, EmailStr, constr
from typing import Literal, Optional, List

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    city: Optional[str] = None
    contact_phone: Optional[str] = None
    role: Literal["student", "employer", "admin"]
    biography: Optional[str] = None
    skills: Optional[List[str]] = []
    experience: Optional[str] = None
    cv_url: Optional[str] = None
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    address: Optional[str] = None
    website_url: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: constr(min_length=6)


class StudentProfileOut(BaseModel):
    biography: Optional[str]
    skills: Optional[List[str]]
    experience: Optional[str]
    cv_url: Optional[str]

    class Config:
        from_attributes = True

class EmployerProfileOut(BaseModel):
    company_name: Optional[str]
    company_description: Optional[str]
    address: Optional[str]
    website_url: Optional[str]

    class Config:
        from_attributes = True

class UserRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: str
    city: Optional[str]
    contact_phone: Optional[str]
    profile_photo_url: Optional[str]


    student_profile: Optional[StudentProfileOut] = None
    employer_profile: Optional[EmployerProfileOut] = None

    class Config:
        from_attributes = True


class UpdateStudentProfileRequest(BaseModel):
    # User fields
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    contact_phone: Optional[str]

    # Student profile fields
    biography: Optional[str]
    skills: Optional[List[str]]
    experience: Optional[str]

    class Config:
        from_attributes = True

class UpdateEmployerProfileRequest(BaseModel):
    # User fields
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[str]
    contact_phone: Optional[str]

    # Employer profile fields
    company_name: Optional[str]
    company_description: Optional[str]
    address: Optional[str]
    website_url: Optional[str]

    class Config:
        from_attributes = True
