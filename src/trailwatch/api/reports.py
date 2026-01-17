from fastapi import APIRouter, status
from src.trailwatch.models import ReportIn, ReportOut
from uuid import uuid4

router = APIRouter()

@router.post("/reports", response_model=ReportOut, status_code=status.HTTP_201_CREATED)

def create_report(report: ReportIn):
    report_id = uuid4()
    # In a real application, we would do more here, like saving to a database.
    return ReportOut(
        report_id=report_id,
        status="received",
        trail_matched=False, # Placeholder
        trail_name=None, # Placeholder
        estimated_processing_time="under 5 minutes"
    )
