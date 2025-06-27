from pydantic import BaseModel
from typing import Optional, Literal
from app.schemas.user_schema import UserRead

class ApplicationStatusUpdate(BaseModel):
    status: Literal["pending", "accepted", "rejected"]


# === Mini user info za prikaz ===
class UserMiniOut(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    profile_photo_url: Optional[str]

    class Config:
        from_attributes = True

# === Student profil koji sadrži usera ===
class StudentWithUserOut(BaseModel):
    id: int
    user: UserMiniOut  # ← ključno!

    class Config:
        from_attributes = True

# === Aplikacija (response) ===
class JobApplicationOut(BaseModel):
    id: int
    status: Literal["pending", "accepted", "rejected"]
    student: UserMiniOut  # ⬅️ koristi pojednostavljen schema

    class Config:
        from_attributes = True


class InternshipApplicationOut(BaseModel):
    id: int
    status: Literal["pending", "accepted", "rejected"]
    student: UserMiniOut

    class Config:
        from_attributes = True