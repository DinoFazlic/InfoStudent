from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import generate_ai_prompt

router = APIRouter()

class InsightRequest(BaseModel):
    description: str

@router.post("/ai/insight")
async def ai_insight(request: InsightRequest):
    try:
        response = generate_ai_prompt(request.description)
        return {"insight": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
