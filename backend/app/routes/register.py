from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.schemas.user_schema import RegisterRequest
from app.database import get_db
from app.controllers import user_controller

router = APIRouter()

@router.post("/register")
def register_user(data: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    return user_controller.register_controller(data, response, db)
