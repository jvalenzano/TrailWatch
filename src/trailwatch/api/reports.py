from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from src.trailwatch.models import ReportIn, ReportOut
from src.trailwatch.models_sqlalchemy import HazardReport
from src.trailwatch.database import get_db
from uuid import uuid4

router = APIRouter()

@router.post("/reports", response_model=ReportOut, status_code=status.HTTP_201_CREATED)

def create_report(report: ReportIn, db: Session = Depends(get_db)):
    db_report = HazardReport(
        original_submission=report.model_dump(),
        tracs_category=report.hazard_type, # Placeholder
        tracs_category_name=report.hazard_type.capitalize(), # Placeholder
        severity="SEV_UNKNOWN", # Placeholder
        severity_name="Unknown", # Placeholder
        confidence_score=0, # Placeholder
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return ReportOut(
        report_id=db_report.id,
        status="received",
        trail_matched=False, # Placeholder
        trail_name=None, # Placeholder
        estimated_processing_time="under 5 minutes"
    )
