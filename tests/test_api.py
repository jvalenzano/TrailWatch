from fastapi.testclient import TestClient
from src.trailwatch.main import app

client = TestClient(app)

def test_create_report():
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
