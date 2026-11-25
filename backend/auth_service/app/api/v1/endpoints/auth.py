from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import jwt
from fastapi.security import OAuth2PasswordBearer

from app.db.database import get_db
from app.schemas.user import UserCreate, RegisterResponse, Token, UserLogin, UserResponse, UserBulkRequest, UserBulkResponse, AdminCreate
from app.crud.user import get_user_by_email, create_user, get_users_bulk, create_admin
from app.core.security import get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, verify_password, SECRET_KEY, ALGORITHM, require_admin
from app.models.user import User

from typing import List



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

router = APIRouter()

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con este correo"
        )
    
    hashed_password = get_password_hash(user_in.password)
    
    new_user = create_user(db=db, user=user_in, hashed_password=hashed_password)
    
    access_token_expires = ACCESS_TOKEN_EXPIRE_MINUTES * 60  
    token_data = {
        "sub": str(new_user.id),
        "role": new_user.role.value
    }
    access_token = create_access_token(data=token_data)
    
    token = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=access_token_expires
    )
    
    return RegisterResponse(
        user=new_user,
        token=token
    )

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=credentials.email)
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña no validos",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = ACCESS_TOKEN_EXPIRE_MINUTES * 60
    token_data = {
        "sub": str(user.id),
        "role": user.role.value
    }
    access_token = create_access_token(data=token_data)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=access_token_expires
    )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Imposible validar el usuario",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    return user


# Usiamo response_model_exclude per non mostrare "created_at" come richiesto dal tuo contratto
@router.get("/me", response_model=UserResponse, response_model_exclude={"created_at"}, status_code=status.HTTP_200_OK)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/users/bulk", response_model=List[UserBulkResponse])
def read_users_bulk(request: UserBulkRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return get_users_bulk(db=db, user_ids=request.user_ids)




@router.post("/staff", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_admin(
    user_in: AdminCreate, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(require_admin)  # Blocco di sicurezza
):
    
    user = get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con este correo"
        )
    
    hashed_password = get_password_hash(user_in.password)
    new_admin = create_admin(db=db, user=user_in, hashed_password=hashed_password)
    
    return new_admin