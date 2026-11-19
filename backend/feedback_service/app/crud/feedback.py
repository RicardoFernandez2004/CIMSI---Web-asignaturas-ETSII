from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional

from app.models.feedback import Review
from app.schemas.feedback import ReviewCreate, ReviewUpdate

def get_reviews(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    subject_id: Optional[UUID] = None, 
    student_id: Optional[UUID] = None
):
    query = db.query(Review)
    
    if subject_id:
        query = query.filter(Review.subject_id == subject_id)
    if student_id:
        query = query.filter(Review.student_id == student_id)
        
    return query.offset(skip).limit(limit).all()

def create_review(db: Session, review: ReviewCreate, student_id: UUID):
    db_review = Review(**review.model_dump(), student_id=student_id)
    db.add(db_review)
    
    try:
        db.commit()
        db.refresh(db_review)
        return db_review
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya has dejado una reseña para esta asignatura."
        )

def update_review(db: Session, review_id: UUID, review_update: ReviewUpdate, current_user_id: str, role: str):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        return None
        
    if role != "admin" and str(db_review.student_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para editar esta reseña."
        )
    
    update_data = review_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_review, key, value)
        
    db.commit()
    db.refresh(db_review)
    return db_review

def delete_review(db: Session, review_id: UUID, current_user_id: str, role: str):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review:
        if role != "admin" and str(db_review.student_id) != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para eliminar esta reseña.."
            )
            
        db.delete(db_review)
        db.commit()
    return db_review