from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: Optional[str] = "المستخدم"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    locale: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    token: str
    user: User

class ProjectBase(BaseModel):
    title: str
    sourceOrigin: str
    sourceUrl: Optional[str] = None
    legalConsented: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class Project(BaseModel):
    id: str
    title: str
    sourceOrigin: str
    sourceUrl: Optional[str]
    status: str
    progressPercentage: int
    durationMs: int
    targetLanguage: str
    createdAt: datetime
    completedAt: Optional[datetime] = None
    thumbnailUrl: Optional[str] = None
    confidenceScore: Optional[float] = None
    
    class Config:
        from_attributes = True
        alias_generator = lambda string: string # Mapping snake_case DB to camelCase is needed, but we'll do manual mapping in routers for simplicity, or just let Pydantic handle it using aliases if needed. We will use simple property matching here and transform in router.

class TimelineBlockBase(BaseModel):
    sequenceOrder: int
    sourceText: str
    translatedText: str
    startTimeMs: int
    endTimeMs: int
    speakerLabel: Optional[str] = None
    confidence: float
    status: str
    timingDeltaPct: float
    flagReason: Optional[str] = None

class TimelineBlock(TimelineBlockBase):
    id: str
    timelineId: str

    class Config:
        from_attributes = True

class TimelineBlockUpdate(BaseModel):
    translatedText: Optional[str] = None
    startTimeMs: Optional[int] = None
    endTimeMs: Optional[int] = None
    status: Optional[str] = None

class MergeBlocksRequest(BaseModel):
    blockIds: List[str]
