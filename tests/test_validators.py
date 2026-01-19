import pytest
from src.trailwatch.validators import validate_coordinates

# Test Cases
VALID_COORDINATES = {
    "yosemite": (37.8651, -119.5383),  # Continental US
    "denali": (63.3333, -150.5000),      # Alaska
    "haleakala": (20.7146, -156.2591),  # Hawaii
}

INVALID_COORDINATES = {
    "europe": (48.8566, 2.3522),         # Outside all regions
    "antarctica": (-75.250973, -0.071389), # Outside all regions
    "pacific_ocean": (0, -150),          # Outside all regions
}

EDGE_CASES = {
    # On the edge of Continental US box
    "conus_min_lat_lon": (24.5, -125.0),
    "conus_max_lat_lon": (49.5, -66.5),
}

INVALID_RANGES = {
    "invalid_lat_high": (91, -120),
    "invalid_lat_low": (-91, -120),
    "invalid_lon_high": (30, 181),
    "invalid_lon_low": (30, -181),
}


# --- VALID COORDINATES ---
@pytest.mark.parametrize("lat, lon", VALID_COORDINATES.values(), ids=VALID_COORDINATES.keys())
def test_valid_coordinates_pass(lat, lon):
    """Tests that valid coordinates within USFS regions pass validation."""
    validate_coordinates(lat, lon)


# --- INVALID COORDINATES (GEOGRAPHIC) ---
@pytest.mark.parametrize("lat, lon", INVALID_COORDINATES.values(), ids=INVALID_COORDINATES.keys())
def test_invalid_coordinates_fail(lat, lon):
    """Tests that coordinates outside of any valid region fail."""
    with pytest.raises(ValueError, match="outside of valid USFS regions"):
        validate_coordinates(lat, lon)


# --- EDGE CASES ---
@pytest.mark.parametrize("lat, lon", EDGE_CASES.values(), ids=EDGE_CASES.keys())
def test_edge_case_coordinates_pass(lat, lon):
    """Tests that coordinates on the exact boundary edges pass validation."""
    validate_coordinates(lat, lon)


# --- INVALID RANGES (LAT/LON ITSELF IS INVALID) ---
def test_invalid_latitude_range():
    """Tests that latitudes outside of [-90, 90] fail."""
    with pytest.raises(ValueError, match="Invalid latitude"):
        validate_coordinates(90.1, -120)
    with pytest.raises(ValueError, match="Invalid latitude"):
        validate_coordinates(-90.1, -120)


def test_invalid_longitude_range():
    """Tests that longitudes outside of [-180, 180] fail."""
    with pytest.raises(ValueError, match="Invalid longitude"):
        validate_coordinates(30, 180.1)
    with pytest.raises(ValueError, match="Invalid longitude"):
        validate_coordinates(30, -180.1)
