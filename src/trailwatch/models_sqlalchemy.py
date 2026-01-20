from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base
from datetime import datetime
from uuid import uuid4

Base = declarative_base()

class HazardReport(Base):
    __tablename__ = "hazard_reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    original_submission = Column(JSONB, nullable=False)
    tracs_category = Column(String, nullable=False)
    tracs_category_name = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    severity_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default='new')
    confidence_score = Column(Float, nullable=False)
    confidence_factors = Column(JSONB)
    recommended_action = Column(String)
    similar_reports = Column(JSONB)
    trail_popularity_percentile = Column(Integer)
    estimated_hikers_affected_annually = Column(Integer)
    assigned_to = Column(String)
    coordinator_id = Column(UUID(as_uuid=True))
    ranger_district = Column(String)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    triaged_at = Column(DateTime)
    reviewed_at = Column(DateTime)
    resolved_at = Column(DateTime)


class SyncQueueItemDB(Base):
    """Database model for offline sync queue items."""
    __tablename__ = "sync_queue"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    type = Column(String, nullable=False)  # 'report_create', 'report_update', 'insight_action'
    data = Column(JSONB, nullable=False)  # Payload for the operation
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(String, nullable=False, default='pending')  # 'pending', 'syncing', 'failed'
    retry_count = Column(Integer, nullable=False, default=0)
    last_error = Column(String)  # Error message from last failed attempt
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SyncStatusDB(Base):
    """Database model for tracking sync status metadata."""
    __tablename__ = "sync_status"

    id = Column(Integer, primary_key=True, default=1)  # Single row table
    last_sync = Column(DateTime)  # Last successful sync execution timestamp
