from sqlalchemy import Column, SmallInteger, Text, Boolean, DateTime, text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    subject_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    student_grade = Column(SmallInteger, nullable=False)
    general_rating = Column(SmallInteger, nullable=False)
    difficulty_rating = Column(SmallInteger, nullable=False)
    teaching_rating = Column(SmallInteger, nullable=False)
    
    comments = Column(Text, nullable=False)
    is_anonymous = Column(Boolean, nullable=False, server_default=text("false"))
    
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    __table_args__ = (
        UniqueConstraint('student_id', 'subject_id', name='unique_student_subject'),
    )