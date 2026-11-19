from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date, datetime
from uuid import UUID
from typing import Optional, List
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str
    surname: str
    date_of_birth: date

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    model_config = ConfigDict(extra="forbid")

class UserResponse(UserBase):
    id: UUID
    created_at: Optional[datetime] = None 

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class RegisterResponse(BaseModel):
    user: UserResponse
    token: Token


class UserBulkRequest(BaseModel):
    user_ids: List[UUID]

class UserBulkResponse(BaseModel):
    id: UUID
    name: str
    surname: str


class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    surname: str
    date_of_birth: date