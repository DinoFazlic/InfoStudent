# app/schemas/instruction_schema.py
from datetime import datetime
from typing     import Optional

from pydantic import BaseModel, Field


# ───────────────────────── Pydantic Base ──────────────────────────
class InstructionBase(BaseModel):
    title:         str
    description:   str
    hourly_rate:   Optional[float] = None
    contact_info:  Optional[str]   = None
    subject:       Optional[str]   = None

    class Config:
        from_attributes = True          # orm_mode za Pydantic-v2


# ───────────────────────── Kreiranje (POST) ───────────────────────
class InstructionCreate(InstructionBase):
    """Polja koja klijent smije poslati prilikom kreiranja."""
    pass


# ───────────────────────── Ispis (GET/POST-response) ──────────────
class InstructionRead(InstructionBase):
    id:                int
    created_at:        datetime
    updated_at:        Optional[datetime] = None
    created_by: int
    # polja koja *mi* dodajemo u routeru
    author_name:       Optional[str] = Field(default=None, description="Ime i prezime kreatora")
    author_avatar_url: Optional[str] = Field(default=None, description="URL na profilnu")

    class Config:
        from_attributes = True
