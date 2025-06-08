# app/models/instruction.py
from datetime    import datetime, time
from typing      import Optional, List

from sqlmodel    import SQLModel, Field, Relationship, Column
from sqlalchemy  import DateTime, func, ForeignKey
from app.models.users import User

# ————————————————————————————————————————————————
class Instruction(SQLModel, table=True):
    __tablename__ = "instructions"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int   = Field(foreign_key="users.id")

    title: str
    description: str
    hourly_rate: Optional[float] = None
    contact_info: Optional[str]  = None
    subject: Optional[str]       = None

    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=True,
        ),
        default=None,
    )

    # —— RELATIONS ——
    author:     "User"                              = Relationship(back_populates="instructions")
    schedules:  List["InstructionSchedule"]         = Relationship(
        back_populates="instruction",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class InstructionSchedule(SQLModel, table=True):
    __tablename__ = "instruction_schedules"

    id: Optional[int] = Field(default=None, primary_key=True)
    instruction_id: int = Field(foreign_key="instructions.id")

    day: str                 # ponedjeljak, utorak…
    start_time: time
    end_time:   time

    instruction: Optional[Instruction] = Relationship(back_populates="schedules")


class InstructionSave(SQLModel, table=True):
    __tablename__ = "instruction_saves"

    id: Optional[int] = Field(default=None, primary_key=True)

    instruction_id: int = Field(
        sa_column=Column(ForeignKey("instructions.id", ondelete="CASCADE"))
    )

    student_id: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"))
    )

    saved_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
