from collections import defaultdict
from typing import List, Tuple

class MemoryStore:
    def __init__(self):
        self._store = defaultdict(list)

    def append(self, session_id: str, user: str, bot: str):
        self._store[session_id].append((user, bot))

    def history(self, session_id: str) -> list[tuple[str, str]]:
        return self._store.get(session_id, [])

MEMORY = MemoryStore()
