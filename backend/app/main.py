import os
from fastapi import FastAPI, Depends, Header, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from app.routers.chat import router as chat_router
from app.routers.stt import router as stt_router

load_dotenv()

API_KEY = os.getenv("API_KEY", "").strip()
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o.strip()]

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="RAG Tutor – Secure API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS", "GET"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "microphone=()"
    return response

@app.exception_handler(RateLimitExceeded)
def ratelimit_handler(request: Request, exc):
    return JSONResponse(status_code=429, content={"detail": "Too many requests, slow down."})

def require_api_key(authorization: str | None = Header(default=None)):
    if not API_KEY:
        return True
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Bearer token")
    token = authorization.split(" ", 1)[1]
    if token != API_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token")
    return True

@app.get("/health")
@limiter.limit("10/minute")
def health(request: Request):   # 👈 FIX: added request
    return {"ok": True}

app.include_router(chat_router, dependencies=[Depends(require_api_key)])
app.include_router(stt_router, dependencies=[Depends(require_api_key)])
