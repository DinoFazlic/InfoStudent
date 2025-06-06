# backend/app/schemas/instruction_schema.py
from datetime import datetime, time
from typing import Optional, List
from sqlmodel import SQLModel, Field



class InstructionBase(SQLModel):
    title: str
    description: str
    hourly_rate: Optional[float] = None
    contact_info: Optional[str] = None
    subject: Optional[str] = None

class InstructionCreate(InstructionBase):
    pass

class InstructionRead(InstructionBase):
    id: int
    created_by: int
    created_at: Optional[datetime] = None 
    updated_at: Optional[datetime] = None
    author_name: Optional[str] = None 