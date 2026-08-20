from fastapi import APIRouter

router = APIRouter()

@router.get("/insights")
async def get_teacher_insights():
    # Mock insights
    return {
        "flagged_students": [
            {"id": "S123", "name": "Alice", "reason": "High frustration in Chapter 9"}
        ],
        "high_confusion_chapters": [
            {"chapter": "Ch 9: Force and Laws of Motion", "confusion_score": 0.85}
        ]
    }
