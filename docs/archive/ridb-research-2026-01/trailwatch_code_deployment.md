# TrailWatch: Quick Start Code & Deployment

## Setup Checklist

- [ ] GCP project created with Cloud SQL enabled
- [ ] PostgreSQL 15 instance running with PostGIS extension
- [ ] USFS trail data downloaded (113MB geodatabase)
- [ ] FastAPI service code ready for deployment
- [ ] Cloud Run configured for FastAPI
- [ ] RIDB API key (optional) obtained

---

## Quick Python Setup (Local Testing First)

### 1. Local Environment

```bash
# Clone your repo
git clone <your-trailwatch-repo>
cd trailwatch

# Create Python virtual environment
python3.11 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. requirements.txt

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
geoalchemy2==0.14.1
pydantic==2.5.0
pydantic-settings==2.1.0
httpx==0.25.2
python-dotenv==1.0.0
prometheus-client==0.19.0
```

### 3. Local Validation Service (validation_service.py)

```python
"""
FastAPI service for trail GPS validation
Connects to Cloud SQL PostgreSQL with PostGIS
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel, Field
from typing import Optional, List
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# Configuration
# ============================================================================

class Settings:
    """Load settings from environment variables"""
    DB_USER: str = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD: str = os.getenv('DB_PASSWORD', 'your_password')
    DB_HOST: str = os.getenv('DB_HOST', 'localhost')
    DB_PORT: str = os.getenv('DB_PORT', '5432')
    DB_NAME: str = os.getenv('DB_NAME', 'trailwatch')
    
    @property
    def DATABASE_URL(self):
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()

# ============================================================================
# Database Setup
# ============================================================================

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,  # Test connections before using
    pool_recycle=3600,    # Recycle connections every hour
)

SessionLocal = sessionmaker(bind=engine)

# Enable PostGIS on connection
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    dbapi_conn.execute("SELECT load_extension('postgis')")

# ============================================================================
# Request/Response Models
# ============================================================================

class TrailValidationRequest(BaseModel):
    """Incoming validation request"""
    latitude: float = Field(..., ge=-90, le=90, description="WGS84 latitude")
    longitude: float = Field(..., ge=-180, le=180, description="WGS84 longitude")
    tolerance_meters: float = Field(default=50, ge=1, le=500, description="Search radius")
    max_results: int = Field(default=3, ge=1, le=10, description="Max trails to return")

class SnappedPoint(BaseModel):
    """Corrected GPS point snapped to trail"""
    latitude: float
    longitude: float

class TrailResult(BaseModel):
    """Single trail match result"""
    trail_id: str
    trail_name: str
    managing_district: Optional[str]
    length_miles: Optional[float]
    difficulty: Optional[str]
    distance_from_input_meters: float
    snapped_point: SnappedPoint
    confidence: float

class ValidationResponse(BaseModel):
    """Full validation response"""
    valid: bool
    message: str
    closest_trail: Optional[TrailResult]
    nearby_trails: List[TrailResult]
    timestamp: str

# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(
    title="TrailWatch Trail Validation API",
    description="Validate citizen-reported GPS coordinates against USFS trail network",
    version="1.0.0"
)

# ============================================================================
# Endpoints
# ============================================================================

@app.post("/validate-trail-point", response_model=ValidationResponse)
async def validate_trail_point(request: TrailValidationRequest):
    """
    Validate a GPS point against the USFS trail network.
    
    The service finds all trails within the specified tolerance distance
    and returns them sorted by distance from the input point.
    
    ### Parameters:
    - `latitude`: WGS84 latitude (-90 to 90)
    - `longitude`: WGS84 longitude (-180 to 180)  
    - `tolerance_meters`: Search radius (1-500m, default 50m)
    - `max_results`: Number of trails to return (1-10, default 3)
    
    ### Returns:
    - `valid`: Boolean indicating if point is within tolerance of a trail
    - `closest_trail`: Best matching trail with snapped coordinates
    - `nearby_trails`: List of other trails within tolerance
    - `confidence`: 0-1 score based on distance (1.0 = exactly on trail)
    
    ### Example Request:
    ```
    POST /validate-trail-point
    {
        "latitude": 39.0842,
        "longitude": -120.2624,
        "tolerance_meters": 75
    }
    ```
    """
    
    session = SessionLocal()
    
    try:
        # PostGIS spatial query
        # ST_DWithin: checks if geometries are within distance
        # ST_ClosestPoint: finds nearest point on trail from input point
        # ::geography: uses meters instead of degrees for distance
        
        query = text("""
            SELECT 
                trail_id,
                trail_name,
                managing_district,
                length_miles,
                difficulty,
                ST_Distance(
                    geometry, 
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
                ) as distance_meters,
                ST_Y(ST_ClosestPoint(
                    geometry, 
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
                )) as snapped_lat,
                ST_X(ST_ClosestPoint(
                    geometry, 
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
                )) as snapped_lon
            FROM nfs_trails
            WHERE ST_DWithin(
                geometry,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                :tolerance
            )
            ORDER BY distance_meters ASC
            LIMIT :limit
        """)
        
        result = session.execute(query, {
            'lat': request.latitude,
            'lon': request.longitude,
            'tolerance': request.tolerance_meters,
            'limit': request.max_results
        })
        
        trails = []
        for row in result:
            distance = float(row[5])
            confidence = calculate_confidence(distance, request.tolerance_meters)
            
            trail = TrailResult(
                trail_id=str(row[0]),
                trail_name=str(row[1]),
                managing_district=row[2],
                length_miles=float(row[3]) if row[3] else None,
                difficulty=row[4],
                distance_from_input_meters=distance,
                snapped_point=SnappedPoint(
                    latitude=float(row[6]),
                    longitude=float(row[7])
                ),
                confidence=confidence
            )
            trails.append(trail)
        
        # Build response
        if not trails:
            return ValidationResponse(
                valid=False,
                message=f"No trails found within {request.tolerance_meters}m of point",
                closest_trail=None,
                nearby_trails=[],
                timestamp=datetime.utcnow().isoformat()
            )
        
        return ValidationResponse(
            valid=True,
            message=f"Snapped to {trails[0].trail_name}",
            closest_trail=trails[0],
            nearby_trails=trails[1:],
            timestamp=datetime.utcnow().isoformat()
        )
    
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Trail validation error: {str(e)}"
        )
    
    finally:
        session.close()

@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers"""
    session = SessionLocal()
    try:
        # Verify database connection
        session.execute(text("SELECT 1"))
        trail_count = session.execute(text("SELECT COUNT(*) FROM nfs_trails")).scalar()
        
        return {
            "status": "healthy",
            "database": "connected",
            "trails_in_index": trail_count,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {str(e)}")
    finally:
        session.close()

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
    
    return JSONResponse(
        content=generate_latest().decode('utf-8'),
        media_type=CONTENT_TYPE_LATEST
    )

# ============================================================================
# Utility Functions
# ============================================================================

def calculate_confidence(distance_meters: float, tolerance_meters: float) -> float:
    """
    Calculate confidence score (0-1) based on distance from trail.
    
    - 0 meters distance: confidence = 1.0 (exactly on trail)
    - tolerance_meters distance: confidence = 0.0 (at edge of tolerance)
    - Linear interpolation between
    """
    if distance_meters == 0:
        return 1.0
    
    confidence = max(0, 1 - (distance_meters / tolerance_meters))
    return round(confidence, 3)

# ============================================================================
# Startup/Shutdown
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """On service startup"""
    logger.info("TrailWatch validation service starting...")
    logger.info(f"Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    
    try:
        session = SessionLocal()
        session.execute(text("SELECT COUNT(*) FROM nfs_trails"))
        session.close()
        logger.info("✓ Database connection successful")
    except Exception as e:
        logger.error(f"✗ Database connection failed: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """On service shutdown"""
    engine.dispose()
    logger.info("TrailWatch validation service stopped")

# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    # Local development
    uvicorn.run(
        "validation_service:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
```

---

## Cloud Deployment

### Step 1: Create .env.production

```bash
# .env.production (for Cloud Run)
DB_USER=postgres
DB_PASSWORD=$(gcloud secrets versions access latest --secret="db-password")
DB_HOST=<CLOUD_SQL_PRIVATE_IP>
DB_PORT=5432
DB_NAME=trailwatch
```

### Step 2: Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY validation_service.py .

# Expose port
EXPOSE 8000

# Run service
CMD ["uvicorn", "validation_service:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 3: Deploy to Cloud Run

```bash
# Build and push to Artifact Registry
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/trailwatch/validation-service:latest

# Deploy to Cloud Run
gcloud run deploy trailwatch-validation \
  --image us-central1-docker.pkg.dev/PROJECT_ID/trailwatch/validation-service:latest \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 60 \
  --max-instances 100 \
  --set-cloudsql-instances PROJECT_ID:us-central1:trailwatch-postgres \
  --set-env-vars DB_USER=postgres,DB_NAME=trailwatch,DB_HOST=/cloudsql/PROJECT_ID:us-central1:trailwatch-postgres/.s.PGSQL.5432
```

---

## Testing

### Local Test Script

```python
# test_validation.py
import httpx
import json

BASE_URL = "http://127.0.0.1:8000"

async def test_validation():
    async with httpx.AsyncClient() as client:
        # Test: Point near Tahoe Rim Trail
        response = await client.post(
            f"{BASE_URL}/validate-trail-point",
            json={
                "latitude": 39.0842,
                "longitude": -120.2624,
                "tolerance_meters": 100
            }
        )
        
        print("Status:", response.status_code)
        print("Response:", json.dumps(response.json(), indent=2))

# Run: python -m asyncio
# >>> import test_validation
# >>> await test_validation.test_validation()
```

---

## Production Checklist

- [ ] Database backups configured (Cloud SQL automated backups)
- [ ] Connection pooling optimized (pool_size, max_overflow)
- [ ] Spatial indexes created and analyzed
- [ ] Monitoring alerts set up (latency, error rate)
- [ ] CORS configured for frontend domains
- [ ] Rate limiting applied (if needed)
- [ ] Logging centralized (Cloud Logging)
- [ ] Load testing completed (expect <50ms p95 latency)

---

## Cost Optimization Tips

1. **Cloud SQL**: Use shared core instance (db-f1-micro) for testing, scale to custom as needed
2. **Cloud Run**: Set concurrency=50-100, it scales down automatically
3. **Cloud Storage**: Use regional buckets, enable lifecycle policies for old backups
4. **Network**: Use Private Service Connection to avoid egress costs

**Estimated Monthly Cost:**
- Cloud SQL (db-custom-2-8192): ~$165
- Cloud Run (50k requests/day): ~$30-50  
- Cloud Storage: ~$5
- **Total: ~$200-220/month**
