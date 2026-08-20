import os
import json
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from app.core.config import settings

def generate_adaptive_practice(concept_gap: str, student_level: str = "intermediate"):
    groq_llm = ChatGroq(
        model_name="llama-3.3-70b-versatile",
        temperature=0.3,
        groq_api_key=settings.GROQ_API_KEY
    )
    
    prompt = PromptTemplate.from_template(
        """You are an expert tutor creating an adaptive quiz.
        The student is struggling with: {concept_gap} and is at a {student_level} level.
        
        Generate exactly 3 multiple choice questions that test this concept gap.
        Provide the output as a raw JSON array, where each element is an object with:
        - "id": integer
        - "text": string (the question)
        - "options": list of 4 strings
        - "correct_answer": string (must be one of the options)
        
        Do not output any markdown formatting, only raw JSON.
        """
    )
    
    chain = prompt | groq_llm
    response = chain.invoke({
        "concept_gap": concept_gap,
        "student_level": student_level
    })
    
    try:
        content = response.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
            
        questions = json.loads(content)
        return {
            "concept_gap": concept_gap,
            "questions": questions
        }
    except Exception as e:
        print(f"Error parsing Groq output: {e}, content: {response.content}")
        return {
            "concept_gap": concept_gap,
            "questions": [
                {
                    "id": 1,
                    "text": f"Fallback question for {concept_gap}?",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                    "correct_answer": "Option 1"
                }
            ]
        }
