from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import time

class Student_Availability(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    day: str
    start_time: time
    end_time: time
