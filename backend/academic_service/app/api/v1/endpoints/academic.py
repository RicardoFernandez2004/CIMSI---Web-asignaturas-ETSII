from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from typing import Optional



from app.db.database import get_db
from app.schemas.academic import (
    DegreeCreate, DegreeResponse, 
    ProfessorCreate, ProfessorResponse, 
    SubjectCreate, SubjectResponse, SubjectProfessorAssign,
    DegreeUpdate, ProfessorUpdate, SubjectUpdate
)
from app.crud.academic import (
    get_degrees, create_degree,
    get_professors, create_professor,
    get_subjects, create_subject, assign_professors_to_subject,
    update_degree, delete_degree, update_professor, delete_professor,
    update_subject, delete_subject, get_subject
)
from app.core.security import get_current_user, require_admin, TokenData

router = APIRouter()

# --- DEGREES (Grados) ---

@router.get("/degrees", response_model=List[DegreeResponse], status_code=status.HTTP_200_OK)
def read_degrees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    return get_degrees(db, skip=skip, limit=limit)

@router.post("/degrees", response_model=DegreeResponse, status_code=status.HTTP_201_CREATED)
def add_degree(degree: DegreeCreate, db: Session = Depends(get_db), admin_user: TokenData = Depends(require_admin)):
    return create_degree(db=db, degree=degree)


# --- PROFESSORS (Docentes) ---

@router.get("/professors", response_model=List[ProfessorResponse], status_code=status.HTTP_200_OK)
def read_professors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    return get_professors(db, skip=skip, limit=limit)

@router.post("/professors", response_model=ProfessorResponse, status_code=status.HTTP_201_CREATED)
def add_professor(professor: ProfessorCreate, db: Session = Depends(get_db), admin_user: TokenData = Depends(require_admin)):
    return create_professor(db=db, professor=professor)


# --- SUBJECTS (Asignaturas) ---
@router.get("/subjects", response_model=List[SubjectResponse], status_code=status.HTTP_200_OK)
def read_subjects(
    skip: int = 0, 
    limit: int = 100, 
    degree_id: Optional[UUID] = None,
    academic_year: Optional[int] = None,
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    return get_subjects(
        db, 
        skip=skip, 
        limit=limit, 
        degree_id=degree_id, 
        academic_year=academic_year
    )


@router.get("/subjects/{subject_id}", response_model=SubjectResponse, status_code=status.HTTP_200_OK)
def read_subject(
    subject_id: UUID,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    db_subject = get_subject(db, subject_id=subject_id)
    if not db_subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Asignatura no encontrada"
        )
    return db_subject

@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def add_subject(subject: SubjectCreate, db: Session = Depends(get_db), admin_user: TokenData = Depends(require_admin)):
    return create_subject(db=db, subject=subject)

@router.post("/subjects/{subject_id}/professors", response_model=SubjectResponse, status_code=status.HTTP_200_OK)
def link_professors_to_subject(
    subject_id: UUID, 
    assignment: SubjectProfessorAssign, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    return assign_professors_to_subject(db=db, subject_id=subject_id, professor_ids=assignment.professor_ids)





@router.put("/degrees/{degree_id}", response_model=DegreeResponse, status_code=status.HTTP_200_OK)
def modify_degree(
    degree_id: UUID, 
    degree_in: DegreeUpdate, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    updated_degree = update_degree(db=db, degree_id=degree_id, degree_update=degree_in)
    if not updated_degree:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grado no encontrado")
    return updated_degree

@router.delete("/degrees/{degree_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_degree(
    degree_id: UUID, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    deleted_degree = delete_degree(db=db, degree_id=degree_id)
    if not deleted_degree:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grado no encontrado")
    return None


@router.put("/professors/{professor_id}", response_model=ProfessorResponse, status_code=status.HTTP_200_OK)
def modify_professor(
    professor_id: UUID, 
    professor_in: ProfessorUpdate, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    updated_professor = update_professor(db=db, professor_id=professor_id, professor_update=professor_in)
    if not updated_professor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Docente no encontrado")
    return updated_professor

@router.delete("/professors/{professor_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_professor(
    professor_id: UUID, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    deleted_professor = delete_professor(db=db, professor_id=professor_id)
    if not deleted_professor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Docente no encontrado")
    return None


@router.put("/subjects/{subject_id}", response_model=SubjectResponse, status_code=status.HTTP_200_OK)
def modify_subject(
    subject_id: UUID, 
    subject_in: SubjectUpdate, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    updated_subject = update_subject(db=db, subject_id=subject_id, subject_update=subject_in)
    if not updated_subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asignatura no encontrada")
    return updated_subject

@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_subject(
    subject_id: UUID, 
    db: Session = Depends(get_db), 
    admin_user: TokenData = Depends(require_admin)
):
    deleted_subject = delete_subject(db=db, subject_id=subject_id)
    if not deleted_subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asignatura no encontrada")
    return None