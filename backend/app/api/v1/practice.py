from fastapi import APIRouter

from app.agents.practice_agent import generate_adaptive_practice

router = APIRouter()

@router.get("/adaptive")
async def get_adaptive_practice(concept_gap: str = "Newton's Second Law", student_level: str = "intermediate"):
    return generate_adaptive_practice(concept_gap, student_level)
