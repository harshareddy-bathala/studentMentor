import os
from functools import lru_cache
from typing import Any, Dict

from google.cloud import firestore

FIRESTORE_PROJECT_ID = os.getenv("FIRESTORE_PROJECT_ID")

COLLECTIONS: Dict[str, str] = {
    "students": "students",
    "homework": "homework",
    "tests": "tests",
    "goals": "goals",
    "checkins": "daily_checkins",
}


@lru_cache
def get_firestore_client() -> firestore.Client:
    """Return a cached Firestore client, raising if env misconfigured."""
    if not FIRESTORE_PROJECT_ID:
        raise RuntimeError("FIRESTORE_PROJECT_ID env var is required for Firestore access")
    return firestore.Client(project=FIRESTORE_PROJECT_ID)


def student_doc(student_id: str) -> firestore.DocumentReference:
    return get_firestore_client().collection(COLLECTIONS["students"]).document(student_id)


def collection_ref(key: str) -> firestore.CollectionReference[Any]:
    return get_firestore_client().collection(COLLECTIONS[key])
