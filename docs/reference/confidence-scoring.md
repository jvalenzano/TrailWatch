# Confidence Scoring Algorithm

The Intake and Hazard Classifier agents assign a confidence score (0.0 - 1.0) to each report to determine triage priority.

## Scoring Logic

```python
# Confidence factors (0.0 - 1.0 each, weighted average)
CONFIDENCE_WEIGHTS = {
    "has_photo": 0.25,           # Photo provided
    "photo_matches_hazard": 0.20, # Vision model confirms hazard type
    "gps_accurate": 0.15,        # GPS within 50m of known trail
    "description_specific": 0.15, # Detailed description vs vague
    "reporter_trusted": 0.10,    # PCTA/volunteer vs anonymous
    "corroborating_reports": 0.10, # Other reports same location/time
    "weather_context": 0.05,     # Matches recent weather events
}

# Thresholds
HIGH_CONFIDENCE = 0.80   # Auto-queue to ranger dashboard
MEDIUM_CONFIDENCE = 0.50 # Queue to coordinator for review
LOW_CONFIDENCE = 0.50    # Low priority, may request clarification
```
