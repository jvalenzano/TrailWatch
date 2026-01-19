import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.trailwatch.main import app
from src.trailwatch.models_sqlalchemy import Base, HazardReport
from src.trailwatch.core.config import settings
from datetime import datetime, timezone, timedelta

@pytest.fixture(scope="module")
def setup_db_for_dashboard_tests():
    engine = create_engine(settings.database_url)
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    yield TestingSessionLocal
    Base.metadata.drop_all(engine)
    engine.dispose()

def test_get_dashboard_reports_empty(setup_db_for_dashboard_tests):
    client = TestClient(app)
    response = client.get("/api/v1/dashboard/reports")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 0

def test_get_dashboard_reports_with_data(setup_db_for_dashboard_tests):
    TestingSessionLocal = setup_db_for_dashboard_tests
    db = TestingSessionLocal()
    report = HazardReport(
        original_submission={'location': {'latitude': 37.123, 'longitude': -120.456}, 'trail_name': 'Test Trail'},
        tracs_category="CLR",
        tracs_category_name="Clearing",
        severity="SEV2",
        severity_name="MAINTENANCE_NEEDED",
        status="new",
        confidence_score=0.8,
        submitted_at=datetime.now(timezone.utc),
        ranger_district="Test District"
    )
    db.add(report)
    db.commit()

    client = TestClient(app)
    response = client.get("/api/v1/dashboard/reports")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["hazard_type"] == "Clearing"
    assert data[0]["severity"] == "SEV2"
    assert data[0]["status"] == "new"
    assert data[0]["trail_name"] == "Test Trail"
    assert data[0]['latitude'] == 37.123
    assert data[0]['longitude'] == -120.456

    db.delete(report)
    db.commit()
    db.close()

def test_get_dashboard_stats_empty(setup_db_for_dashboard_tests):
    client = TestClient(app)
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    assert response.json() == {
        'total_open_reports_by_hazard_type': {},
        'average_resolution_time_days': 0,
        'reports_per_month': {},
        'most_reported_trails': []
    }

def test_get_dashboard_stats_with_data(setup_db_for_dashboard_tests):
    TestingSessionLocal = setup_db_for_dashboard_tests
    db = TestingSessionLocal()
    report1 = HazardReport(
        original_submission={'location': {'latitude': 37.123, 'longitude': -120.456}, 'trail_name': 'Test Trail 1'},
        tracs_category="CLR",
        tracs_category_name="Clearing",
        severity="SEV2",
        severity_name="MAINTENANCE_NEEDED",
        status="new",
        confidence_score=0.8,
        submitted_at=datetime.now(timezone.utc) - timedelta(days=30),
        ranger_district="Test District"
    )
    report2 = HazardReport(
        original_submission={'location': {'latitude': 37.456, 'longitude': -120.789}, 'trail_name': 'Test Trail 2'},
        tracs_category="DRN",
        tracs_category_name="Drainage",
        severity="SEV3",
        severity_name="CLOSURE_RECOMMENDED",
        status="resolved",
        confidence_score=0.9,
        submitted_at=datetime.now(timezone.utc) - timedelta(days=10),
        resolved_at=datetime.now(timezone.utc) - timedelta(days=5),
        ranger_district="Test District"
    )
    db.add_all([report1, report2])
    db.commit()

    client = TestClient(app)
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data['total_open_reports_by_hazard_type'] == {'Clearing': 1}
    assert data['average_resolution_time_days'] == 5
    assert len(data['most_reported_trails']) == 2

    db.delete(report1)
    db.delete(report2)
    db.commit()
    db.close()

@pytest.fixture(autouse=True)
def clean_db(setup_db_for_dashboard_tests):
    TestingSessionLocal = setup_db_for_dashboard_tests
    db = TestingSessionLocal()
    db.query(HazardReport).delete()
    db.commit()
    db.close()

def test_get_dashboard_reports_filtering(setup_db_for_dashboard_tests):
    TestingSessionLocal = setup_db_for_dashboard_tests
    db = TestingSessionLocal()
    
    r1 = HazardReport(
        original_submission={'location': {'latitude': 0, 'longitude': 0}, 'trail_name': 'Alpha'},
        tracs_category="CLR", tracs_category_name="Clearing",
        severity="SEV2", severity_name="MAINTENANCE_NEEDED",
        status="new", confidence_score=1.0, submitted_at=datetime.now(timezone.utc),
        ranger_district="North"
    )
    r2 = HazardReport(
        original_submission={'location': {'latitude': 0, 'longitude': 0}, 'trail_name': 'Beta'},
        tracs_category="DRN", tracs_category_name="Drainage",
        severity="SEV3", severity_name="CLOSURE_RECOMMENDED",
        status="in_progress", confidence_score=1.0, submitted_at=datetime.now(timezone.utc),
        ranger_district="South"
    )
    db.add_all([r1, r2])
    db.commit()

    client = TestClient(app)
    
    # Filter by hazard_type
    response = client.get("/api/v1/dashboard/reports?hazard_type=Clearing")
    assert len(response.json()) == 1
    assert response.json()[0]["trail_name"] == "Alpha"

    # Filter by status
    response = client.get("/api/v1/dashboard/reports?status=in_progress")
    assert len(response.json()) == 1
    assert response.json()[0]["trail_name"] == "Beta"

    # Filter by district
    response = client.get("/api/v1/dashboard/reports?district=North")
    assert len(response.json()) == 1
    assert response.json()[0]["trail_name"] == "Alpha"

    db.delete(r1)
    db.delete(r2)
    db.commit()
    db.close()

def test_get_dashboard_reports_sorting(setup_db_for_dashboard_tests):
    TestingSessionLocal = setup_db_for_dashboard_tests
    db = TestingSessionLocal()
    
    now = datetime.now(timezone.utc)
    r1 = HazardReport(
        original_submission={'location': {'latitude': 0, 'longitude': 0}, 'trail_name': 'Old'},
        tracs_category="CLR", tracs_category_name="Clearing",
        severity="SEV1", severity_name="INFO",
        status="new", confidence_score=1.0, submitted_at=now - timedelta(days=5)
    )
    r2 = HazardReport(
        original_submission={'location': {'latitude': 0, 'longitude': 0}, 'trail_name': 'New'},
        tracs_category="CLR", tracs_category_name="Clearing",
        severity="SEV1", severity_name="INFO",
        status="new", confidence_score=1.0, submitted_at=now
    )
    db.add_all([r1, r2])
    db.commit()

    client = TestClient(app)
    
    # Sort DESC (default or explicit)
    response = client.get("/api/v1/dashboard/reports?sort_by=submitted_at&order=desc")
    assert response.json()[0]["trail_name"] == "New"
    assert response.json()[1]["trail_name"] == "Old"

    # Sort ASC
    response = client.get("/api/v1/dashboard/reports?sort_by=submitted_at&order=asc")
    assert response.json()[0]["trail_name"] == "Old"
    assert response.json()[1]["trail_name"] == "New"

    db.delete(r1)
    db.delete(r2)
    db.commit()
    db.close()
