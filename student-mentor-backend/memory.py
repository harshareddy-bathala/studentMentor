from typing import Dict

from google.adk.memory import InMemorySessionService, MemoryBank

session_service = InMemorySessionService(id_field="student_id")
memory_bank = MemoryBank(name="student_long_term")


def summarize_checkin(data: Dict[str, str]) -> str:
    return (
        f"Mood: {data['mood']} | Sleep: {data['sleep_hours']}h | "
        f"Wins: {data['achievements']}"
    )
