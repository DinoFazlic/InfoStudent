from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime, time
from enum import Enum
from .users import User

class SubjectEnum(str, Enum):
    biology = "biology"
    mathematics = "mathematics"
    physics = "physics"
    programming = "programming"
    informatics = "informatics"
    history = "history"
    chemistry = "chemistry"
    geography = "geography"
    english = "english"
    other_languages = "other_languages"
    literature = "literature"
    economics = "economics"
    art = "art"
    music = "music"
    philosophy = "philosophy"
    psychology = "psychology"
    sociology = "sociology"
    physical_education = "physical_education"

class Instruction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="user.id")
    title: str
    description: str
    hourly_rate: Optional[float]
    contact_info: Optional[str]
    subject: SubjectEnum
    created_at: Optional[datetime] = Field(default=None)
    updated_at: Optional[datetime] = Field(default=None)

class InstructionSchedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    instruction_id: int = Field(foreign_key="instruction.id")
    day: str
    start_time: time
    end_time: time
