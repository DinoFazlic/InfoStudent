from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.dependencies import get_db, get_current_user, get_current_user_optional
from app.models import User, EmployerProfile
from app.models.internship import Internship, InternshipSave, InternshipApplication
from app.schemas.internship_schema import InternshipCreate, InternshipRead, InternshipUpdate 

router = APIRouter(prefix="/api/internships", tags=["Internships"])


@router.get("", response_model=List[InternshipRead])
def list_internships(
    db: Session = Depends(get_db),
    current_user: Optional[User] = None
):
    query = (
        db.query(
            Internship,
            User.id.label("author_id"),
            User.role.label("author_role"),
            User.first_name,
            User.last_name,
            User.profile_photo_url,
            User.email.label("author_email"),
            EmployerProfile.company_name,
        )
        .join(User, Internship.created_by == User.id)
        .outerjoin(EmployerProfile, User.id == EmployerProfile.user_id) 
        .order_by(Internship.posted_at.desc())
    )

    all_internships = query.all()

    saved_ids = set()
    applied_ids = set()

    if current_user and current_user.role == "student":
        saved_ids = {
            item.internship_id
            for item in db.query(InternshipSave.internship_id)
            .filter(InternshipSave.student_id == current_user.id)
            .all()
        }
        applied_ids = {
            item.internship_id
            for item in db.query(InternshipApplication.internship_id)
            .filter(InternshipApplication.student_id == current_user.id)
            .all()
        }

    response_list = []
    for (
        internship,
        author_id,
        author_role,
        first_name,
        last_name,
        avatar_url,
        author_email,
        company_name,
    ) in all_internships:
        internship_data = internship.__dict__.copy() 
        internship_data["author_id"] = author_id
        internship_data["author_role"] = author_role
        internship_data["author_first_name"] = first_name
        internship_data["author_last_name"] = last_name
        internship_data["author_avatar_url"] = avatar_url
        internship_data["author_email"] = author_email
        internship_data["company_name"] = company_name
        internship_data["saved"] = internship.id in saved_ids
        internship_data["applied"] = internship.id in applied_ids
        
        response_list.append(InternshipRead.model_validate(internship_data))

    return response_list


@router.post("", response_model=InternshipRead, status_code=status.HTTP_201_CREATED)
def create_internship(
    payload: InternshipCreate,
    db: Session = Depends(get_db),
    me: User = Depends(get_current_user),
):
    if me.role not in ("employer", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers or admins can create internships.",
        )

    
    new_internship = Internship(**payload.model_dump(exclude_unset=True), created_by=me.id)
    db.add(new_internship)
    db.commit()
    db.refresh(new_internship) 

    company_name = None
    if me.role == "employer":
        profile = (
            db.query(EmployerProfile.company_name)
            .filter(EmployerProfile.user_id == me.id)
            .first()
        )
        if profile:
            company_name = profile.company_name

  
    response_data = new_internship.__dict__.copy()
    response_data["author_id"] = me.id
    response_data["author_role"] = me.role
    response_data["author_first_name"] = me.first_name
    response_data["author_last_name"] = me.last_name
    response_data["author_avatar_url"] = me.profile_photo_url
    response_data["company_name"] = company_name
    response_data["applied"] = False
    response_data["saved"] = False
    
    return InternshipRead.model_validate(response_data)


@router.put("/{internship_id}", response_model=InternshipRead)
def update_internship(
    internship_id: int,
    payload: InternshipUpdate,
    db: Session = Depends(get_db),
    me: User = Depends(get_current_user),
):
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found.")

    if internship.created_by != me.id and me.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this internship.",
        )

    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(internship, key, value) 

    db.add(internship) 
    db.commit() 
    db.refresh(internship) 

    
    company_name = None
    if me.role == "employer":
        profile = (
            db.query(EmployerProfile.company_name)
            .filter(EmployerProfile.user_id == me.id)
            .first()
        )
        if profile:
            company_name = profile.company_name

    response_data = internship.__dict__.copy()
    response_data["author_id"] = me.id
    response_data["author_role"] = me.role
    response_data["author_first_name"] = me.first_name
    response_data["author_last_name"] = me.last_name
    response_data["author_avatar_url"] = me.profile_photo_url
    response_data["company_name"] = company_name
    
    response_data["applied"] = False 
    response_data["saved"] = False   
    if me.role == "student":
        
        response_data["applied"] = db.query(InternshipApplication).filter_by(
            internship_id=internship.id, student_id=me.id
        ).first() is not None
        response_data["saved"] = db.query(InternshipSave).filter_by(
            internship_id=internship.id, student_id=me.id
        ).first() is not None

    return InternshipRead.model_validate(response_data)


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(internship_id: int, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    internship = db.get(Internship, internship_id) 
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found."
        )

    if internship.created_by != me.id and me.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this internship.",
        )

    db.delete(internship)
    db.commit()
    return 