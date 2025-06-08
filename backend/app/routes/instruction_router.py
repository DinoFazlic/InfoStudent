# app/routes/instruction_router.py
from typing import List

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.instruction        import Instruction, InstructionSave
from app.models.users              import User
from app.schemas.instruction_schema import InstructionCreate, InstructionRead


# ---------------------------------------------------------------------------
router = APIRouter(prefix="/api/instructions", tags=["instructions"])
# ---------------------------------------------------------------------------


# ─────────────────────────────── GET /api/instructions ─────────────────────────
@router.get("", response_model=List[InstructionRead])
def list_instructions(db: Session = Depends(get_db),user = Depends(get_current_user),):

    rows = db.query(Instruction).order_by(Instruction.created_at.desc()).all()
    out: List[InstructionRead] = []

    saved_instruction_ids = set()

    if user and user.role == "student":
        saved_instruction_ids = {
            row.instruction_id
            for row in db.query(InstructionSave.instruction_id)
            .filter(InstructionSave.student_id == user.id)
            .all()
        }

    for inst in rows:
        if inst.id in saved_instruction_ids:
            continue

        user: User | None = db.get(User, inst.created_by)

        # ------- siguran fallback za ime + avatar -----------
        author_name   = ((user.first_name or "") + " " + (user.last_name or "")).strip() if user else None
        author_name   = author_name or (user.email if user else "Nepoznato")
        avatar_url    = user.profile_photo_url if user else None
        # -----------------------------------------------------

        data = inst.model_dump()
        data["created_by"] = inst.created_by
        # pretvorba na ISO string (frontendu lakše)
        data["created_at"] = inst.created_at.isoformat()
        if inst.updated_at:
            data["updated_at"] = inst.updated_at.isoformat()

        data["author_name"]       = author_name
        data["author_avatar_url"] = avatar_url

        out.append(InstructionRead.model_validate(data))

    return out


# ─────────────────────────────── POST /api/instructions ───────────────────────
@router.post("", response_model=InstructionRead, status_code=status.HTTP_201_CREATED)
def create_instruction(
    payload: InstructionCreate,
    db: Session = Depends(get_db),
    user: User  = Depends(get_current_user),
):
    """
    Logged-in korisnik kreira novu instrukciju.
    """
    inst = Instruction(
        **payload.model_dump(exclude_unset=True),
        created_by=user.id,
    )
    db.add(inst)
    db.commit()
    db.refresh(inst)

    author_name = ((user.first_name or "") + " " + (user.last_name or "")).strip() or user.email

    data = inst.model_dump()
    data["created_at"]        = inst.created_at.isoformat()
    data["updated_at"]        = inst.updated_at.isoformat() if inst.updated_at else None
    data["author_name"]       = author_name
    data["author_avatar_url"] = user.profile_photo_url

    return InstructionRead.model_validate(data)



@router.delete("/{instruction_id}", status_code=204)
def delete_instruction(
    instruction_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Delete instruction only if the logged-in user is the creator.
    """
    instruction = db.get(Instruction, instruction_id)
    if not instruction:
        raise HTTPException(status_code=404, detail="Instruction not found.")

    if instruction.created_by != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this instruction.")

    db.delete(instruction)
    db.commit()
