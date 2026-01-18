from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from src.trailwatch.models import ReportIn, ReportOut
from src.trailwatch.models_sqlalchemy import HazardReport
from src.trailwatch.database import get_db
from src.trailwatch.validators import validate_coordinates
from uuid import uuid4
from datetime import datetime

# Import TRACS mapping and confidence scoring logic
from src.trailwatch.tracs_mapping import get_tracs_category
from src.trailwatch.confidence_scoring import calculate_confidence_score
import re

router = APIRouter()

@router.post("/reports", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def create_report(report: ReportIn, db: Session = Depends(get_db)):
    # Phase 3: GPS Boundary Validation
    try:
        validate_coordinates(report.location.latitude, report.location.longitude)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # TRACS Category Extraction
    tracs_code, tracs_name = get_tracs_category(report.description)

    # Confidence Scoring - using temporary assumptions for now
    has_photo = bool(report.photos)
    photo_matches_hazard = False # Placeholder for Project 3
    gps_accurate = False # Placeholder for Intake Agent GPS validation
    description_specific = len(report.description) > 20 # Simple heuristic
    reporter_trusted = report.reporter.type in ["volunteer", "coordinator"]
    corroborating_reports = 0 # Placeholder for Triage Engine
    weather_context = False # Placeholder for Triage Engine

    confidence_score = calculate_confidence_score(
        has_photo=has_photo,
        photo_matches_hazard=photo_matches_hazard,
        gps_accurate=gps_accurate,
        description_specific=description_specific,
        reporter_trusted=reporter_trusted,
        corroborating_reports=corroborating_reports,
        weather_context=weather_context
    )

    db_report = HazardReport(
        id=uuid4(),
        original_submission=report.model_dump(),
        tracs_category=tracs_code,
        tracs_category_name=tracs_name,
        severity="SEV_UNKNOWN", # Placeholder
        severity_name="Unknown", # Placeholder
        confidence_score=confidence_score,
        confidence_factors=None, # Placeholder - could be stored later if needed
        recommended_action=None,
        assigned_to=None,
        ranger_district=None,
        submitted_at=datetime.utcnow(),
        triaged_at=None,
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
