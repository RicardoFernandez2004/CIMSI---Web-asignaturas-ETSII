from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.feedback import ReviewCreate, ReviewUpdate, ReviewResponse
from app.crud.feedback import get_reviews, create_review, update_review, delete_review
from app.core.security import get_current_user, require_student, TokenData

router = APIRouter()

@router.get("/reviews", response_model=List[ReviewResponse], status_code=status.HTTP_200_OK)
def read_reviews(
    skip: int = 0, 
    limit: int = 100, 
    subject_id: Optional[UUID] = None,
    student_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    return get_reviews(db, skip=skip, limit=limit, subject_id=subject_id, student_id=student_id)

@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def add_review(
    review: ReviewCreate, 
    db: Session = Depends(get_db), 
    student_user: TokenData = Depends(require_student)
):
    return create_review(db=db, review=review, student_id=UUID(student_user.user_id))

@router.put("/reviews/{review_id}", response_model=ReviewResponse, status_code=status.HTTP_200_OK)
def modify_review(
    review_id: UUID, 
    review_in: ReviewUpdate, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    updated_review = update_review(
        db=db, 
        review_id=review_id, 
        review_update=review_in, 
        current_user_id=current_user.user_id, 
        role=current_user.role
    )
    if not updated_review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reseña no encontrada")
    return updated_review

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_review(
    review_id: UUID, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    deleted_review = delete_review(
        db=db, 
        review_id=review_id, 
        current_user_id=current_user.user_id, 
        role=current_user.role
    )
    if not deleted_review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reseña no encontrada")
    return None