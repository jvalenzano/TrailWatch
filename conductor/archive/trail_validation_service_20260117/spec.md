# Specification: Trail Validation Service

## 1. Objective

To implement a standalone, PostGIS-backed microservice, the "Trail Validation Service," that validates a given GPS coordinate against the official USFS trail dataset. This service will provide the core logic for the `gps_accurate` confidence factor used by the main Intake Agent, as decided in [ADR-001](docs/adr/ADR-001-trail-validation-architecture.md).

## 2. Technical Requirements

- **Backend Framework:** FastAPI
- **Database:** PostgreSQL with the PostGIS extension.
- **Database Driver:** `asyncpg` for fully asynchronous database operations.
- **ORM:** SQLAlchemy with `asyncio` support.
- **Deployment:** Google Cloud Run.
- **Configuration:** Key values, especially the USFS Geodata URL, must be configurable via environment variables.

## 3. Core Functionality

### 3.1. Data Ingestion

- A process (initially manual, later automated) to download the USFS National Forest System Trails dataset (in Geodatabase format) from the USFS Geodata Clearinghouse.
- A data loading script to parse the geodatabase and ingest the trail geometries (LineStrings) and relevant attributes (`trail_id`, `trail_name`, `managing_district`) into the PostGIS database.

### 3.2. Validation API Endpoint

The service will expose a primary endpoint for validation.

**Endpoint:** `POST /validate-trail-point`

**Request Body:**

```json
{
  "latitude": 39.0842,
  "longitude": -120.2624,
  "tolerance_meters": 100
}
```

**Success Response (200 OK):**

The response includes the validation result, the distance to the nearest trail, the snapped point on the trail, and a calculated confidence score.

```json
{
  "valid": true,
  "distance_meters": 23.4,
  "snapped_point": { "latitude": 39.0845, "longitude": -120.2621 },
  "trail_id": "USFS-CA-2024-001",
  "trail_name": "Tahoe Rim Trail",
  "managing_district": "Lake Tahoe Basin Management Unit",
  "gps_confidence": 0.73,
  "error_mode": null
}
```

**Failure/Degradation Response (200 OK):**

If the service cannot process the request (e.g., database down, data stale), it must respond gracefully without erroring, indicating the degradation mode.

```json
{
  "valid": false,
  "distance_meters": null,
  "snapped_point": null,
  "trail_id": null,
  "trail_name": null,
  "managing_district": null,
  "gps_confidence": 0.0,
  "error_mode": "SERVICE_UNAVAILABLE"
}
```

### 3.3. Health Check Endpoint

A `/health` endpoint is required for monitoring and operational visibility.

**Endpoint:** `GET /health`

**Response Body:**

```json
{
  "status": "ok",
  "database_status": "connected",
  "data_freshness": "fresh",
  "last_import_timestamp": "2026-01-15T10:00:00Z"
}
```

- `data_freshness` should be "stale" if the `last_import_timestamp` is older than the expected refresh cycle (e.g., 90 days).

## 4. GPS Confidence Mapping Logic

The `gps_confidence` score returned by the service will be calculated based on the distance from the provided point to the nearest trail, as specified in ADR-001.

- **Distance <= 20 meters:** `gps_confidence = 1.0`
- **20m < Distance <= 50 meters:** Linear interpolation from 1.0 down to 0.5.
- **50m < Distance <= 100 meters:** Linear interpolation from 0.5 down to 0.0.
- **Distance > 100 meters:** `gps_confidence = 0.0`

This score will be directly consumed by the Intake Agent as the `gps_accurate` factor in its overall report confidence calculation.

## 5. Automation

- A recurring job (e.g., Cloud Scheduler) will be implemented to trigger the USFS data download and database refresh on a quarterly basis.
- This process must include validation and alerting to prevent silent failures (e.g., if the data format changes or the download fails).