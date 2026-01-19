from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class Location(BaseModel):
    latitude: float
    longitude: float
    accuracy_meters: Optional[float] = None

class Reporter(BaseModel):
    type: str
    organization: Optional[str] = None

class ReportIn(BaseModel):
    trail_id: Optional[str] = None
    location: Location
    hazard_type: str
    severity_estimate: str
    description: str = Field(..., max_length=1000)
    photos: Optional[List[str]] = None
    reporter: Reporter

class ReportOut(BaseModel):
    report_id: UUID
    status: str
    trail_matched: bool
    trail_name: Optional[str] = None
    estimated_processing_time: str

class DashboardReport(BaseModel):
    report_id: UUID
    hazard_type: str
    severity: str
    status: str
    submitted_at: datetime
    trail_name: Optional[str] = None
    ranger_district: Optional[str] = None
    latitude: float
    longitude: float

class DashboardStats(BaseModel):
    total_open_reports_by_hazard_type: dict[str, int]
    average_resolution_time_days: float
    reports_per_month: dict[str, int]
    most_reported_trails: List[str]