"""Sync queue API endpoints for offline sync functionality.

Supports field rangers working in areas with limited connectivity by
queuing operations for later synchronization.
"""
import logging
from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.trailwatch.database import get_db
from src.trailwatch.models import (
    SyncQueueItem,
    SyncQueueResponse,
    SyncQueueAddRequest,
    SyncQueueAddResponse,
    SyncExecuteResponse,
    SyncStatus,
)
from src.trailwatch.models_sqlalchemy import (
    SyncQueueItemDB,
    SyncStatusDB,
    HazardReport,
)
from src.trailwatch.tracs_mapping import get_tracs_category
from src.trailwatch.confidence_scoring import calculate_confidence_score
from src.trailwatch.validators import validate_coordinates

logger = logging.getLogger(__name__)

router = APIRouter()

MAX_RETRY_COUNT = 3


@router.get("/queue", response_model=SyncQueueResponse)
def get_sync_queue(db: Session = Depends(get_db)) -> SyncQueueResponse:
    """Get all pending and failed sync items.

    Returns:
        SyncQueueResponse with items list and count.
    """
    items = db.query(SyncQueueItemDB).filter(
        SyncQueueItemDB.status.in_(["pending", "failed"])
    ).order_by(SyncQueueItemDB.timestamp.asc()).all()

    return SyncQueueResponse(
        items=[
            SyncQueueItem(
                id=item.id,
                type=item.type,
                data=item.data,
                timestamp=item.timestamp,
                status=item.status,
                retry_count=item.retry_count,
                last_error=item.last_error,
            )
            for item in items
        ],
        count=len(items),
    )


@router.post("/queue", response_model=SyncQueueAddResponse, status_code=status.HTTP_201_CREATED)
def add_to_sync_queue(
    request: SyncQueueAddRequest,
    db: Session = Depends(get_db)
) -> SyncQueueAddResponse:
    """Add a new item to the sync queue.

    Args:
        request: The sync queue item to add.

    Returns:
        SyncQueueAddResponse with the new item ID and status.
    """
    item_id = uuid4()

    db_item = SyncQueueItemDB(
        id=item_id,
        type=request.type,
        data=request.data,
        timestamp=request.timestamp,
        status="pending",
        retry_count=0,
    )
    db.add(db_item)
    db.commit()

    return SyncQueueAddResponse(
        id=item_id,
        status="pending",
    )


@router.post("/execute", response_model=SyncExecuteResponse)
def execute_sync(db: Session = Depends(get_db)) -> SyncExecuteResponse:
    """Execute sync by processing all pending items.

    Processes each pending item based on its type:
    - report_create: Creates a new hazard report
    - report_update: Updates an existing report
    - insight_action: Placeholder for future insight processing

    Returns:
        SyncExecuteResponse with synced/failed counts and error messages.
    """
    synced = 0
    failed = 0
    errors: list[str] = []

    # Get all pending and failed items (retry failed items up to MAX_RETRY_COUNT)
    items = db.query(SyncQueueItemDB).filter(
        SyncQueueItemDB.status.in_(["pending", "failed"])
    ).all()

    for item in items:
        # Skip items that have exceeded retry limit
        if item.status == "failed" and item.retry_count >= MAX_RETRY_COUNT:
            failed += 1
            errors.append(f"Failed to sync {item.type} ({item.id}): Max retries exceeded")
            continue

        # Mark as syncing
        item.status = "syncing"
        db.commit()

        try:
            if item.type == "report_create":
                _process_report_create(item, db)
            elif item.type == "report_update":
                _process_report_update(item, db)
            elif item.type == "insight_action":
                _process_insight_action(item, db)
            else:
                raise ValueError(f"Unknown sync type: {item.type}")

            # Success - delete from queue
            db.delete(item)
            db.commit()
            synced += 1

        except Exception as e:
            # Mark as failed
            item.status = "failed"
            item.retry_count += 1
            item.last_error = str(e)
            db.commit()
            failed += 1
            errors.append(f"Failed to sync {item.type} ({item.id}): {str(e)}")
            logger.warning(f"Sync failed for item {item.id}: {e}")

    # Update last sync timestamp
    _update_last_sync(db)

    return SyncExecuteResponse(
        synced=synced,
        failed=failed,
        errors=errors,
    )


@router.get("/status", response_model=SyncStatus)
def get_sync_status(db: Session = Depends(get_db)) -> SyncStatus:
    """Get current sync status.

    Returns:
        SyncStatus with online status, pending count, and last sync timestamp.
    """
    # Count pending + failed items
    pending_count = db.query(SyncQueueItemDB).filter(
        SyncQueueItemDB.status.in_(["pending", "failed"])
    ).count()

    # Get last sync timestamp
    sync_status = db.query(SyncStatusDB).first()
    last_sync = sync_status.last_sync if sync_status else None

    return SyncStatus(
        is_online=True,  # Backend is always online when responding
        pending_count=pending_count,
        last_sync=last_sync,
    )


def _process_report_create(item: SyncQueueItemDB, db: Session) -> None:
    """Process a report_create sync item.

    Creates a new HazardReport from the queued data.

    Args:
        item: The sync queue item containing report data.
        db: Database session.

    Raises:
        ValueError: If required fields are missing.
        HTTPException: If validation fails.
    """
    data = item.data

    # Validate required fields
    required_fields = ["location", "hazard_type", "severity_estimate", "description", "reporter"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    location = data.get("location", {})
    latitude = location.get("latitude")
    longitude = location.get("longitude")

    if latitude is None or longitude is None:
        raise ValueError("Location must include latitude and longitude")

    # Validate coordinates
    validate_coordinates(latitude, longitude)

    # TRACS Category Extraction
    description = data.get("description", "")
    tracs_code, tracs_name = get_tracs_category(description)

    # Confidence Scoring
    has_photo = bool(data.get("photos"))
    reporter = data.get("reporter", {})
    reporter_trusted = reporter.get("type") in ["volunteer", "coordinator"]
    description_specific = len(description) > 20

    confidence_score = calculate_confidence_score(
        has_photo=has_photo,
        photo_matches_hazard=False,
        gps_accurate=False,
        description_specific=description_specific,
        reporter_trusted=reporter_trusted,
        corroborating_reports=0,
        weather_context=False,
    )

    # Create the report
    db_report = HazardReport(
        id=uuid4(),
        original_submission=data,
        tracs_category=tracs_code,
        tracs_category_name=tracs_name,
        severity="SEV_UNKNOWN",
        severity_name="Unknown",
        confidence_score=confidence_score,
        confidence_factors=None,
        recommended_action=None,
        assigned_to=None,
        ranger_district=None,
        submitted_at=item.timestamp,
        triaged_at=None,
    )
    db.add(db_report)
    db.commit()

    logger.info(f"Created report {db_report.id} from sync item {item.id}")


def _process_report_update(item: SyncQueueItemDB, db: Session) -> None:
    """Process a report_update sync item.

    Updates an existing HazardReport with the queued data.

    Args:
        item: The sync queue item containing update data.
        db: Database session.

    Raises:
        ValueError: If report_id is missing or report not found.
    """
    data = item.data
    report_id = data.get("report_id")

    if not report_id:
        raise ValueError("report_id is required for report_update")

    # Find the report
    report = db.query(HazardReport).filter(HazardReport.id == report_id).first()
    if not report:
        raise ValueError(f"Report not found: {report_id}")

    # Update allowed fields
    if "status" in data:
        report.status = data["status"]
    if "assigned_to" in data:
        report.assigned_to = data["assigned_to"]
    if "ranger_district" in data:
        report.ranger_district = data["ranger_district"]

    db.commit()
    logger.info(f"Updated report {report_id} from sync item {item.id}")


def _process_insight_action(item: SyncQueueItemDB, db: Session) -> None:
    """Process an insight_action sync item.

    Placeholder implementation - insights not yet implemented.

    Args:
        item: The sync queue item containing insight action data.
        db: Database session.
    """
    # Placeholder for future insight processing
    logger.info(f"Processed insight_action {item.id} (placeholder)")


def _update_last_sync(db: Session) -> None:
    """Update the last sync timestamp in sync_status table.

    Args:
        db: Database session.
    """
    sync_status = db.query(SyncStatusDB).first()
    if sync_status:
        sync_status.last_sync = datetime.utcnow()
    else:
        sync_status = SyncStatusDB(id=1, last_sync=datetime.utcnow())
        db.add(sync_status)
    db.commit()
