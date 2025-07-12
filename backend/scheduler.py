# backend/scheduler.py
from datetime import datetime

from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from backend.config import db
from backend.email_sender import send_email_via_smtp

scheduler = AsyncIOScheduler(jobstores={"default": MemoryJobStore()})


def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        print("✅ Email scheduler started")


def schedule_email(email_data: dict, send_time: datetime):
    job_id = f"{email_data['email_address']}_{send_time.timestamp()}"
    scheduler.add_job(
        func=send_scheduled_email,
        trigger="date",
        run_date=send_time,
        args=[email_data],
        id=job_id,
        replace_existing=True,
        misfire_grace_time=60,
    )
    print(f"📅 Scheduled email to {email_data['email_address']} at {send_time}")


async def send_scheduled_email(email_data: dict):
    try:
        send_email_via_smtp(
            to_email=email_data["email_address"],
            subject=email_data["subject"],
            body=email_data["content"],
        )
        email_data.update(
            status="Sent",
            delivery_status="Delivered",
            timestamp=datetime.utcnow(),
        )
    except Exception as e:
        email_data.update(
            status="Failed",
            delivery_status=str(e),
            timestamp=datetime.utcnow(),
        )

    # overwrite the existing document instead of inserting a duplicate
    await db.emails.replace_one({"_id": email_data["_id"]}, email_data)
