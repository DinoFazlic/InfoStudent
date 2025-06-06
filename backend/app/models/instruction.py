# app/models/instruction.py
from datetime import datetime, time
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import DateTime, text          # ⬅️ dodaj
from .users import User                       # (lazy import poslije klase je OK)

class Instruction(SQLModel, table=True):
    __tablename__ = "instructions"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="users.id")

    title: str
    description: str
    hourly_rate: Optional[float] = None
    contact_info: Optional[str] = None
    subject: Optional[str] = None

    # ➡️ ispravljen stupac s DateTime(timezone=True)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=text("now()"),
            nullable=False,
        )
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=text("now()"),
            onupdate=text("now()"),
        )
    )

    author: Optional["User"] = Relationship(back_populates="instructions")
    schedules: List["InstructionSchedule"] = Relationship(back_populates="instruction")


class InstructionSchedule(SQLModel, table=True):
    __tablename__ = "instruction_schedules"
    id: Optional[int] = Field(default=None, primary_key=True)
    instruction_id: int = Field(foreign_key="instructions.id")
    day: str
    start_time: time
    end_time: time

    instruction: Instruction = Relationship(back_populates="schedules")


# lazy import na dnu ako želiš izbjeći kružne reference
from .users import User
