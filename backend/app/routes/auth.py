from fastapi import APIRouter, Depends, Response, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import LoginRequest, ResetPasswordRequest, RegisterRequest
from app.controllers.user_controller import login_controller,register_controller
from app.controllers.password_controller import forgot_password_controller, reset_password_controller

from app.utils.auth import get_current_user
from app.models.users import User
from app.schemas.user_schema import UserRead
from fastapi import Request
from fastapi.responses import JSONResponse



router = APIRouter()

@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    return login_controller(data, response, db)

@router.post("/forgot-password")
def forgot_password(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    return forgot_password_controller(email, background_tasks, db)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password_controller(data, db)

@router.post("/register")
def register(data: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    return register_controller(data, response, db)

@router.get("/users/me", response_model=UserRead)
def get_logged_in_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout(response: Response):
    response = JSONResponse(content={"msg": "Logged out"})
    response.delete_cookie(key="access_token")
    return response
