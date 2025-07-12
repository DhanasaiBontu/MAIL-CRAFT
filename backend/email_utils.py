# backend/email_utils.py
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from backend.models import EmailCreate, EmailRecord
from backend.config import db
from backend.scheduler import schedule_email
from backend.email_sender import send_email_via_smtp
from backend.ai_generator import generate_email
from backend.utils import stringify_id        # ← NEW

email_router = APIRouter()


@email_router.post("/send", summary="Send Email")
async def send_email(email_in: EmailCreate):
    """
    • Validates client data (all fields required).
    • If send_time is in the future  ➜ schedule and store as *Pending*.
    • Else                             ➜ send immediately and store as *Sent*.
    """
    try:
        email = EmailRecord(**email_in.dict())
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

    # ------------------------------------------------------------------ #
    # 1) Future-dated ➜ schedule + store Pending
    # ------------------------------------------------------------------ #
    if email.send_time and email.send_time > datetime.now(timezone.utc):
        result = await db.emails.insert_one(email.dict())
        schedule_email({**email.dict(), "_id": result.inserted_id}, email.send_time)
        return {
            "message": "Email scheduled",
            "id": str(result.inserted_id),
            "send_time": email.send_time,
            "status": "Pending",
        }

    # ------------------------------------------------------------------ #
    # 2) Immediate send
    # ------------------------------------------------------------------ #
    try:
        send_email_via_smtp(email.email_address, email.subject, email.content)
        email.status = "Sent"
        email.delivery_status = "Delivered"
    except Exception as e:
        email.status = "Failed"
        email.delivery_status = str(e)

    result = await db.emails.insert_one(email.dict())
    return {
        "message": "Email processed",
        "id": str(result.inserted_id),
        "status": email.status,
    }


@email_router.get("/sent", summary="List Sent & Scheduled Emails")
async def get_sent_emails():
    emails = await db.emails.find().to_list(length=100)
    # convert Mongo ObjectId ➜ string for every document
    return [stringify_id(doc) for doc in emails]


@email_router.post("/ai-generate", summary="Generate draft with AI")
async def ai_generate(subject: str, recipient_name: str, context: str):
    try:
        return generate_email(subject, recipient_name, context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
