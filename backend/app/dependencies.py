# backend/app/dependencies.py
from app.database import get_db
from app.utils.auth import get_current_user, get_current_student, get_current_employer

__all__ = [
    "get_db",
    "get_current_user",
    "get_current_student",
    "get_current_employer",
]
