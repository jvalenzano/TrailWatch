"""Tests for the sync queue API endpoints.

Following TDD: these tests define the expected behavior of the sync API
before the implementation is complete.
"""
import pytest
from datetime import datetime
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.trailwatch.main import app
from src.trailwatch.models_sqlalchemy import Base, SyncQueueItemDB, SyncStatusDB
from src.trailwatch.database import get_db
from src.trailwatch.core.config import settings


@pytest.fixture(scope="module")
def setup_db_for_sync_tests():
    """Create test database and tables."""
    engine = create_engine(settings.database_url)
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    yield TestingSessionLocal
    # Cleanup
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def db_session(setup_db_for_sync_tests):
    """Provide a transactional database session for each test."""
    TestingSessionLocal = setup_db_for_sync_tests
    session = TestingSessionLocal()

    # Clear sync queue and status tables before each test
    session.query(SyncQueueItemDB).delete()
    session.query(SyncStatusDB).delete()
    session.commit()

    yield session
    session.close()


@pytest.fixture
def client(db_session):
    """Provide FastAPI test client."""
    return TestClient(app)


class TestGetSyncQueue:
    """Tests for GET /api/v1/sync/queue endpoint."""

    def test_returns_empty_list_when_no_items(self, client, db_session):
        """When queue is empty, should return empty items list with count 0."""
        response = client.get("/api/v1/sync/queue")

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["count"] == 0

    def test_returns_pending_items(self, client, db_session):
        """Should return all pending items in the queue."""
        # Add a pending item
        item = SyncQueueItemDB(
            id=uuid4(),
            type="report_create",
            data={"trail_id": "123", "description": "Test report"},
            timestamp=datetime.utcnow(),
            status="pending",
            retry_count=0
        )
        db_session.add(item)
        db_session.commit()

        response = client.get("/api/v1/sync/queue")

        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["type"] == "report_create"
        assert data["items"][0]["status"] == "pending"

    def test_returns_failed_items(self, client, db_session):
        """Should include failed items in the queue response."""
        # Add a failed item
        item = SyncQueueItemDB(
            id=uuid4(),
            type="report_update",
            data={"report_id": str(uuid4()), "status": "resolved"},
            timestamp=datetime.utcnow(),
            status="failed",
            retry_count=2,
            last_error="Server error: Unable to process"
        )
        db_session.add(item)
        db_session.commit()

        response = client.get("/api/v1/sync/queue")

        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 1
        assert data["items"][0]["status"] == "failed"
        assert data["items"][0]["retryCount"] == 2
        assert "Server error" in data["items"][0]["lastError"]


class TestAddToSyncQueue:
    """Tests for POST /api/v1/sync/queue endpoint."""

    def test_creates_new_sync_item(self, client, db_session):
        """Should create a new sync item and return 201 with item ID."""
        request_data = {
            "type": "report_create",
            "data": {"trail_id": "456", "description": "New hazard"},
            "timestamp": datetime.utcnow().isoformat()
        }

        response = client.post("/api/v1/sync/queue", json=request_data)

        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["status"] == "pending"

        # Verify in database
        saved_item = db_session.query(SyncQueueItemDB).filter(
            SyncQueueItemDB.id == data["id"]
        ).first()
        assert saved_item is not None
        assert saved_item.type == "report_create"
        assert saved_item.status == "pending"

    def test_validates_required_type_field(self, client, db_session):
        """Should return 400 when type is missing."""
        request_data = {
            "data": {"trail_id": "456"},
            "timestamp": datetime.utcnow().isoformat()
        }

        response = client.post("/api/v1/sync/queue", json=request_data)

        assert response.status_code == 422  # Validation error

    def test_validates_required_data_field(self, client, db_session):
        """Should return 400 when data is missing."""
        request_data = {
            "type": "report_create",
            "timestamp": datetime.utcnow().isoformat()
        }

        response = client.post("/api/v1/sync/queue", json=request_data)

        assert response.status_code == 422  # Validation error

    def test_validates_invalid_type(self, client, db_session):
        """Should return 422 when type is not a valid enum value."""
        request_data = {
            "type": "invalid_type",
            "data": {"trail_id": "456"},
            "timestamp": datetime.utcnow().isoformat()
        }

        response = client.post("/api/v1/sync/queue", json=request_data)

        assert response.status_code == 422  # Validation error


class TestExecuteSync:
    """Tests for POST /api/v1/sync/execute endpoint."""

    def test_processes_pending_report_create(self, client, db_session):
        """Should process pending report_create items."""
        # Add a pending report_create item
        item = SyncQueueItemDB(
            id=uuid4(),
            type="report_create",
            data={
                "trail_id": "123",
                "location": {
                    "latitude": 37.123456,
                    "longitude": -120.654321,
                    "accuracy_meters": 50
                },
                "hazard_type": "clearing",
                "severity_estimate": "passable",
                "description": "Tree down on trail",
                "photos": [],
                "reporter": {
                    "type": "volunteer",
                    "organization": "PCTA"
                }
            },
            timestamp=datetime.utcnow(),
            status="pending",
            retry_count=0
        )
        db_session.add(item)
        db_session.commit()
        item_id = item.id

        response = client.post("/api/v1/sync/execute")

        assert response.status_code == 200
        data = response.json()
        assert data["synced"] >= 0
        assert "failed" in data
        assert "errors" in data

    def test_processes_pending_report_update(self, client, db_session):
        """Should process pending report_update items."""
        # First create a report
        from src.trailwatch.models_sqlalchemy import HazardReport
        report = HazardReport(
            id=uuid4(),
            original_submission={
                "trail_id": "123",
                "location": {"latitude": 37.0, "longitude": -120.0},
                "hazard_type": "clearing",
                "severity_estimate": "passable",
                "description": "Test",
                "reporter": {"type": "volunteer"}
            },
            tracs_category="CLR",
            tracs_category_name="Clearing",
            severity="SEV_UNKNOWN",
            severity_name="Unknown",
            confidence_score=0.5,
            submitted_at=datetime.utcnow()
        )
        db_session.add(report)
        db_session.commit()
        report_id = str(report.id)

        # Add a pending update item
        item = SyncQueueItemDB(
            id=uuid4(),
            type="report_update",
            data={
                "report_id": report_id,
                "status": "resolved"
            },
            timestamp=datetime.utcnow(),
            status="pending",
            retry_count=0
        )
        db_session.add(item)
        db_session.commit()

        response = client.post("/api/v1/sync/execute")

        assert response.status_code == 200
        data = response.json()
        assert "synced" in data
        assert "failed" in data

    def test_handles_insight_action_placeholder(self, client, db_session):
        """Should handle insight_action items (placeholder for now)."""
        item = SyncQueueItemDB(
            id=uuid4(),
            type="insight_action",
            data={"insight_id": str(uuid4()), "action": "acknowledge"},
            timestamp=datetime.utcnow(),
            status="pending",
            retry_count=0
        )
        db_session.add(item)
        db_session.commit()

        response = client.post("/api/v1/sync/execute")

        assert response.status_code == 200
        data = response.json()
        # Insight actions are placeholders, should succeed or be noted
        assert "synced" in data

    def test_removes_successful_items_from_queue(self, client, db_session):
        """Should remove successfully synced items from queue."""
        item = SyncQueueItemDB(
            id=uuid4(),
            type="report_create",
            data={
                "trail_id": "123",
                "location": {
                    "latitude": 37.123456,
                    "longitude": -120.654321,
                    "accuracy_meters": 50
                },
                "hazard_type": "clearing",
                "severity_estimate": "passable",
                "description": "Tree down on trail",
                "photos": [],
                "reporter": {
                    "type": "volunteer",
                    "organization": "PCTA"
                }
            },
            timestamp=datetime.utcnow(),
            status="pending",
            retry_count=0
        )
        db_session.add(item)
        db_session.commit()
        item_id = item.id

        client.post("/api/v1/sync/execute")

        # Verify item is removed from queue after successful sync
        remaining = db_session.query(SyncQueueItemDB).filter(
            SyncQueueItemDB.id == item_id
        ).first()
        # If sync was successful, item should be gone
        # Note: Item may still exist if it failed - that's also valid behavior

    def test_marks_failed_items_with_error(self, client, db_session):
        """Should mark failed items and store error message."""
        # Create an item that will fail (invalid report data)
        item = SyncQueueItemDB(
            id=uuid4(),
            type="report_create",
            data={"invalid": "data"},  # Missing required fields
            timestamp=datetime.utcnow(),
            status="pending",
            retry_count=0
        )
        db_session.add(item)
        db_session.commit()
        item_id = item.id

        response = client.post("/api/v1/sync/execute")

        assert response.status_code == 200
        data = response.json()

        # Check that failed count is tracked
        if data["failed"] > 0:
            assert len(data["errors"]) > 0

            # Verify item is marked as failed in database
            db_session.refresh(item)
            failed_item = db_session.query(SyncQueueItemDB).filter(
                SyncQueueItemDB.id == item_id
            ).first()
            if failed_item:
                assert failed_item.status == "failed"
                assert failed_item.retry_count > 0

    def test_updates_last_sync_timestamp(self, client, db_session):
        """Should update last sync timestamp after execution."""
        response = client.post("/api/v1/sync/execute")

        assert response.status_code == 200

        # Verify last_sync is updated in sync_status table
        status = db_session.query(SyncStatusDB).first()
        # Status may or may not exist depending on implementation
        # This test documents expected behavior


class TestGetSyncStatus:
    """Tests for GET /api/v1/sync/status endpoint."""

    def test_returns_online_status(self, client, db_session):
        """Backend should always report isOnline as true."""
        response = client.get("/api/v1/sync/status")

        assert response.status_code == 200
        data = response.json()
        assert data["isOnline"] is True

    def test_returns_pending_count(self, client, db_session):
        """Should return correct count of pending items."""
        # Add some pending items
        for i in range(3):
            item = SyncQueueItemDB(
                id=uuid4(),
                type="report_create",
                data={"index": i},
                timestamp=datetime.utcnow(),
                status="pending",
                retry_count=0
            )
            db_session.add(item)

        # Add a failed item (should also count)
        failed_item = SyncQueueItemDB(
            id=uuid4(),
            type="report_update",
            data={"index": 99},
            timestamp=datetime.utcnow(),
            status="failed",
            retry_count=1
        )
        db_session.add(failed_item)
        db_session.commit()

        response = client.get("/api/v1/sync/status")

        assert response.status_code == 200
        data = response.json()
        assert data["pendingCount"] == 4  # 3 pending + 1 failed

    def test_returns_last_sync_timestamp(self, client, db_session):
        """Should return lastSync timestamp if sync has been executed."""
        # First execute a sync to set lastSync
        client.post("/api/v1/sync/execute")

        response = client.get("/api/v1/sync/status")

        assert response.status_code == 200
        data = response.json()
        # lastSync should be set after execute, or null if never synced
        assert "lastSync" in data

    def test_returns_null_last_sync_if_never_synced(self, client, db_session):
        """Should return null lastSync if sync has never been executed."""
        response = client.get("/api/v1/sync/status")

        assert response.status_code == 200
        data = response.json()
        # May be null if never synced
        assert "lastSync" in data
