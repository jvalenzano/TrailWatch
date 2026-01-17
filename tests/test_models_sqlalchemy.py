import pytest
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from uuid import uuid4

from src.trailwatch.models_sqlalchemy import Base, HazardReport


@pytest.fixture(scope="module")
def setup_db(db_engine):
    Base.metadata.create_all(db_engine)
    Session = sessionmaker(bind=db_engine)
    yield Session
    Base.metadata.drop_all(db_engine)

def test_create_hazard_report(setup_db):
    Session = setup_db
    session = Session()
    report = HazardReport(
        original_submission={"key": "value"},
        tracs_category="CLR",
        tracs_category_name="Clearing",
        severity="SEV2",
        severity_name="MAINTENANCE_NEEDED",
        confidence_score=87,
        confidence_factors={"has_photo": True},
        recommended_action="Schedule clearing crew",
        assigned_to="coordinator",
        ranger_district="Tahoe National Forest - Yuba River RD",
        triaged_at=datetime.utcnow(),
    )
    session.add(report)
    session.commit()
    session.refresh(report)
    assert report.id is not None
    assert report.tracs_category == "CLR"
    session.close()
