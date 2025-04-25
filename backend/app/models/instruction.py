from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime, time
from enum import Enum
from .users import User

class Instruction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="user.id")
    title: str
    description: str
    hourly_rate: Optional[float]
    contact_info: Optional[str]
    subject: Optional[str]
    created_at: Optional[datetime] = Field(default=None)
    updated_at: Optional[datetime] = Field(default=None)

class Instruction_Schedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    instruction_id: int = Field(foreign_key="instruction.id")
    day: str
    start_time: time
    end_time: time
