from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from agents import team
from memory import session_service

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


@app.get("/health")
async def health() -> dict[str, str]:
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


@app.post("/chat")
async def chat(payload: ChatPayload) -> StreamingResponse:
    generator = stream_agent_reply(payload.student_id, payload.message)
    return StreamingResponse(generator, media_type="text/event-stream")
