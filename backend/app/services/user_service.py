from sqlalchemy.orm import Session
from app.schemas.user_schema import RegisterRequest
from app.models.users import User
from app.repositories import user_repository
from app.models.student_profile import Students
from app.models.employer_profile import Employers
from passlib.context import CryptContext
from fastapi import HTTPException, BackgroundTasks
from app.services.avatar_service import generate_avatar_prompt
from app.services.image_generation import generate_avatar_image


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(data: RegisterRequest, db: Session, background_tasks: BackgroundTasks):
    if user_repository.get_user_by_email(db, data.email):
        raise ValueError("Email already registered")

    hashed_pw = pwd_context.hash(data.password)

    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password_hash=hashed_pw,
        city=data.city,
        contact_phone=data.contact_phone,
        role=data.role,
    )

    db_user = user_repository.create_user(db, new_user)
    db.refresh(db_user) 
    #print("REGISTER ROLE:", data.role)

    background_tasks.add_task(generate_and_save_avatar, db_user.id, db_user.first_name or "student", db)

    if data.role == "student":
        student_profile = Students(
            user_id=db_user.id,
            biography=data.biography,
            skills=data.skills,
            experience=data.experience,
            cv_url=data.cv_url
        )
        db.add(student_profile)

    elif data.role == "employer":
        employer_profile = Employers(
            user_id=db_user.id,
            company_name=data.company_name,
            company_description=data.company_description,
            address=data.address,
            website_url=data.website_url
        )
        db.add(employer_profile)

    db.commit()
    

    return db_user


def login_user(data, db: Session):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return user



def generate_and_save_avatar(user_id: int, first_name: str, db: Session):
    try:
        prompt = generate_avatar_prompt(first_name or "student")
        avatar_url = generate_avatar_image(prompt, user_id)

        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.profile_photo_url = avatar_url
            db.commit()
            print(f"Avatar generated for user {user_id}")
    except Exception as e:
        print("Background avatar generation failed:", e)