from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    top_k: int = Field(4, ge=1, le=10)
    session_id: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: str = Field(..., min_length=1)

class Source(BaseModel):
    doc_id: str
    score: float
    metadata: Dict[str, Any] = {}

class QueryResponse(BaseModel):
    text: str
    emotion: str
    sources: List[Source]
