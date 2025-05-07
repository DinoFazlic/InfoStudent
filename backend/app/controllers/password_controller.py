from fastapi import HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta
import os

from app.models.users import User
from app.schemas.user_schema import ResetPasswordRequest
from app.utils.email import send_email_async
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY")
RESET_SECRET = SECRET_KEY
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def forgot_password_controller(email: str, background_tasks: BackgroundTasks, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    reset_token = jwt.encode(
        {"sub": user.email, "exp": datetime.utcnow() + timedelta(minutes=30)},
        RESET_SECRET,
        algorithm=ALGORITHM
    )

    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"

    subject = "Password Reset Request"
    body = f"""
            <html>
            <body>
                <p>Hi!</p>
                <p>Click the link below to reset your password:</p>
                <p><a href="{reset_link}">{reset_link}</a></p>
                <p>If you didn't request this, you can ignore this email.</p>
            </body>
            </html>
        """


    background_tasks.add_task(send_email_async, user.email, subject, body)
    return {"msg": "Reset link sent to your email."}


def reset_password_controller(data: ResetPasswordRequest, db: Session):
    try:
        payload = jwt.decode(data.token, RESET_SECRET, algorithms=[ALGORITHM])
        email = payload.get("sub")
        exp = payload.get("exp")

        if not email or (exp and datetime.utcfromtimestamp(exp) < datetime.utcnow()):
            raise HTTPException(status_code=400, detail="Invalid or expired token")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = pwd_context.hash(data.new_password)
    user.password_hash = hashed_password
    db.commit()

    return {"msg": "Password reset successful"}
