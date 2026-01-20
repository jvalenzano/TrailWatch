from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from uuid import UUID
from datetime import datetime

# Sync queue types (match frontend/src/types/sync.ts)
SyncQueueItemType = Literal['report_create', 'report_update', 'insight_action']
SyncQueueItemStatus = Literal['pending', 'syncing', 'failed']

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


# Sync Queue Models (match frontend/src/types/sync.ts)
class SyncQueueItem(BaseModel):
    """Individual item in the offline sync queue."""
    id: UUID
    type: SyncQueueItemType
    data: dict
    timestamp: datetime
    status: SyncQueueItemStatus
    retry_count: int = Field(default=0, alias="retryCount")
    last_error: Optional[str] = Field(default=None, alias="lastError")

    class Config:
        populate_by_name = True


class SyncQueueResponse(BaseModel):
    """Response from GET /api/sync/queue endpoint."""
    items: List[SyncQueueItem]
    count: int


class SyncQueueAddRequest(BaseModel):
    """Request body for POST /api/sync/queue endpoint."""
    type: SyncQueueItemType
    data: dict
    timestamp: datetime


class SyncQueueAddResponse(BaseModel):
    """Response from POST /api/sync/queue endpoint."""
    id: UUID
    status: Literal['pending']


class SyncExecuteResponse(BaseModel):
    """Response from POST /api/sync/execute endpoint."""
    synced: int
    failed: int
    errors: List[str]


class SyncStatus(BaseModel):
    """Response from GET /api/sync/status endpoint."""
    is_online: bool = Field(alias="isOnline")
    pending_count: int = Field(alias="pendingCount")
    last_sync: Optional[datetime] = Field(default=None, alias="lastSync")

    class Config:
        populate_by_name = True