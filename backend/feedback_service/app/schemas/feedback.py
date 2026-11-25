from pydantic import BaseModel, Field, ConfigDict, model_validator
from uuid import UUID
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    subject_id: UUID
    student_grade: int = Field(..., ge=1, le=10, description="Calificación obtenida en la asignatura")
    general_rating: int = Field(..., ge=0, le=5, description="Evaluación general (0-5)")
    difficulty_rating: int = Field(..., ge=0, le=5, description="Dificultad (0-5)")
    teaching_rating: int = Field(..., ge=0, le=5, description="Calidad de la enseñanza (0-5)")
    comments: str = Field(..., min_length=5, description="Texto del comentario (min 5 letras)")
    is_anonymous: bool = False

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    student_grade: Optional[int] = Field(None, ge=1, le=10)
    general_rating: Optional[int] = Field(None, ge=0, le=5)
    difficulty_rating: Optional[int] = Field(None, ge=0, le=5)
    teaching_rating: Optional[int] = Field(None, ge=0, le=5)
    comments: Optional[str] = Field(None, min_length=5)
    is_anonymous: Optional[bool] = None

class ReviewResponse(ReviewBase):
    id: UUID
    student_id: Optional[UUID] = None  
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode='after')
    def mask_anonymous_student(self):
        if self.is_anonymous:
            self.student_id = None
        return self