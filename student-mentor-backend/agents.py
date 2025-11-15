import os
from typing import List

from google.adk import Agent, AgentTeam
from google.adk.models import GeminiModel

from memory import memory_bank, session_service
from tools import (
    create_assignment,
    generate_teacher_report,
    get_assignments_for_student,
    get_student_profile,
    record_daily_checkin,
    register_analytics_runner,
    save_student_profile_data,
    update_student_goals,
)

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY env var required for Gemini access")

model = GeminiModel(api_key=GEMINI_API_KEY, model_name=GEMINI_MODEL)

academic_agent = Agent(
    name="AcademicAgent",
    instructions=(
        "You are an academic assistant. You help students manage assignments, track "
        "tests, and find study materials using your tools."
    ),
    tools=[get_assignments_for_student, create_assignment],
    model=model,
)

wellness_agent = Agent(
    name="WellnessAgent",
    instructions=(
        "You are a wellness coach. You process daily check-ins, track mood and "
        "sleep, and provide encouragement."
    ),
    tools=[record_daily_checkin],
    model=model,
    memory_bank=memory_bank,
)

goal_agent = Agent(
    name="GoalAgent",
    instructions=(
        "You are a career and goals coach. You help students set, update, and "
        "track their personal, academic, and career aspirations."
    ),
    tools=[get_student_profile, update_student_goals],
    model=model,
)

onboarding_agent = Agent(
    name="OnboardingAgent",
    instructions=(
        "You are a friendly and engaging school guide. Your job is to onboard new students. "
        "First, you must ask for their first name and class. After that, you will ask a series "
        "of questions to understand their goals, interests, and challenges. You must tailor "
        "your follow-up questions based on their previous answers to make it feel like a natural conversation."
    ),
    tools=[save_student_profile_data],
    model=model,
    memory_bank=memory_bank,
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
