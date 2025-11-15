# Student Mentor Backend

Python FastAPI service hosting the Google ADK multi-agent team and Firestore data access layer.

## Local Setup

```powershell
cd student-mentor-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file with:

```
GOOGLE_API_KEY=<gemini key>
GOOGLE_APPLICATION_CREDENTIALS=<absolute path to firestore service account json>
GEMINI_MODEL=gemini-1.5-flash
FIRESTORE_PROJECT_ID=<gcp project id>
```

## Run

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
