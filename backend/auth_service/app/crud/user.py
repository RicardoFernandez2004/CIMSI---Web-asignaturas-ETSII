from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, AdminCreate
from typing import List
from uuid import UUID


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = User(
        email=user.email,
        hashed_password=hashed_password, 
        name=user.name,
        surname=user.surname,
        date_of_birth=user.date_of_birth,
        role="student"
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def get_users_bulk(db: Session, user_ids: List[UUID]):
    return db.query(User).filter(User.id.in_(user_ids)).all()


def create_admin(db: Session, user: AdminCreate, hashed_password: str):
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        surname=user.surname,
        date_of_birth=user.date_of_birth,
        role="admin" 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user