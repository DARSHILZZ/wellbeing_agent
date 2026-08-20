from fastapi import APIRouter

router = APIRouter()

@router.get("/insights")
async def get_teacher_insights():
    # Simulated query to mastery records/submission trends
    return {
        "flagged_students": [
            {"id": "S123", "name": "Alice Johnson", "reason": "Consecutive low scores in Physics", "severity": "High"},
            {"id": "S124", "name": "Bob Smith", "reason": "No login for 3 days", "severity": "Medium"}
        ],
        "high_confusion_chapters": [
            {"chapter": "Newton's Second Law", "confusion_score": 0.85},
            {"chapter": "Conservation of Energy", "confusion_score": 0.72}
        ]
    }
