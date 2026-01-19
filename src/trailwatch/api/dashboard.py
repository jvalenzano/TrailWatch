from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from src.trailwatch.database import get_db
from src.trailwatch.models import DashboardReport, DashboardStats
from src.trailwatch.models_sqlalchemy import HazardReport
from sqlalchemy import func

router = APIRouter()

@router.get("/reports", response_model=List[DashboardReport])
def get_dashboard_reports(
    hazard_type: Optional[str] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    district: Optional[str] = None,
    trail: Optional[str] = None,
    sort_by: str = "submitted_at",
    order: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(HazardReport)
    
    if hazard_type:
        query = query.filter(HazardReport.tracs_category_name == hazard_type)
    if severity:
        query = query.filter(HazardReport.severity == severity)
    if status:
        query = query.filter(HazardReport.status == status)
    if district:
        query = query.filter(HazardReport.ranger_district == district)
    if trail:
        query = query.filter(HazardReport.original_submission['trail_name'].astext == trail)

    # Sorting
    if sort_by == "submitted_at":
        sort_col = HazardReport.submitted_at
        if order.lower() == "asc":
            query = query.order_by(sort_col.asc())
        else:
            query = query.order_by(sort_col.desc())
            
    reports = query.all()
    return [DashboardReport(
        report_id=report.id,
        hazard_type=report.tracs_category_name,
        severity=report.severity,
        status=report.status,
        submitted_at=report.submitted_at,
        trail_name=report.original_submission.get('trail_name'),
        ranger_district=report.ranger_district,
        latitude=report.original_submission['location']['latitude'],
        longitude=report.original_submission['location']['longitude']
    ) for report in reports]

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_open_reports_by_hazard_type = db.query(HazardReport.tracs_category_name, func.count(HazardReport.id)).filter(HazardReport.status == 'new').group_by(HazardReport.tracs_category_name).all()
    
    avg_resolution_time = db.query(
        func.avg(HazardReport.resolved_at - HazardReport.submitted_at)
    ).filter(HazardReport.status == 'resolved').scalar()
    
    # Calculate days if avg_resolution_time is present (postgres interval maps to timedelta)
    if avg_resolution_time:
        if hasattr(avg_resolution_time, 'total_seconds'):
            avg_days = avg_resolution_time.total_seconds() / 86400
        else:
            # Fallback for unexpected types
            avg_days = 0.0
    else:
        avg_days = 0.0

    month = func.date_trunc('month', HazardReport.submitted_at).label('month')
    reports_per_month = db.query(month, func.count(HazardReport.id)).group_by(month).all()

    trail_name = HazardReport.original_submission['trail_name'].astext.label('trail_name')
    most_reported_trails = db.query(trail_name, func.count(HazardReport.id)).group_by(trail_name).order_by(func.count(HazardReport.id).desc()).limit(5).all()

    return DashboardStats(
        total_open_reports_by_hazard_type=dict(total_open_reports_by_hazard_type),
        average_resolution_time_days=round(avg_days, 2),
        reports_per_month={f'{date.year}-{date.month:02d}': count for date, count in reports_per_month},
        most_reported_trails=[trail[0] for trail in most_reported_trails if trail[0]]
    )
