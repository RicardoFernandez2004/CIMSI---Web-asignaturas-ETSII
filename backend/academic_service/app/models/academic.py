from sqlalchemy import Column, String, SmallInteger, ForeignKey, Table, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base

# Tabla puente (N:M) entre Professores y Materias
subject_teacher = Table(
    "subject_teacher",
    Base.metadata,
    Column("professor_id", UUID(as_uuid=True), ForeignKey("professors.id", ondelete="CASCADE"), primary_key=True),
    Column("subject_id", UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), primary_key=True),
    Column("created_at", DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
)

class Degree(Base):
    __tablename__ = "degrees"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    duration_years = Column(SmallInteger, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    subjects = relationship("Subject", back_populates="degree", cascade="all, delete-orphan")


class Professor(Base):
    __tablename__ = "professors"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    department = Column(String(255), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    subjects = relationship("Subject", secondary=subject_teacher, back_populates="professors")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    degree_id = Column(UUID(as_uuid=True), ForeignKey("degrees.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    academic_year = Column(SmallInteger, nullable=False)
    semester = Column(SmallInteger, nullable=False)
    ects = Column(SmallInteger, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    degree = relationship("Degree", back_populates="subjects")
    professors = relationship("Professor", secondary=subject_teacher, back_populates="subjects")