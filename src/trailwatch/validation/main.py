from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel, Field
from typing import Optional
import datetime
import structlog
from sqlalchemy.exc import OperationalError
from sqlalchemy import select

from .database import create_postgis_extensions, create_tables, AsyncSessionFactory
from .queries import find_nearest_trail, calculate_gps_confidence
from .core.logging import setup_logging


class ValidationRequest(BaseModel):
    latitude: float
    longitude: float
    tolerance_meters: int = 50

class SnappedPoint(BaseModel):
    latitude: float
    longitude: float

class ValidationResponse(BaseModel):
    valid: bool
    distance_meters: Optional[float] = None
    snapped_point: Optional[SnappedPoint] = None
    trail_id: Optional[str] = None
    trail_name: Optional[str] = None
    managing_district: Optional[str] = None
    gps_confidence: float
    error_mode: Optional[str] = None


@asynccontextmanager
async def lifecycle(app: FastAPI):
    """Lifecycle function to run on startup and shutdown."""
    setup_logging()
    # For now, we don't run this automatically. The user will be instructed to run the setup scripts.
    # print("Creating PostGIS extensions...")
    # await create_postgis_extensions()
    # print("PostGIS extensions created.")
    # print("Creating tables...")
    # await create_tables()
    # print("Tables created.")
    yield


app = FastAPI(
    title="TrailWatch Trail Validation Service",
    description="A service to validate GPS coordinates against USFS trail data.",
    version="0.1.0",
    lifespan=lifecycle,
)


@app.get("/")
async def root():
    return {"message": "Trail Validation Service is running."}

import datetime

class HealthResponse(BaseModel):
    status: str
    database_status: str
    data_freshness: str
    last_import_timestamp: Optional[str] = None

@app.get("/health", response_model=HealthResponse)
async def health_check():
    db_status = "connected"
    try:
        # A simple query to check db connection
        async with AsyncSessionFactory() as session:
            await session.execute(select(1))
    except OperationalError:
        db_status = "disconnected"

    last_import_str = None
    freshness = "stale"
    try:
        with open("last_import_timestamp.txt", "r") as f:
            last_import_str = f.read().strip()
        last_import_time = datetime.datetime.fromisoformat(last_import_str)
        if (datetime.datetime.utcnow() - last_import_time).days <= 90:
            freshness = "fresh"
    except FileNotFoundError:
        freshness = "unknown"
    except Exception:
        freshness = "error"

    return HealthResponse(
        status="ok",
        database_status=db_status,
        data_freshness=freshness,
        last_import_timestamp=last_import_str
    )

logger = structlog.get_logger()

@app.post("/validate-trail-point", response_model=ValidationResponse)
async def validate_trail_point(request: ValidationRequest):
    logger.info("Validation request received", request=request.dict())
    try:
        trail, distance, snapped_point_coords = await find_nearest_trail(
            request.latitude,
            request.longitude,
            request.tolerance_meters
        )

        confidence = calculate_gps_confidence(distance)

        if trail:
            response = ValidationResponse(
                valid=True,
                distance_meters=distance,
                snapped_point=SnappedPoint(latitude=snapped_point_coords[0], longitude=snapped_point_coords[1]),
                trail_id=str(trail.id),
                trail_name=trail.name,
                managing_district=trail.managing_district,
                gps_confidence=confidence,
            )
        else:
            response = ValidationResponse(valid=False, gps_confidence=confidence)
        
        logger.info("Validation response", response=response.dict())
        return response

    except OperationalError as e:
        logger.error("Database operational error", error=str(e))
        return ValidationResponse(valid=False, gps_confidence=0.0, error_mode="SERVICE_UNAVAILABLE")
    except Exception as e:
        logger.error("Unhandled exception during validation", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
