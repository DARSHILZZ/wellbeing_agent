import json
from cachetools import TTLCache
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Optional, Dict, Any
from app.agents.tutor_agent import solve_doubt, SocraticTutorResponse

router = APIRouter()

# In-memory cache: up to 1,000 queries cached with a 1-hour (3600s) TTL
query_cache = TTLCache(maxsize=1000, ttl=3600)

@router.websocket("/ws/socratic")
async def websocket_socratic(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive data from client
            data_str = await websocket.receive_text()
            try:
                data = json.loads(data_str)
                query = data.get("query", "")
                chat_history = data.get("chat_history", None)
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON format"})
                continue
                
            if not query:
                await websocket.send_json({"error": "Query is required"})
                continue
                
            # 1. Check TTLCache Cache
            cache_key = f"socratic_query:{query}"
            if cache_key in query_cache:
                # Return cached response instantly
                cached_response = query_cache[cache_key]
                await websocket.send_text(cached_response)
                continue
            
            # 2. Execute RAG Pipeline if not cached
            try:
                response: SocraticTutorResponse = solve_doubt(query=query, chat_history=chat_history)
                response_dict = response.model_dump()
                response_json = json.dumps(response_dict)
                
                # Cache the response
                query_cache[cache_key] = response_json
                        
                # Send back to client
                await websocket.send_text(response_json)
            except Exception as e:
                await websocket.send_json({"error": str(e)})
                
    except WebSocketDisconnect:
        print("Client disconnected")
