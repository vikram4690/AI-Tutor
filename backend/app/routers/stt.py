from fastapi import APIRouter, UploadFile, File, HTTPException, Request   # 👈 added Request
from slowapi.util import get_remote_address
from slowapi import Limiter
from faster_whisper import WhisperModel
import tempfile, os

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

_MODEL = None

def _get_model():
    global _MODEL
    if _MODEL is None:
        model_name = os.getenv("WHISPER_MODEL", "tiny")
        compute_type = os.getenv("WHISPER_COMPUTE", "int8")
        _MODEL = WhisperModel(model_name, compute_type=compute_type)
    return _MODEL

@router.post("/stt")
@limiter.limit("10/minute")
async def stt(request: Request, file: UploadFile = File(...)):   # 👈 added request param
    if not file.filename.lower().endswith((".wav", ".mp3", ".m4a", ".webm", ".ogg")):
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    model = _get_model()
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        data = await file.read()
        tmp.write(data)
        path = tmp.name

    try:
        segments, info = model.transcribe(path, beam_size=1)
        text = "".join([seg.text for seg in segments]).strip()
        return {"text": text, "duration": info.duration}
    finally:
        os.unlink(path)
