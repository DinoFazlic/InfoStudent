from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ➕ Sent from frontend
class MessageCreate(BaseModel):
    receiver_id: int
    content: str

# 👁️ Sent back to frontend
class MessageRead(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True  # instead of orm_mode for Pydantic v2
