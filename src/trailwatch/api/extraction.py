"""Streaming extraction endpoint for real-time AI extraction events."""
import asyncio
import json
from typing import AsyncGenerator
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from src.trailwatch.database import get_db
from src.trailwatch.models_sqlalchemy import HazardReport
from src.trailwatch.tracs_mapping import get_tracs_category
from src.trailwatch.confidence_scoring import calculate_confidence_score

router = APIRouter()


def format_sse_event(event: str, data: dict) -> str:
    """Format data as Server-Sent Event."""
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def extract_severity_from_description(description: str) -> tuple[str, str]:
    """Extract severity level from description.

    Returns:
        Tuple of (severity_code, severity_name)
    """
    description_lower = description.lower()

    if any(word in description_lower for word in ["impassable", "danger", "emergency", "collapsed", "major"]):
        return "SEV_HIGH", "High"
    elif any(word in description_lower for word in ["moderate", "caution", "difficult", "partial"]):
        return "SEV_MEDIUM", "Medium"
    elif any(word in description_lower for word in ["minor", "small", "slight", "passable"]):
        return "SEV_LOW", "Low"
    else:
        return "SEV_UNKNOWN", "Unknown"


def generate_reasoning(
    description: str,
    tracs_code: str,
    tracs_name: str,
    severity_code: str,
    confidence: float,
) -> str:
    """Generate human-readable reasoning for the extraction."""
    reasons = []

    # TRACS category reasoning
    if tracs_code != "OTH":
        reasons.append(f"Identified hazard type as '{tracs_name}' based on keywords in description.")
    else:
        reasons.append("Could not confidently categorize hazard type from description.")

    # Severity reasoning
    if severity_code == "SEV_HIGH":
        reasons.append("Marked as high severity due to indicators of impassable or dangerous conditions.")
    elif severity_code == "SEV_MEDIUM":
        reasons.append("Classified as medium severity based on moderate impact indicators.")
    elif severity_code == "SEV_LOW":
        reasons.append("Assigned low severity as conditions appear manageable.")
    else:
        reasons.append("Severity could not be determined from available information.")

    # Confidence reasoning
    if confidence >= 0.7:
        reasons.append(f"High confidence ({confidence:.0%}) due to detailed description and supporting data.")
    elif confidence >= 0.4:
        reasons.append(f"Moderate confidence ({confidence:.0%}) - additional verification recommended.")
    else:
        reasons.append(f"Low confidence ({confidence:.0%}) - manual review strongly recommended.")

    return " ".join(reasons)


async def stream_extraction(
    report_id: UUID,
    db: Session,
) -> AsyncGenerator[str, None]:
    """Generate SSE events for extraction process.

    Events emitted:
    - extraction_start: Beginning of extraction
    - field_extracted: Each field as it's extracted (tracs_category, severity, confidence)
    - reasoning_chunk: Chunks of reasoning text
    - extraction_complete: End of extraction with full result
    """
    # Fetch the report
    report = db.query(HazardReport).filter(HazardReport.id == report_id).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report {report_id} not found",
        )

    original = report.original_submission or {}
    description = original.get("description", "")
    has_photo = bool(original.get("photos"))
    reporter = original.get("reporter", {})
    reporter_trusted = reporter.get("type") in ["volunteer", "coordinator"]

    # 1. Emit extraction_start
    yield format_sse_event("extraction_start", {
        "report_id": str(report_id),
        "status": "processing",
    })
    await asyncio.sleep(0.1)  # Simulate processing delay

    # 2. Extract and emit TRACS category
    tracs_code, tracs_name = get_tracs_category(description)
    yield format_sse_event("field_extracted", {
        "field": "tracs_category",
        "value": tracs_code,
        "display_value": tracs_name,
    })
    await asyncio.sleep(0.1)

    # 3. Extract and emit severity
    severity_code, severity_name = extract_severity_from_description(description)
    yield format_sse_event("field_extracted", {
        "field": "severity",
        "value": severity_code,
        "display_value": severity_name,
    })
    await asyncio.sleep(0.1)

    # 4. Calculate and emit confidence
    confidence = calculate_confidence_score(
        has_photo=has_photo,
        photo_matches_hazard=False,
        gps_accurate=True,
        description_specific=len(description) > 20,
        reporter_trusted=reporter_trusted,
        corroborating_reports=0,
        weather_context=False,
    )
    yield format_sse_event("field_extracted", {
        "field": "confidence",
        "value": confidence,
        "display_value": f"{confidence:.0%}",
    })
    await asyncio.sleep(0.1)

    # 5. Generate and stream reasoning in chunks
    reasoning = generate_reasoning(
        description, tracs_code, tracs_name, severity_code, confidence
    )

    # Stream reasoning in chunks for typewriter effect
    chunk_size = 50
    for i in range(0, len(reasoning), chunk_size):
        chunk = reasoning[i : i + chunk_size]
        yield format_sse_event("reasoning_chunk", {
            "text": chunk,
            "is_final": i + chunk_size >= len(reasoning),
        })
        await asyncio.sleep(0.05)  # Small delay for typewriter effect

    # 6. Emit extraction_complete
    yield format_sse_event("extraction_complete", {
        "report_id": str(report_id),
        "extraction": {
            "tracs_category": tracs_code,
            "tracs_category_name": tracs_name,
            "severity": severity_code,
            "severity_name": severity_name,
            "confidence": confidence,
            "reasoning": reasoning,
        },
    })


@router.post("/reports/{report_id}/extract/stream")
async def extract_report_stream(
    report_id: UUID,
    db: Session = Depends(get_db),
) -> StreamingResponse:
    """Stream extraction events for a report.

    Returns Server-Sent Events (SSE) stream with extraction progress.

    Events:
    - extraction_start: {report_id, status}
    - field_extracted: {field, value, display_value}
    - reasoning_chunk: {text, is_final}
    - extraction_complete: {report_id, extraction}

    Raises:
        404: Report not found
    """
    # Validate report exists before streaming
    report = db.query(HazardReport).filter(HazardReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report {report_id} not found",
        )

    return StreamingResponse(
        stream_extraction(report_id, db),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )
