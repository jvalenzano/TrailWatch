import pytest
from trailwatch.tracs_mapping import get_tracs_category

@pytest.mark.parametrize("description, expected_code, expected_name", [
    ("Big tree down on the trail", "CLR", "Clearing"),
    ("The trail is completely flooded", "DRN", "Drainage"),
    ("Bridge out, had to turn back", "STR", "Structures"),
    ("Trail sign is missing at the junction", "SGN", "Signing"),
    ("Lots of erosion on the switchbacks", "GRD", "Grading"),
    ("Exposed roots making it hard to walk", "TRD", "Tread"),
    ("This is a beautiful trail!", "OTH", "Other"),
])
def test_get_tracs_category(description, expected_code, expected_name):
    """Tests the get_tracs_category function with various descriptions."""
    code, name = get_tracs_category(description)
    assert code == expected_code
    assert name == expected_name
