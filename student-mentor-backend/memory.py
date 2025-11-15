from typing import Dict

from google.adk.memory import InMemorySessionService, MemoryBank

session_service = InMemorySessionService(id_field="student_id")
memory_bank = MemoryBank(name="student_long_term")


def summarize_checkin(data: Dict[str, str]) -> str:
    feeling = data.get("mood") or data.get("feeling") or "unknown"
    win = data.get("win") or data.get("achievements") or "none"
    blocker = data.get("blocker") or data.get("challenges") or "none"

    wins_text = win if isinstance(win, str) else ", ".join(win)
    blocker_text = blocker if isinstance(blocker, str) else ", ".join(blocker)

    return f"Mood: {feeling} | Win: {wins_text} | Blocker: {blocker_text}"
