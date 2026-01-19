CONFIDENCE_WEIGHTS = {
    "has_photo": 0.25,
    "photo_matches_hazard": 0.20,
    "gps_accurate": 0.15,
    "description_specific": 0.15,
    "reporter_trusted": 0.10,
    "corroborating_reports": 0.10,
    "weather_context": 0.05,
}

def calculate_confidence_score(
    has_photo: bool,
    photo_matches_hazard: bool,
    gps_accurate: bool,
    description_specific: bool,
    reporter_trusted: bool,
    corroborating_reports: int, # Number of corroborating reports
    weather_context: bool # Whether weather context aligns with report
) -> float:
    """Calculates the confidence score of a hazard report based on various factors."""
    score = 0.0

    if has_photo: score += CONFIDENCE_WEIGHTS["has_photo"]
    if photo_matches_hazard: score += CONFIDENCE_WEIGHTS["photo_matches_hazard"]
    if gps_accurate: score += CONFIDENCE_WEIGHTS["gps_accurate"]
    if description_specific: score += CONFIDENCE_WEIGHTS["description_specific"]
    if reporter_trusted: score += CONFIDENCE_WEIGHTS["reporter_trusted"]
    
    # For corroborating_reports, let's assume each report adds a fraction of the weight, up to the max
    # For simplicity, we'll cap at 1 corroborating report for full weight for now.
    if corroborating_reports > 0: score += CONFIDENCE_WEIGHTS["corroborating_reports"]
    
    if weather_context: score += CONFIDENCE_WEIGHTS["weather_context"]

    return round(score, 2)
