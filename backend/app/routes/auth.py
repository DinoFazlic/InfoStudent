from fastapi import APIRouter, Depends, Response, BackgroundTasks, status
from sqlalchemy.orm import Session
from sqlmodel import select
from app.database import get_db
from app.schemas.user_schema import LoginRequest, ResetPasswordRequest, RegisterRequest, LoginResponse, UserFullProfile, UserRead
from app.controllers.user_controller import login_controller,register_controller
from app.controllers.password_controller import forgot_password_controller, reset_password_controller

from app.utils.auth import get_current_user
from app.models.users import User
from app.schemas.user_schema import UserRead
from fastapi import Request
from fastapi.responses import JSONResponse
from app.utils.auth import get_current_student, get_current_employer
from sqlalchemy.orm import selectinload
#from sqlmodel import Session



from fastapi import HTTPException

from app.models.availability import Student_Availability


router = APIRouter()

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK,)
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    return login_controller(data, response, db)

@router.post("/forgot-password")
def forgot_password(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    return forgot_password_controller(email, background_tasks, db)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password_controller(data, db)

@router.post("/register")
def register(data: RegisterRequest, response: Response, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):

    return register_controller(data, response, db, background_tasks)

@router.options("/register")
def preflight_register_handler():
    return Response(status_code=200)


@router.get("/users/me", response_model=UserRead)
def get_logged_in_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users/student/me", response_model=UserRead)
def get_student_info(current_user: User = Depends(get_current_student)):
    return current_user

@router.get("/users/employer/me", response_model=UserRead)
def get_employer_info(current_user: User = Depends(get_current_employer)):
    return current_user

@router.get("/users/{user_id}", response_model=UserRead)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/view/{user_id}", response_model=UserFullProfile)
def get_full_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = select(Student_Availability).where(Student_Availability.student_id == user_id)
    availability = db.execute(query).scalars().all()

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role,
        "city": user.city,
        "contact_phone": user.contact_phone,
        "profile_photo_url": user.profile_photo_url,

        # student dodatno
        "biography": user.student_profile.biography if user.student_profile else None,
        "skills": user.student_profile.skills if user.student_profile else None,
        "experience": user.student_profile.experience if user.student_profile else None,
        "cv_url": user.student_profile.cv_url if user.student_profile else None,

        # availability
        "availability": availability
    }

@router.post("/logout")
def logout(response: Response):
    response = JSONResponse(content={"msg": "Logged out"})
    response.delete_cookie(key="access_token")
    return response

@router.get("/users/email/{email}", response_model=UserRead)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
