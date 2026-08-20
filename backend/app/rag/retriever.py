import os
from typing import List, Dict, Any
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_classic.retrievers import EnsembleRetriever, ContextualCompressionRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_cohere import CohereRerank
from langchain_core.documents import Document

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db")

_bm25_retriever_cache = None

from app.core.config import settings

def get_vector_store() -> Chroma:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", 
        api_key=settings.GEMINI_API_KEY
    )
    vector_store = Chroma(
        collection_name="textbook_content",
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )
    return vector_store

def get_bm25_retriever(vector_store: Chroma) -> BM25Retriever:
    global _bm25_retriever_cache
    if _bm25_retriever_cache is None:
        db_data = vector_store.get()
        if not db_data or not db_data.get('documents'):
            # Fallback if empty
            _bm25_retriever_cache = BM25Retriever.from_texts([""])
            return _bm25_retriever_cache
            
        docs = []
        for txt, meta in zip(db_data['documents'], db_data['metadatas']):
            docs.append(Document(page_content=txt, metadata=meta))
        _bm25_retriever_cache = BM25Retriever.from_documents(docs)
    return _bm25_retriever_cache

def retrieve_grounded_context(query: str, k: int = 3) -> List[Dict[str, Any]]:
    vector_store = get_vector_store()
    chroma_retriever = vector_store.as_retriever(search_kwargs={"k": k * 2})
    
    bm25_retriever = get_bm25_retriever(vector_store)
    bm25_retriever.k = k * 2
    
    ensemble_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, chroma_retriever],
        weights=[0.4, 0.6]
    )
    
    cohere_rerank = CohereRerank(top_n=k)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=cohere_rerank,
        base_retriever=ensemble_retriever
    )
    
    compressed_docs = compression_retriever.invoke(query)
    
    context = []
    for doc in compressed_docs:
        metadata = doc.metadata
        context.append({
            "content": doc.page_content,
            "source": metadata.get("source", "Unknown Source"),
            "chapter": metadata.get("chapter", "Unknown Chapter"),
            "page": metadata.get("page", 0),
            "relevance_score": metadata.get("relevance_score", 0.0)
        })
    
    return context
