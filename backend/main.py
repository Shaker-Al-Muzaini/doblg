import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, SessionLocal
from models import User
from routers.auth import get_password_hash
from routers import auth, projects, timeline, ai
from pathlib import Path

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Seed default demo user if not present
db = SessionLocal()
try:
    if not db.query(User).filter(User.email == "demo@dolag.ai").first():
        demo_user = User(
            id="u-demo",
            email="demo@dolag.ai",
            name="مستخدم تجريبي",
            hashed_password=get_password_hash("123456"),
            locale="ar"
        )
        db.add(demo_user)
        db.commit()
finally:
    db.close()

app = FastAPI(
    title="DoLag AI Studio API",
    version="1.0.0",
    description="API for DoLag AI Video Translation & Dubbing platform"
)

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root API Router
api_v1_router = APIRouter(prefix="/api/v1")

# Include all module routers under /api/v1
api_v1_router.include_router(auth.router)
api_v1_router.include_router(projects.router)
api_v1_router.include_router(timeline.router)
api_v1_router.include_router(timeline.projects_timeline_router)
api_v1_router.include_router(ai.router)
api_v1_router.include_router(ai.projects_stream_router)

app.include_router(api_v1_router)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "DoLag Backend API"}
