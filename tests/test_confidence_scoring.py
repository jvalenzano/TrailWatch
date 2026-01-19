import pytest
from src.trailwatch.confidence_scoring import calculate_confidence_score, CONFIDENCE_WEIGHTS

def test_confidence_weights_sum_to_one():
    """Verify that all confidence weights sum up to 1.0."""
    total_weight = sum(CONFIDENCE_WEIGHTS.values())
    assert total_weight == pytest.approx(1.0)

@pytest.mark.parametrize(
    "has_photo, photo_matches_hazard, gps_accurate, description_specific, reporter_trusted, corroborating_reports, weather_context, expected_score",
    [
        # All factors true
        (True, True, True, True, True, 1, True, 1.00),
        # All factors false
        (False, False, False, False, False, 0, False, 0.00),
        # Mixed factors
        (True, False, True, False, True, 0, False, 0.25 + 0.15 + 0.10),
        (False, True, False, True, False, 1, True, 0.20 + 0.15 + 0.10 + 0.05),
        # Only photo
        (True, False, False, False, False, 0, False, 0.25),
        # Only photo_matches_hazard
        (False, True, False, False, False, 0, False, 0.20),
        # Only gps_accurate
        (False, False, True, False, False, 0, False, 0.15),
        # Only description_specific
        (False, False, False, True, False, 0, False, 0.15),
        # Only reporter_trusted
        (False, False, False, False, True, 0, False, 0.10),
        # Only corroborating_reports
        (False, False, False, False, False, 1, False, 0.10),
        (False, False, False, False, False, 5, False, 0.10), # Multiple corroborating reports
        # Only weather_context
        (False, False, False, False, False, 0, True, 0.05),
        # Combination of a few
        (True, True, False, False, False, 0, False, 0.25 + 0.20),
        (True, True, True, True, True, 0, True, 0.25 + 0.20 + 0.15 + 0.15 + 0.10 + 0.05), # No corroborating reports
    ]
)
def test_calculate_confidence_score(
    has_photo: bool, photo_matches_hazard: bool, gps_accurate: bool, 
    description_specific: bool, reporter_trusted: bool, 
    corroborating_reports: int, weather_context: bool, expected_score: float
):
    """Test calculate_confidence_score with various combinations of inputs."""
    score = calculate_confidence_score(
        has_photo=has_photo,
        photo_matches_hazard=photo_matches_hazard,
        gps_accurate=gps_accurate,
        description_specific=description_specific,
        reporter_trusted=reporter_trusted,
        corroborating_reports=corroborating_reports,
        weather_context=weather_context
    )
    assert score == pytest.approx(expected_score)

def test_calculate_confidence_score_no_corroborating():
    """Test with zero corroborating reports."""
    score = calculate_confidence_score(
        has_photo=True, photo_matches_hazard=False, gps_accurate=False,
        description_specific=False, reporter_trusted=False,
        corroborating_reports=0, weather_context=False
    )
    assert score == pytest.approx(0.25)

