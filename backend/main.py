from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security import OAuth2

from backend.auth import auth_router, get_current_user
from backend.email_utils import email_router
from backend.scheduler import start_scheduler  # ✅ Scheduler

# Custom OAuth2 class
class OAuth2PasswordBearerWithCookie(OAuth2):
    def __init__(self, tokenUrl: str):
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl})
        super().__init__(flows=flows)

# ✅ Instantiate app FIRST
app = FastAPI(
    title="Custom Email Generator",
    description="An AI-powered email sending and tracking application.",
    version="1.0.0"
)

# ✅ Then add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Then include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(email_router, prefix="/emails", tags=["Emails"])

# ✅ Health check
@app.get("/")
def root():
    return {"message": "Custom Email Generator Backend Running"}

# ✅ Token check
@app.get("/auth/test-token")
async def test_token(user=Depends(get_current_user)):
    return {"username": user["username"]}

# ✅ Launch scheduler
@app.on_event("startup")
async def on_startup():
    start_scheduler()

# ✅ Helper for MongoDB ObjectId
def serialize_email(email):
    email["_id"] = str(email["_id"])
    return email
