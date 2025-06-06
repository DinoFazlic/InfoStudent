# app/repositories/instruction_repository.py
from sqlalchemy.orm import Session
from app.models.instruction import Instruction

def create_instruction(db: Session, data: dict, user_id: int) -> Instruction:
    inst = Instruction(**data, created_by=user_id)
    db.add(inst)
    db.commit()
    db.refresh(inst)          # povuče created_at, updated_at, id …
    return inst

def list_instructions(db: Session) -> list[Instruction]:
    return db.query(Instruction).order_by(Instruction.created_at.desc()).all()
