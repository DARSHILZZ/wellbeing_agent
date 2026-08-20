import os
from typing import List, Dict, Any
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db")

def get_vector_store() -> Chroma:
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    vector_store = Chroma(
        collection_name="textbook_content",
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )
    return vector_store

def retrieve_grounded_context(query: str, k: int = 3) -> List[Dict[str, Any]]:
    vector_store = get_vector_store()
    
    # Retrieve documents
    results = vector_store.similarity_search_with_score(query, k=k)
    
    context = []
    for doc, score in results:
        # Extract metadata, with fallbacks in case it's missing
        metadata = doc.metadata
        context.append({
            "content": doc.page_content,
            "source": metadata.get("source", "Unknown Source"),
            "chapter": metadata.get("chapter", "Unknown Chapter"),
            "page": metadata.get("page", 0),
            "relevance_score": score
        })
    
    return context
