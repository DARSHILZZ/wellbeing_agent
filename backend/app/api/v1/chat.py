from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.agents.tutor_agent import solve_doubt, SocraticTutorResponse

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    student_id: str
    chat_history: Optional[List[Dict[str, Any]]] = None

@router.post("/socratic", response_model=SocraticTutorResponse)
async def chat_socratic(request: ChatRequest):
    try:
        response = solve_doubt(query=request.query, chat_history=request.chat_history)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
