from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import chat, practice, student, teacher, auth
from app.core.config import settings
from app.db.database import engine, Base
from app.models.user import User # to ensure model is registered

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduWell API",
    description="Backend for EduWell: AI for Equitable Education Access",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(practice.router, prefix=f"{settings.API_V1_STR}/practice", tags=["practice"])
app.include_router(student.router, prefix=f"{settings.API_V1_STR}/student", tags=["student"])
app.include_router(teacher.router, prefix=f"{settings.API_V1_STR}/teacher", tags=["teacher"])

@app.get("/")
def root():
    return {"message": "Welcome to the EduWell API"}
