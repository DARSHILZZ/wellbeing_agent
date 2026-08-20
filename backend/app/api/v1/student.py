from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
async def get_student_stats(session_id: str):
    # Mock stats
    return {
        "mastery_percentage": 78,
        "streak_days": 12,
        "cognitive_load_state": "optimal"
    }
