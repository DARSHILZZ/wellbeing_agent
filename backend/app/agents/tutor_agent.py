import json
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.rag.retriever import retrieve_grounded_context
from app.core.config import settings

class Citation(BaseModel):
    source: str = Field(description="Title of the textbook or source")
    chapter: str = Field(description="Chapter name or number")
    page: int = Field(description="Page number of the citation")
    snippet: str = Field(description="Exact snippet from the text used to ground the answer")

class SocraticTutorResponse(BaseModel):
    thought_process: str = Field(description="Internal reasoning for pedagogy. Not shown to student.")
    socratic_response: str = Field(description="The actual response shown to the student. Must use Socratic questioning.")
    citations: List[Citation] = Field(description="Citations for any factual claims made.")
    wellbeing_sentiment: str = Field(description="Detected student sentiment: 'neutral', 'frustrated', 'curious', or 'overwhelmed'")
    suggested_follow_up: str = Field(description="A suggested follow-up topic or question for the UI.")

class IntentRoute(BaseModel):
    is_educational: bool = Field(description="True if the query is educational or related to science/physics. False if off-topic.")
    rejection_reason: str = Field(description="Reason for rejection if off-topic, otherwise empty.")

SYSTEM_PROMPT = """You are an expert Socratic tutor specializing in physics and science.
Your goal is to guide the student to the answer using progressive inquiry and scaffolding.
DO NOT give the direct answer to homework or conceptual questions.
Instead, ask leading questions to help the student realize the answer themselves.

CRITICAL RULES:
1. GROUNDING: You MUST base your knowledge EXCLUSIVELY on the provided textbook context.
2. PEDAGOGY: Use Socratic questioning. Ask one question at a time.
3. CITATION: If you state a fact or rule, you MUST cite the exact page/chapter from the context.
4. SENTIMENT: Analyze the user's message to detect their cognitive load or frustration.

Textbook Context:
{context}
"""

def check_intent(query: str) -> IntentRoute:
    llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.0, api_key=settings.GEMINI_API_KEY)
    structured_llm = llm.with_structured_output(IntentRoute)
    
    prompt = f"Analyze the student's query and determine if it is related to physics, science, or educational wellbeing.\nQuery: {query}"
    
    return structured_llm.invoke(prompt)

def solve_doubt(query: str, chat_history: Optional[List[dict]] = None) -> SocraticTutorResponse:
    # 0. Intent Routing Guardrail
    intent = check_intent(query)
    if not intent.is_educational:
        return SocraticTutorResponse(
            thought_process="User asked an off-topic question.",
            socratic_response=f"I am a physics and science tutor. I cannot help with that. {intent.rejection_reason}",
            citations=[],
            wellbeing_sentiment="neutral",
            suggested_follow_up="What topic in physics would you like to explore?"
        )

    # 1. Retrieve Context
    raw_contexts = retrieve_grounded_context(query)
    context_str = "\n\n".join(
        f"Source: {c['source']} (Ch: {c['chapter']}, Pg: {c['page']})\n{c['content']}" 
        for c in raw_contexts
    )
    
    if not context_str.strip():
        context_str = "No specific textbook context found. Rely on general Socratic principles, but admit if you lack the textbook text."

    # 2. Prepare LLM
    llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.2, api_key=settings.GEMINI_API_KEY)
    structured_llm = llm.with_structured_output(SocraticTutorResponse)
    
    # 3. Prepare Messages
    messages = [SystemMessage(content=SYSTEM_PROMPT.format(context=context_str))]
    
    if chat_history:
        for msg in chat_history:
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg.get("content", "")))
            elif msg.get("role") == "ai":
                messages.append(AIMessage(content=msg.get("content", "")))
                
    messages.append(HumanMessage(content=query))
    
    # 4. Invoke LLM
    response = structured_llm.invoke(messages)
    
    return response

# Keep the old function signature for compatibility or wrap it
def get_socratic_response(message: str, session_id: str) -> Dict[str, Any]:
    # For now, just call solve_doubt without history to satisfy the old signature
    res = solve_doubt(message)
    return res.model_dump()

