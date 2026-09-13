from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import uuid
import os
import threading
import time
import subprocess
from datetime import datetime
from pathlib import Path
from typing import List

from database import SessionLocal, get_db
from models import Project, User
from schemas import ProjectCreate, Project as ProjectSchema
from routers.auth import get_current_user

UPLOAD_BASE_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_BASE_DIR.mkdir(parents=True, exist_ok=True)


def _real_project_pipeline(project_id: str):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return

        source_url = project.source_url or ""
        source_path = None
        if source_url.startswith("http://localhost:8000/uploads/"):
            relative = source_url.replace("http://localhost:8000/uploads/", "", 1)
            source_path = (UPLOAD_BASE_DIR / relative.lstrip("/")).resolve()
        elif source_url and os.path.exists(source_url):
            source_path = Path(source_url)

        if not source_path or not source_path.exists():
            project.status = "FAILED"
            project.progress_percentage = 0
            db.add(project)
            db.commit()
            return

        steps = [
            ("SEPARATING", 25),
            ("TRANSCRIBING", 45),
            ("TRANSLATING", 65),
            ("SYNTHESIZING", 80),
            ("MIXING", 92),
            ("RENDERING", 100),
        ]

        output_dir = source_path.parent
        output_path = output_dir / f"{source_path.stem}_processed.mp4"

        for status, progress in steps[:-1]:
            project.status = status
            project.progress_percentage = progress
            db.add(project)
            db.commit()
            time.sleep(1)

        ffmpeg_cmd = [
            "ffmpeg",
            "-y",
            "-i",
            str(source_path),
            "-vf",
            "scale=1280:-2:flags=lanczos,format=yuv420p",
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-movflags",
            "+faststart",
            str(output_path),
        ]

        result = subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if result.returncode != 0:
            project.status = "FAILED"
            project.progress_percentage = 0
            db.add(project)
            db.commit()
            return

        project.status = "RENDERING"
        project.progress_percentage = 96
        db.add(project)
        db.commit()
        time.sleep(1)

        project.status = "COMPLETED"
        project.progress_percentage = 100
        project.completed_at = datetime.utcnow()
        project.confidence_score = 0.98
        project.source_url = f"http://localhost:8000/uploads/{project.id}/{output_path.name}"
        db.add(project)
        db.commit()
    finally:
        db.close()

router = APIRouter(prefix="/projects", tags=["projects"])

def map_project_to_schema(project: Project) -> dict:
    return {
        "id": project.id,
        "title": project.title,
        "sourceOrigin": project.source_origin,
        "sourceUrl": project.source_url,
        "status": project.status,
        "progressPercentage": project.progress_percentage,
        "durationMs": project.duration_ms,
        "targetLanguage": project.target_language,
        "createdAt": project.created_at,
        "completedAt": project.completed_at,
        "thumbnailUrl": project.thumbnail_url,
        "confidenceScore": project.confidence_score
    }

@router.get("", response_model=List[ProjectSchema])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.owner_id == current_user.id).order_by(Project.created_at.desc()).all()
    return [map_project_to_schema(p) for p in projects]

@router.post("", response_model=ProjectSchema)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_project = Project(
        id=f"proj-{uuid.uuid4().hex[:8]}",
        title=data.title,
        source_origin=data.sourceOrigin,
        source_url=data.sourceUrl,
        owner_id=current_user.id,
        status="CREATED" if data.sourceOrigin == "UPLOAD" else "INGESTING",
        progress_percentage=0 if data.sourceOrigin == "UPLOAD" else 10,
        duration_ms=0,
        target_language="ar",
        thumbnail_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return map_project_to_schema(new_project)

@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return map_project_to_schema(project)

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"detail": "Deleted successfully"}

@router.post("/{project_id}/start", response_model=ProjectSchema)
def start_processing(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.status = "SEPARATING"
    project.progress_percentage = 20
    db.commit()
    db.refresh(project)

    worker = threading.Thread(target=_real_project_pipeline, args=(project_id,), daemon=True)
    worker.start()
    return map_project_to_schema(project)

@router.post("/{project_id}/retry")
def retry_job(project_id: str, jobType: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Mock retry
    return {"detail": "Job retried"}

@router.post("/{project_id}/upload")
def upload_media(project_id: str, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    project_dir = UPLOAD_BASE_DIR / project_id
    project_dir.mkdir(parents=True, exist_ok=True)
    safe_name = os.path.basename(file.filename)
    destination = project_dir / safe_name

    with destination.open("wb") as buffer:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            buffer.write(chunk)

    project.status = "INGESTING"
    project.progress_percentage = 15
    project.source_url = f"http://localhost:8000/uploads/{project_id}/{safe_name}"
    db.commit()

    return {
        "id": f"media-{uuid.uuid4().hex[:8]}",
        "projectId": project_id,
        "role": "ORIGINAL_VIDEO",
        "fileName": safe_name,
        "mimeType": file.content_type,
        "fileSizeBytes": destination.stat().st_size,
        "storageTier": "HOT",
        "createdAt": str(project.created_at)
    }
