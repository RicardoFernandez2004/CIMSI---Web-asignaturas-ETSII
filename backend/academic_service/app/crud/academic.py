from sqlalchemy.orm import Session
from app.models.academic import Degree, Professor, Subject
from app.schemas.academic import DegreeCreate, ProfessorCreate, SubjectCreate, SubjectProfessorAssign, ProfessorUpdate, SubjectUpdate
from typing import List, Optional
from uuid import UUID


from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status


# --- DEGREES ---
def get_degrees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Degree).offset(skip).limit(limit).all()

def create_degree(db: Session, degree: DegreeCreate):
    db_degree = Degree(**degree.model_dump())
    db.add(db_degree)
    try:
        db.commit()
        db.refresh(db_degree)
        return db_degree
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un grado con este código."
        )

# --- PROFESSORS ---
def get_professors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Professor).offset(skip).limit(limit).all()

def create_professor(db: Session, professor: ProfessorCreate):
    db_professor = Professor(**professor.model_dump())
    db.add(db_professor)
    try:
        db.commit()
        db.refresh(db_professor)
        return db_professor
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un docente con este correo."
        )

# --- SUBJECTS ---
def get_subjects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Subject).offset(skip).limit(limit).all()


def get_subject(db: Session, subject_id: UUID):
    return db.query(Subject).filter(Subject.id == subject_id).first()

def create_subject(db: Session, subject: SubjectCreate):
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    try:
        db.commit()
        db.refresh(db_subject)
        return db_subject
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una asignatura con este código."
        )


def assign_professors_to_subject(db: Session, subject_id: UUID, professor_ids: List[UUID]):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asignatura no encontrada")
    
    professors = db.query(Professor).filter(Professor.id.in_(professor_ids)).all()
    
    if len(professors) != len(professor_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Uno o más ID de profesor no son válidos."
        )
    
    subject.professors = professors
    
    db.commit()
    db.refresh(subject)
    
    return subject


from app.schemas.academic import DegreeUpdate

def update_degree(db: Session, degree_id: UUID, degree_update: DegreeUpdate):
    db_degree = db.query(Degree).filter(Degree.id == degree_id).first()
    if not db_degree:
        return None
    
    update_data = degree_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_degree, key, value)
        
    db.commit()
    db.refresh(db_degree)
    return db_degree

def delete_degree(db: Session, degree_id: UUID):
    db_degree = db.query(Degree).filter(Degree.id == degree_id).first()
    if db_degree:
        db.delete(db_degree)
        db.commit()
    return db_degree





def update_professor(db: Session, professor_id: UUID, professor_update: ProfessorUpdate):
    db_professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if not db_professor:
        return None
    
    update_data = professor_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_professor, key, value)
        
    db.commit()
    db.refresh(db_professor)
    return db_professor

def delete_professor(db: Session, professor_id: UUID):
    db_professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if db_professor:
        db.delete(db_professor)
        db.commit()
    return db_professor

def update_subject(db: Session, subject_id: UUID, subject_update: SubjectUpdate):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        return None

    update_data = subject_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_subject, key, value)
        
    db.commit()
    db.refresh(db_subject)
    return db_subject

def delete_subject(db: Session, subject_id: UUID):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if db_subject:
        db.delete(db_subject)
        db.commit()
    return db_subject


def get_subjects(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    degree_id: Optional[UUID] = None,
    academic_year: Optional[int] = None
):
    query = db.query(Subject)
    
    if degree_id:
        query = query.filter(Subject.degree_id == degree_id)
    if academic_year:
        query = query.filter(Subject.academic_year == academic_year)
        
    return query.offset(skip).limit(limit).all()