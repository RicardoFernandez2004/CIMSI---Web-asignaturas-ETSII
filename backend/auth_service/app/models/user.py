import enum
from sqlalchemy import Column, String, Boolean, Date, DateTime, Enum, text
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base

class UserRole(str, enum.Enum):
    student = "student"
    professor = "professor"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    
    # Usiamo l'Enum definito sopra e specifichiamo il nome del tipo Postgres
    role = Column(Enum(UserRole, name="user_role"), nullable=False, server_default="student")
    is_active = Column(Boolean, nullable=False, server_default=text("true"))
    
    # TIMESTAMPTZ corrisponde a DateTime(timezone=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=text("now()"))