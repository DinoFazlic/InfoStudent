from pydantic import BaseModel, EmailStr, constr
from typing import Literal, Optional, List

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    city: Optional[str] = None
    contact_phone: Optional[str] = None
    role: Literal["student", "employer"]
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
