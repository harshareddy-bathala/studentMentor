from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, ConfigDict

from agents import onboarding_agent, team
from auth import FirebaseUser, verify_firebase_token
from memory import session_service
from db import collection_ref, student_profile_doc

app = FastAPI(title="Student Mentor AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatPayload(BaseModel):
    student_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)


class OnboardingChatPayload(BaseModel):
    message: str = Field(..., min_length=1)


class ProfileUpdatePayload(BaseModel):
    """Flexible payload for partial student profile updates."""

    model_config = ConfigDict(extra="allow")

    name: str | None = None
    date_of_birth: str | None = Field(default=None, alias="dateOfBirth")


class CheckInPayload(BaseModel):
    """Minimal required fields for daily check-ins; accepts extra telemetry."""

    model_config = ConfigDict(extra="allow")

    mood: str = Field(..., min_length=1)
    win: str | None = None
    blocker: str | None = None


class GoalUpdatePayload(BaseModel):
    goals: Any


def _ensure_student(user: FirebaseUser) -> None:
    if user.role != "student":
        raise HTTPException(status_code=403, detail="Only students may access this endpoint")


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.get("/health")
async def health(_: FirebaseUser = Depends(verify_firebase_token)) -> dict[str, str]:
    return {"status": "ok"}


async def stream_agent_reply(student_id: str, message: str) -> AsyncGenerator[bytes, None]:
    session = session_service.get_session(student_id)
    try:
        async for chunk in team.stream(message, session=session):
            text = getattr(chunk, "text", None) or str(chunk)
            payload = f"data: {text}\n\n".encode("utf-8")
            yield payload
        yield b"data: [DONE]\n\n"
    except Exception as exc:  # pragma: no cover - surfaced to client instead
        raise HTTPException(status_code=500, detail=str(exc)) from exc


async def stream_onboarding_reply(student_id: str, message: str) -> AsyncGenerator[bytes, None]:
    session = session_service.get_session(f"onboarding:{student_id}")
    try:
        async for chunk in onboarding_agent.stream(message, session=session):
            text = getattr(chunk, "text", None) or str(chunk)
            payload = f"data: {text}\n\n".encode("utf-8")
            yield payload
        yield b"data: [DONE]\n\n"
    except Exception as exc:  # pragma: no cover - surfaced to client instead
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/chat")
async def chat(payload: ChatPayload, user: FirebaseUser = Depends(verify_firebase_token)) -> StreamingResponse:
    if user.role == "student" and payload.student_id != user.uid:
        raise HTTPException(status_code=403, detail="Students may only chat as themselves")

    generator = stream_agent_reply(payload.student_id, payload.message)
    return StreamingResponse(generator, media_type="text/event-stream")


@app.post("/onboarding/chat")
async def onboarding_chat(payload: OnboardingChatPayload, user: FirebaseUser = Depends(verify_firebase_token)) -> StreamingResponse:
    if user.role != "student":
        raise HTTPException(status_code=403, detail="Only students may access onboarding chat")

    generator = stream_onboarding_reply(user.uid, payload.message)
    return StreamingResponse(generator, media_type="text/event-stream")


@app.post("/profile/update")
async def update_profile(payload: ProfileUpdatePayload, user: FirebaseUser = Depends(verify_firebase_token)) -> Dict[str, Any]:
    _ensure_student(user)

    updates = payload.model_dump(exclude_none=True, by_alias=True)
    updates.pop("date_of_birth", None)  # prefer camelCase for Firestore consistency
    if "dateOfBirth" not in updates and payload.date_of_birth:
        updates["dateOfBirth"] = payload.date_of_birth

    if not updates:
        raise HTTPException(status_code=400, detail="No profile fields provided")

    doc = student_profile_doc(user.uid)
    merged_payload = {"id": user.uid, **updates, "updatedAt": _utc_now()}
    doc.set(merged_payload, merge=True)
    snapshot = doc.get()
    data = snapshot.to_dict() or merged_payload
    data.setdefault("id", user.uid)
    return data


@app.post("/checkin")
async def create_checkin(payload: CheckInPayload, user: FirebaseUser = Depends(verify_firebase_token)) -> Dict[str, Any]:
    _ensure_student(user)

    data = payload.model_dump(exclude_none=True)
    doc_ref = collection_ref("checkins").document()
    record = {
        "id": doc_ref.id,
        "studentId": user.uid,
        "createdAt": _utc_now(),
        **data,
    }
    doc_ref.set(record)
    return record


@app.get("/goals")
async def get_goals(user: FirebaseUser = Depends(verify_firebase_token)) -> Dict[str, Any]:
    _ensure_student(user)

    snapshot = student_profile_doc(user.uid).get()
    if not snapshot.exists:
        return {"goals": None}
    data = snapshot.to_dict() or {}
    return {"goals": data.get("goals")}


@app.post("/goal")
async def update_goals(payload: GoalUpdatePayload, user: FirebaseUser = Depends(verify_firebase_token)) -> Dict[str, Any]:
    _ensure_student(user)

    doc = student_profile_doc(user.uid)
    doc.set({"id": user.uid, "goals": payload.goals, "updatedAt": _utc_now()}, merge=True)
    return {"goals": payload.goals}


@app.get("/homework")
async def list_homework(user: FirebaseUser = Depends(verify_firebase_token)) -> Dict[str, List[Dict[str, Any]]]:
    _ensure_student(user)

    submissions_ref = collection_ref("studentSubmissions")
    query = submissions_ref.where("studentId", "==", user.uid)
    homework_items: List[Dict[str, Any]] = []
    for doc in query.stream():
        item = doc.to_dict() or {}
        item.setdefault("id", doc.id)
        homework_items.append(item)
    return {"homework": homework_items}
