import os
from typing import List

from google.adk import Agent, AgentTeam
from google.adk.models import GeminiModel

from memory import memory_bank, session_service
from tools import (
    add_daily_checkin,
    add_homework,
    generate_teacher_report,
    get_goals,
    get_homework,
    register_analytics_runner,
)

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY env var required for Gemini access")

model = GeminiModel(api_key=GEMINI_API_KEY, model_name=GEMINI_MODEL)

academic_agent = Agent(
    name="AcademicAgent",
    instructions=(
        "You are an academic assistant. You help students manage homework, track "
        "tests, and find study materials using your tools."
    ),
    tools=[get_homework, add_homework],
    model=model,
)

wellness_agent = Agent(
    name="WellnessAgent",
    instructions=(
        "You are a wellness coach. You process daily check-ins, track mood and "
        "sleep, and provide encouragement."
    ),
    tools=[add_daily_checkin],
    model=model,
    memory_bank=memory_bank,
)

goal_agent = Agent(
    name="GoalAgent",
    instructions=(
        "You are a career and goals coach. You help students set, update, and "
        "track their personal, academic, and career aspirations."
    ),
    tools=[get_goals],
    model=model,
)

analytics_agent = Agent(
    name="AnalyticsAgent",
    instructions=(
        "You are a silent data analyst. You review a student's full history to "
        "identify negative trends or summarize progress."
    ),
    model=model,
    memory_bank=memory_bank,
)

register_analytics_runner(lambda student_id, prompt: analytics_agent.run(
    prompt, session=session_service.get_session(student_id)
))

student_hub_agent = Agent(
    name="StudentHubAgent",
    instructions=(
        "You are a holistic student mentor. Your job is to understand the student's request "
        "and route it to the correct specialist for academics, wellness, goals, or analytics."
    ),
    model=model,
    memory_bank=memory_bank,
    tools=[generate_teacher_report],
)

specialists: List[Agent] = [academic_agent, wellness_agent, goal_agent, analytics_agent]

team = AgentTeam(
    coordinator=student_hub_agent,
    specialists=specialists,
    session_service=session_service,
)
