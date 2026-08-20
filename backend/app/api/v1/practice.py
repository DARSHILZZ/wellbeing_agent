from fastapi import APIRouter

router = APIRouter()

@router.get("/adaptive")
async def get_adaptive_practice(session_id: str):
    # Mock data for adaptive practice
    return {
        "concept_gap": "Newton's Second Law",
        "questions": [
            {
                "id": 1,
                "text": "If a force of 10 N is applied to a 2 kg mass, what is its acceleration?",
                "options": ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"],
                "correct_answer": "5 m/s²"
            }
        ]
    }
