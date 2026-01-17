from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

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
