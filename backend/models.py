# backend/models.py
from datetime import datetime
from pydantic import BaseModel, EmailStr


# --------------------------------------------------------------------------- #
#  Authentication models
# --------------------------------------------------------------------------- #

class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


# --------------------------------------------------------------------------- #
#  Email models
# --------------------------------------------------------------------------- #

class EmailCreate(BaseModel):
    """
    Data the client must send.
    All fields are required.  If you want immediate sending, pass "send_time": null.
    """
    company_name: str
    contact_name: str
    email_address: EmailStr
    subject: str
    content: str
    send_time: datetime | None = None      # required key, value may be null


class EmailRecord(EmailCreate):
    """
    Internal model stored in MongoDB.
    """
    status: str = "Pending"
    delivery_status: str = "N/A"
    opened: bool = False
    timestamp: datetime = datetime.utcnow()
