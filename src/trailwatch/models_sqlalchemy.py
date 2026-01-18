from sqlalchemy import Column, String, Integer, DateTime, Float
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
