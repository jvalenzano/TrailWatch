from src.trailwatch.models import ReportIn, ReportOut
from uuid import UUID

def test_report_in_model():
    data = {
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
    report_in = ReportIn(**data)
    assert report_in.trail_id == "123"

def test_report_out_model():
    report_id = UUID("12345678-1234-5678-1234-567812345678")
    data = {
        "report_id": report_id,
        "status": "received",
        "trail_matched": True,
        "trail_name": "Pacific Crest Trail - Section J",
        "estimated_processing_time": "under 5 minutes"
    }
    report_out = ReportOut(**data)
    assert report_out.report_id == report_id
