import re

REDACTION_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"(?i)secret[_-]?key\s*=\s*[^\s]+"),
]

def redact(text: str) -> str:
    if not text:
        return text
    cleaned = text
    for pat in REDACTION_PATTERNS:
        cleaned = pat.sub("[REDACTED]", cleaned)
    return cleaned
