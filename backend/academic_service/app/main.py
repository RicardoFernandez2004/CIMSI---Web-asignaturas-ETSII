from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import academic
from app.db.database import engine
from app.models.academic import Base


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Academic Service API",
    description="Microservicio para la gestión de programas académicos, miembros del profesorado y asignaturas",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(academic.router, prefix="/api/academic", tags=["Academic Data"])