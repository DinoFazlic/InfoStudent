from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.schemas import RegisterRequest
from app.database import get_db
from app import models
from fastapi.responses import JSONResponse

from backend.app.routes import auth

router = APIRouter()

@router.post("/register")
def register_user(data: RegisterRequest, response: Response, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.hash_password(data.password)

    new_user = models.User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password_hash=hashed_pw,
        city=data.city,
        contact_phone=data.contact_phone,
        role=data.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if data.role == "student":
        student_profile = models.StudentProfile(
            user_id=new_user.id,
            biography=data.biography,
            skills=data.skills,
            experience=data.experience,
            cv_url=data.cv_url
        )
        db.add(student_profile)

    elif data.role == "employer":
        employer_profile = models.EmployerProfile(
            user_id=new_user.id,
            company_name=data.company_name,
            company_description=data.company_description,
            address=data.address,
            website_url=data.website_url
        )
        db.add(employer_profile)

    db.commit()

    token = auth.create_access_token({"sub": str(new_user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  
        samesite="lax"
    )

    return {"message": "User registered successfully", "user_id": new_user.id}
