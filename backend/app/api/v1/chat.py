from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.agents.tutor_agent import get_socratic_response

router = APIRouter()

class Citation(BaseModel):
    source: str
    chapter: str
    page: int
    snippet: str

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    thought_process: str
    socratic_response: str
    citations: List[Citation]
    wellbeing_sentiment: str
    suggested_follow_up: str

@router.post("/socratic", response_model=ChatResponse)
async def chat_socratic(request: ChatRequest):
    # This would normally query the tutor agent
    response = get_socratic_response(request.message, request.session_id)
    return response
