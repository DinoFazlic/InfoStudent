from pydantic import BaseModel
from typing import Literal

class ApplicationStatusUpdate(BaseModel):
    status: Literal["pending", "accepted", "rejected"]
