from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional, List

# --- DEGREES ---
class DegreeBase(BaseModel):
    code: str
    name: str
    department: str
    duration_years: int

class DegreeCreate(DegreeBase):
    pass

class DegreeResponse(DegreeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- PROFESSOR ---
class ProfessorBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    department: str

class ProfessorCreate(ProfessorBase):
    pass

class ProfessorResponse(ProfessorBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- SUBJECTS ---
class SubjectBase(BaseModel):
    code: str
    name: str
    academic_year: int
    semester: int
    ects: int
    degree_id: UUID

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SubjectProfessorAssign(BaseModel):
    professor_ids: List[UUID]




class DegreeUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    department: Optional[str] = None
    duration_years: Optional[int] = None

class ProfessorUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None

class SubjectUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    academic_year: Optional[int] = None
    semester: Optional[int] = None
    ects: Optional[int] = None
    degree_id: Optional[UUID] = None

