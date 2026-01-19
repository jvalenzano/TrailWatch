import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.trailwatch.main import app
from src.trailwatch.models_sqlalchemy import Base, HazardReport
from src.trailwatch.core.config import settings

@pytest.fixture(scope="module")
def setup_db_for_api_tests():
    engine = create_engine(settings.database_url)
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    yield TestingSessionLocal
    Base.metadata.drop_all(engine)
    engine.dispose()

def test_create_report(setup_db_for_api_tests):
    TestingSessionLocal = setup_db_for_api_tests
    
    # Initialize TestClient after database setup
    client = TestClient(app)
    
    response = client.post(
        "/api/v1/reports",
        json={
            "trail_id": "123",
            "location": {
                "latitude": 37.123456,
                "longitude": -120.654321,
                "accuracy_meters": 50
            },
            "hazard_type": "clearing",
            "severity_estimate": "passable",
            "description": "A tree is down on the trail.",
            "photos": ["https://example.com/photo.jpg"],
            "reporter": {
                "type": "volunteer",
                "organization": "PCTA"
            }
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "received"
    assert data["report_id"] is not None

    # Verify that the report is saved in the database
    db = TestingSessionLocal()
    saved_report = db.query(HazardReport).filter(HazardReport.id == data["report_id"]).first()
    assert saved_report is not None
    assert saved_report.tracs_category == "CLR"
    assert saved_report.tracs_category_name == "Clearing"
    assert saved_report.confidence_score == 0.50
    db.close()
