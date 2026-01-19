"""Tests for the streaming extraction SSE endpoint."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.trailwatch.main import app
from src.trailwatch.models_sqlalchemy import Base, HazardReport
from src.trailwatch.core.config import settings
from uuid import uuid4
from datetime import datetime
import json


@pytest.fixture(scope="module")
def setup_db_for_extraction_tests():
    """Set up test database."""
    engine = create_engine(settings.database_url)
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    yield TestingSessionLocal
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)


@pytest.fixture
def sample_report(setup_db_for_extraction_tests):
    """Create a sample report for testing."""
    TestingSessionLocal = setup_db_for_extraction_tests
    db = TestingSessionLocal()

    report_id = uuid4()
    report = HazardReport(
        id=report_id,
        original_submission={
            "trail_id": "PCT-001",
            "location": {"latitude": 37.123, "longitude": -120.456, "accuracy_meters": 10},
            "hazard_type": "clearing",
            "severity_estimate": "impassable",
            "description": "A large tree has fallen across the trail blocking all passage.",
            "photos": ["https://example.com/tree.jpg"],
            "reporter": {"type": "volunteer", "organization": "PCTA"},
        },
        tracs_category="CLR",
        tracs_category_name="Clearing",
        severity="SEV_HIGH",
        severity_name="High",
        confidence_score=0.75,
        submitted_at=datetime.utcnow(),
    )
    db.add(report)
    db.commit()

    yield report_id

    # Cleanup
    db.query(HazardReport).filter(HazardReport.id == report_id).delete()
    db.commit()
    db.close()


class TestExtractionStreamEndpoint:
    """Tests for the streaming extraction endpoint."""

    def test_stream_returns_extraction_start_event(self, client, sample_report):
        """Test that stream starts with extraction_start event."""
        response = client.post(
            f"/api/v1/reports/{sample_report}/extract/stream",
            headers={"Accept": "text/event-stream"},
        )

        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("content-type", "")

        # Parse SSE events
        events = parse_sse_events(response.text)
        assert len(events) > 0

        # First event should be extraction_start
        first_event = events[0]
        assert first_event["event"] == "extraction_start"
        data = json.loads(first_event["data"])
        assert data["report_id"] == str(sample_report)

    def test_stream_emits_field_extracted_events(self, client, sample_report):
        """Test that field_extracted events are emitted for each field."""
        response = client.post(
            f"/api/v1/reports/{sample_report}/extract/stream",
            headers={"Accept": "text/event-stream"},
        )

        events = parse_sse_events(response.text)
        field_events = [e for e in events if e["event"] == "field_extracted"]

        # Should have at least tracs_category, severity, confidence
        field_names = [json.loads(e["data"])["field"] for e in field_events]
        assert "tracs_category" in field_names
        assert "severity" in field_names
        assert "confidence" in field_names

    def test_stream_ends_with_extraction_complete(self, client, sample_report):
        """Test that stream ends with extraction_complete event."""
        response = client.post(
            f"/api/v1/reports/{sample_report}/extract/stream",
            headers={"Accept": "text/event-stream"},
        )

        events = parse_sse_events(response.text)

        # Last event (before potential empty events) should be extraction_complete
        non_empty_events = [e for e in events if e.get("event")]
        last_event = non_empty_events[-1]
        assert last_event["event"] == "extraction_complete"

    def test_stream_returns_error_for_invalid_report(self, client):
        """Test that error event is returned for non-existent report."""
        fake_id = str(uuid4())
        response = client.post(
            f"/api/v1/reports/{fake_id}/extract/stream",
            headers={"Accept": "text/event-stream"},
        )

        # Should return 404 for non-existent report
        assert response.status_code == 404


def parse_sse_events(text: str) -> list[dict]:
    """Parse SSE event stream text into a list of events."""
    events = []
    current_event = {}

    for line in text.strip().split("\n"):
        if line.startswith("event:"):
            current_event["event"] = line[6:].strip()
        elif line.startswith("data:"):
            current_event["data"] = line[5:].strip()
        elif line == "" and current_event:
            events.append(current_event)
            current_event = {}

    # Don't forget the last event if there's no trailing newline
    if current_event:
        events.append(current_event)

    return events
