from __future__ import annotations

import json
from typing import Callable, Optional

from google.adk.tools import tool

from db import collection_ref
from memory import memory_bank, summarize_checkin

analytics_runner: Optional[Callable[[str, str], str]] = None


def register_analytics_runner(callback: Callable[[str, str], str]) -> None:
    global analytics_runner
    analytics_runner = callback


@tool
def get_homework(student_id: str) -> str:
    docs = collection_ref("homework").where("student_id", "==", student_id).stream()
    payload = [doc.to_dict() | {"id": doc.id} for doc in docs]
    return json.dumps(payload)


@tool
def add_homework(student_id: str, task_details: str) -> str:
    data = {"student_id": student_id, "details": task_details}
    doc_ref, _ = collection_ref("homework").add(data)
    return f"Homework task created with id {doc_ref.id}"


@tool
def get_goals(student_id: str) -> str:
    docs = collection_ref("goals").where("student_id", "==", student_id).stream()
    payload = [doc.to_dict() | {"id": doc.id} for doc in docs]
    return json.dumps(payload)


@tool
def add_daily_checkin(student_id: str, mood: str, sleep_hours: int, achievements: str) -> str:
    data = {
        "student_id": student_id,
        "mood": mood,
        "sleep_hours": sleep_hours,
        "achievements": achievements,
    }
    doc_ref, _ = collection_ref("checkins").add(data)
    memory_bank.add_memory(student_id, summarize_checkin(data))
    return f"Daily check-in stored with id {doc_ref.id}"


@tool
def generate_teacher_report(student_id: str) -> str:
    if analytics_runner is None:
        raise RuntimeError("Analytics runner has not been registered")
    prompt = "Summarize the student's performance, risks, and wins."
    return analytics_runner(student_id, prompt)
