from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List

from database import get_db
from models import TimelineBlock, Project
from schemas import TimelineBlock as TimelineBlockSchema, TimelineBlockUpdate, MergeBlocksRequest

router = APIRouter(prefix="/timeline", tags=["timeline"])
projects_timeline_router = APIRouter(prefix="/projects", tags=["timeline"])

def map_block_to_schema(block: TimelineBlock) -> dict:
    return {
        "id": block.id,
        "timelineId": block.project_id,
        "sequenceOrder": block.sequence_order,
        "sourceText": block.source_text,
        "translatedText": block.translated_text,
        "startTimeMs": block.start_time_ms,
        "endTimeMs": block.end_time_ms,
        "speakerLabel": block.speaker_label,
        "confidence": block.confidence,
        "status": block.status,
        "timingDeltaPct": block.timing_delta_pct,
        "flagReason": block.flag_reason
    }

@projects_timeline_router.get("/{project_id}/timeline", response_model=List[TimelineBlockSchema])
def get_timeline(project_id: str, db: Session = Depends(get_db)):
    blocks = db.query(TimelineBlock).filter(TimelineBlock.project_id == project_id).order_by(TimelineBlock.sequence_order).all()
    # If empty, let's create some dummy data for the studio demo if the project exists
    if not blocks:
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            dummy_blocks = [
                TimelineBlock(id=f"tb-{uuid.uuid4().hex[:8]}", project_id=project_id, sequence_order=1, source_text="Hello, welcome to DoLag.", translated_text="مرحباً، أهلاً بك في منصة DoLag.", start_time_ms=0, end_time_ms=2500, speaker_label="Speaker 1", confidence=0.98, status="AUTO"),
                TimelineBlock(id=f"tb-{uuid.uuid4().hex[:8]}", project_id=project_id, sequence_order=2, source_text="This is a real-time AI demo.", translated_text="هذا عرض توضيحي للذكاء الاصطناعي في الوقت الفعلي.", start_time_ms=2600, end_time_ms=6000, speaker_label="Speaker 1", confidence=0.95, status="AUTO")
            ]
            db.add_all(dummy_blocks)
            db.commit()
            blocks = db.query(TimelineBlock).filter(TimelineBlock.project_id == project_id).order_by(TimelineBlock.sequence_order).all()
    return [map_block_to_schema(b) for b in blocks]

@projects_timeline_router.post("/{project_id}/timeline/approve")
def approve_timeline(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.status = "SYNTHESIZING"
    db.commit()
    return {"detail": "Timeline approved"}

@router.patch("/blocks/{block_id}", response_model=TimelineBlockSchema)
def update_block(block_id: str, data: TimelineBlockUpdate, db: Session = Depends(get_db)):
    block = db.query(TimelineBlock).filter(TimelineBlock.id == block_id).first()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
    
    if data.translatedText is not None:
        block.translated_text = data.translatedText
    if data.startTimeMs is not None:
        block.start_time_ms = data.startTimeMs
    if data.endTimeMs is not None:
        block.end_time_ms = data.endTimeMs
    if data.status is not None:
        block.status = data.status
        
    db.commit()
    db.refresh(block)
    return map_block_to_schema(block)

@router.post("/blocks/{block_id}/split")
def split_block(block_id: str, splitAtMs: int, db: Session = Depends(get_db)):
    # Mock split logic
    raise HTTPException(status_code=501, detail="Split not fully implemented yet")

@router.post("/blocks/merge", response_model=TimelineBlockSchema)
def merge_blocks(data: MergeBlocksRequest, db: Session = Depends(get_db)):
    if len(data.blockIds) < 2:
        raise HTTPException(status_code=400, detail="At least two blocks are required to merge")

    blocks = db.query(TimelineBlock).filter(TimelineBlock.id.in_(data.blockIds)).order_by(TimelineBlock.sequence_order).all()
    if len(blocks) != len(set(data.blockIds)):
        raise HTTPException(status_code=404, detail="One or more timeline blocks were not found")

    if len(blocks) != len(data.blockIds):
        raise HTTPException(status_code=400, detail="Duplicate block IDs are not allowed")

    project_id = blocks[0].project_id
    if any(block.project_id != project_id for block in blocks):
        raise HTTPException(status_code=400, detail="All selected blocks must belong to the same project")

    ordered_blocks = sorted(blocks, key=lambda block: block.sequence_order)
    first_block = ordered_blocks[0]
    last_block = ordered_blocks[-1]

    merged_text = " ".join(
        (block.source_text or '').strip() for block in ordered_blocks if (block.source_text or '').strip()
    )
    merged_translation = " ".join(
        (block.translated_text or '').strip() for block in ordered_blocks if (block.translated_text or '').strip()
    )

    merged_block = TimelineBlock(
        id=f"tb-{uuid.uuid4().hex[:8]}",
        project_id=project_id,
        sequence_order=first_block.sequence_order,
        source_text=merged_text,
        translated_text=merged_translation,
        start_time_ms=first_block.start_time_ms,
        end_time_ms=last_block.end_time_ms,
        speaker_label=first_block.speaker_label or last_block.speaker_label,
        confidence=round(sum(block.confidence for block in ordered_blocks) / len(ordered_blocks), 4),
        status="EDITED" if any(block.status == "EDITED" for block in ordered_blocks) else "AUTO",
        timing_delta_pct=round(sum(block.timing_delta_pct for block in ordered_blocks) / len(ordered_blocks), 4),
        flag_reason=None,
    )

    for block in ordered_blocks:
        db.delete(block)

    db.add(merged_block)

    remaining_blocks = db.query(TimelineBlock).filter(TimelineBlock.project_id == project_id).order_by(TimelineBlock.sequence_order).all()
    for index, block in enumerate(remaining_blocks, start=1):
        block.sequence_order = index

    db.commit()
    db.refresh(merged_block)
    return map_block_to_schema(merged_block)
