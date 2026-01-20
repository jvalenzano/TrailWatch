# Specification: Intake Agent

## 1. Goal

Accept citizen reports, extract structured data, and map to TRACS categories.

## 2. Input

- Raw citizen submission (text, photo, GPS)

## 3. Output

- Structured HazardReport with TRACS category + confidence score.

## 4. Success Criteria

- Process 50 sample reports with 80%+ TRACS accuracy.

## 5. API Endpoint

- `POST /api/v1/reports`

## 6. Data Validation

- All GPS coordinates must be WGS84 (EPSG:4326)
- All timestamps must be ISO8601 with timezone
- All text must be UTF-8
- Photos must be JPEG or PNG, max 10MB
- Free text descriptions max 1000 characters
