"""GPS Coordinate Validators"""

from typing import List, TypedDict


class BoundingBox(TypedDict):
    name: str
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float


VALID_REGIONS: List[BoundingBox] = [
    {
        "name": "Continental US",
        "min_lat": 24.5,
        "max_lat": 49.5,
        "min_lon": -125.0,
        "max_lon": -66.5,
    },
    {
        "name": "Alaska",
        "min_lat": 51.0,
        "max_lat": 71.5,
        "min_lon": -180.0,
        "max_lon": -129.0,
    },
    {
        "name": "Hawaii",
        "min_lat": 18.5,
        "max_lat": 22.5,
        "min_lon": -161.0,
        "max_lon": -154.5,
    },
]


def validate_coordinates(lat: float, lon: float) -> None:
    """
    Validates that GPS coordinates are within defined USFS regions.

    Args:
        lat: Latitude.
        lon: Longitude.

    Raises:
        ValueError: If coordinates are outside all defined regions or are invalid.
    """
    if not -90 <= lat <= 90:
        raise ValueError(f"Invalid latitude: {lat}. Must be between -90 and 90.")
    if not -180 <= lon <= 180:
        raise ValueError(
            f"Invalid longitude: {lon}. Must be between -180 and 180."
        )

    for region in VALID_REGIONS:
        if (
            region["min_lat"] <= lat <= region["max_lat"]
            and region["min_lon"] <= lon <= region["max_lon"]
        ):
            return  # Found a valid region

    raise ValueError(
        f"Coordinates ({lat}, {lon}) are outside of valid USFS regions."
    )