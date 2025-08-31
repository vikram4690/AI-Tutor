# Backend
- Secure FastAPI with CORS allowlist, optional API key, simple rate limits.
- `/ingest` script builds FAISS index from PDFs/txt in `data/`.
- `/chat` and `/query` answer with `{text, emotion, sources}`.
- `/stt` optionally transcribes audio **locally** with faster-whisper (when you run the server on your machine).

## Quickstart
```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app/ingest.py           # add your docs to data/ first
./run.sh
```
