from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import feedback
from app.db.database import engine
from app.models.feedback import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Feedback Service API",
    description="Microservicio para gestionar reseñas y valoraciones de temas",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback.router, prefix="/api/feedback", tags=["Reviews"])