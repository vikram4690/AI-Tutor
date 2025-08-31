from fastapi import APIRouter, HTTPException, Request   # <-- add Request
from slowapi.util import get_remote_address
from slowapi import Limiter

from app.models import QueryRequest, ChatRequest, QueryResponse, Source
from app.utils.memory import MEMORY
from app.utils.security import redact
from app.rag import load_index, answer_question

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

_VS = None
def _vs():
    global _VS
    if _VS is None:
        try:
            _VS = load_index()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load index. Run ingestion first. ({e})")
    return _VS

@router.post("/query", response_model=QueryResponse)
@limiter.limit("30/minute")
def query(request: Request, req: QueryRequest):    # <-- add request here
    vs = _vs()
    text, emotion, sources = answer_question(vs, req.question, k=req.top_k)
    return QueryResponse(text=redact(text), emotion=emotion, sources=[Source(**s) for s in sources])

@router.post("/chat", response_model=QueryResponse)
@limiter.limit("30/minute")
def chat(request: Request, req: ChatRequest):      # <-- add request here
    vs = _vs()
    hist = MEMORY.history(req.session_id)[-3:]
    stitched = "\n".join([f"User: {u}\nTutor: {b}" for u,b in hist])
    compound_q = f"{stitched}\n\nNew message from user: {req.message}"
    text, emotion, sources = answer_question(vs, compound_q, k=4)
    MEMORY.append(req.session_id, req.message, text)
    return QueryResponse(text=redact(text), emotion=emotion, sources=[Source(**s) for s in sources])
