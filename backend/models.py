from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    locale = Column(String, default="ar")

    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    source_origin = Column(String)
    source_url = Column(String, nullable=True)
    status = Column(String, default="CREATED")
    progress_percentage = Column(Integer, default=0)
    duration_ms = Column(Integer, default=0)
    target_language = Column(String, default="ar")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    thumbnail_url = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    owner_id = Column(String, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects")
    timeline_blocks = relationship("TimelineBlock", back_populates="project")

class TimelineBlock(Base):
    __tablename__ = "timeline_blocks"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    sequence_order = Column(Integer)
    source_text = Column(String)
    translated_text = Column(String)
    start_time_ms = Column(Integer)
    end_time_ms = Column(Integer)
    speaker_label = Column(String, nullable=True)
    confidence = Column(Float)
    status = Column(String, default="AUTO")
    timing_delta_pct = Column(Float, default=0.0)
    flag_reason = Column(String, nullable=True)

    project = relationship("Project", back_populates="timeline_blocks")
