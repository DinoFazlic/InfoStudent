from fastapi import APIRouter
from app.services.avatar_service import generate_avatar_prompt

router = APIRouter()

@router.get("/test-avatar-prompt")
def test_avatar_prompt():
    description = generate_avatar_prompt("student")
    return {"avatar_description": description}
