# TrailWatch RIDB Integration Guide: Practical Implementation

## Executive Summary

**The bottom line:** RIDB does NOT contain USFS trail geometry. Use USFS Geodata Clearinghouse bulk downloads + PostGIS instead. This guide covers both the architectural decision and step-by-step implementation.

---

## Part 1: Understanding the Data Landscape

### Why RIDB is NOT Suitable for Trail Validation

RIDB (Recreation Information Database) is designed for recreation.gov resources:
- ✅ Campgrounds, campsites, facilities
- ✅ Recreation areas, permit entrances, tours
- ✅ Activities and events
- ❌ **Trail geometry (LineStrings/polylines)**
- ❌ **USFS trail network data**
- ❌ **Spatial queries (lat/lon radius)**

**Confirmed by:** 
- GitHub recdotgov-client analysis shows NO `/trails` endpoint for USFS trails
- 2015 API Evangelist review noted RIDB endpoints don't include trail geometry
- RIDB documentation focuses on facilities/campgrounds

### The Right Data Source: National Forest System Trails

**Location:** data.fs.usda.gov/geodata/edw/datasets.php

**Dataset:** "National Forest System Trails"
- Last updated: Sep 21, 2025
- Format: ESRI geodatabase (113MB), shapefile (233MB), GeoJSON, GeoPackage, CSV
- Contains: Trail LineStrings (full path geometry), trail names, IDs, managing districts
- Maintained by: USDA Forest Service Geospatial Office

**Example trail record:**
```json
{
  "OBJECTID": 12345,
  "TRAIL_ID": "USFS-CA-2024-001",
  "TRAIL_NAME": "Tahoe Rim Trail",
  "MANAGING_DISTRICT": "Lake Tahoe Basin Management Unit",
  "ORGANIZATION": "US Forest Service",
  "GEOMETRY": "LineString(...coordinates...)",
  "LENGTH_MILES": 165.5,
  "DIFFICULTY": "Moderate",
  "LAST_UPDATED": "2025-09-21"
}
```

---

## Part 2: Architecture Decision

### Why Bulk Download + PostGIS is Better Than Real-time API

| Factor | API Approach | Bulk + PostGIS |
|--------|-------------|-----------------|
| **Trail geometry available** | ❌ No | ✅ Yes |
| **Real-time updates** | ✅ Would need polling | ❌ Quarterly sufficient |
| **Spatial query support** | ❌ No native support | ✅ PostGIS native |
| **Query performance** | N/A | ✅ <50ms with index |
| **Your expected load** (100-500 req/day) | Would be overkill if existed | ✅ Perfect fit |
| **Maintenance burden** | Monitor API changes | ✅ Simple quarterly refresh |
| **GCP cost** | Free (but no data) | ~$150-200/mo Cloud SQL |
| **Implementation time** | 2-3 days | 3-5 days |

**Decision:** **Bulk download + PostGIS is the correct choice.**

---

## Part 3: Step-by-Step Implementation

### Step 1: Download USFS Trail Data

**Option A: Manual Download (one-time setup)**
```bash
# Visit: data.fs.usda.gov/geodata/edw/datasets.php?xmlKeyword=trails
# Download: "National Forest System Trails" → ESRI geodatabase format
# File: National_Forest_System_Trails.gdb (113MB)

# Copy to GCP Cloud Storage
gsutil cp National_Forest_System_Trails.gdb gs://your-bucket/trail-data/
```

**Option B: Automated Download Script (for quarterly refreshes)**
```python
# Pseudo-code for Cloud Functions (triggered quarterly)
import requests
import subprocess
from datetime import datetime

def download_trail_data_quarterly(request):
    """Cloud Function triggered by Cloud Scheduler"""
    
    # 1. Access USFS Geodata API (if available) or scrape download page
    # For now: manual download, but could be automated with proper API
    
    # 2. Download to Cloud Storage
    timestamp = datetime.now().strftime("%Y%m%d")
    gcs_path = f"gs://trails-data/nfs-trails-{timestamp}.gdb"
    
    # 3. Import to Cloud SQL
    import_command = f"""
    gcloud sql import sql {CLOUD_SQL_INSTANCE} \
      gs://trails-data/nfs-trails-{timestamp}.sql \
      --database=trailwatch
    """
    
    # 4. Rebuild spatial indexes
    # psql connection...
    
    return {"status": "success", "timestamp": timestamp}
```

### Step 2: Set Up Cloud SQL with PostGIS

**Create Cloud SQL Instance (if not already existing):**
```bash
# Using gcloud CLI
gcloud sql instances create trailwatch-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-8192 \
  --region=us-central1

# Initialize database
gcloud sql databases create trailwatch \
  --instance=trailwatch-postgres

# Enable PostGIS extension
gcloud sql connect trailwatch-postgres --user=postgres
# Then in psql:
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

**Create Trail Table Schema:**
```sql
-- Clean schema optimized for spatial queries
CREATE TABLE nfs_trails (
    objectid SERIAL PRIMARY KEY,
    trail_id VARCHAR(100) UNIQUE NOT NULL,
    trail_name VARCHAR(255) NOT NULL,
    managing_district VARCHAR(255),
    organization VARCHAR(255),
    geometry GEOMETRY(LineString, 4326) NOT NULL,  -- WGS84
    length_miles NUMERIC(10, 2),
    difficulty VARCHAR(50),
    surface_type VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_source VARCHAR(100) DEFAULT 'USFS-Geodata'
);

-- Create spatial index (CRITICAL for performance)
CREATE INDEX idx_nfs_trails_geom ON nfs_trails USING GIST(geometry);

-- Create attribute indexes for filtering
CREATE INDEX idx_nfs_trails_district ON nfs_trails(managing_district);
CREATE INDEX idx_nfs_trails_name ON nfs_trails(trail_name);

-- Grant read access to app service account
GRANT SELECT ON nfs_trails TO trailwatch_app;
```

### Step 3: Import ESRI Geodatabase to PostGIS

**Method: Using ogr2ogr (GDAL)**

```bash
# Option A: From Cloud Shell
ogr2ogr -f PostgreSQL \
  "PG:host=CLOUDSQL_PUBLIC_IP user=postgres password=$DB_PASSWORD dbname=trailwatch" \
  National_Forest_System_Trails.gdb \
  -nln nfs_trails \
  -overwrite \
  -lco GEOMETRY_NAME=geometry \
  -progress

# Option B: Using Python in Cloud Run (more reliable)
from osgeo import ogr
import psycopg2

def import_gdb_to_postgis():
    """Import ESRI geodatabase to Cloud SQL"""
    
    # Open geodatabase
    driver = ogr.GetDriverByName("FileGDB")
    gdb = driver.Open("gs://trails-data/nfs-trails.gdb")
    layer = gdb.GetLayer(0)
    
    # Connect to Cloud SQL
    conn = psycopg2.connect(
        host=os.environ['CLOUDSQL_HOST'],
        database='trailwatch',
        user='postgres',
        password=os.environ['DB_PASSWORD']
    )
    cur = conn.cursor()
    
    # Clear existing data
    cur.execute("TRUNCATE TABLE nfs_trails")
    
    # Import features
    feature_count = 0
    for feature in layer:
        geom_wkt = feature.GetGeometryRef().ExportToWkt()
        trail_data = {
            'trail_id': feature.GetField('TRAIL_ID'),
            'trail_name': feature.GetField('TRAIL_NAME'),
            'district': feature.GetField('MANAGING_DISTRICT'),
            'org': feature.GetField('ORGANIZATION'),
            'geom_wkt': geom_wkt,
            'length': feature.GetField('LENGTH_MILES'),
        }
        
        cur.execute("""
            INSERT INTO nfs_trails 
            (trail_id, trail_name, managing_district, organization, geometry, length_miles)
            VALUES (%(trail_id)s, %(trail_name)s, %(district)s, %(org)s, 
                    ST_GeomFromText(%(geom_wkt)s, 4326), %(length)s)
        """, trail_data)
        
        feature_count += 1
        if feature_count % 1000 == 0:
            print(f"Imported {feature_count} trails...")
            conn.commit()
    
    conn.commit()
    print(f"Import complete: {feature_count} trails")
    
    # Rebuild spatial index
    cur.execute("REINDEX INDEX idx_nfs_trails_geom")
    conn.commit()
    conn.close()
```

### Step 4: Build Trail Validation FastAPI Endpoint

**Core Validation Logic:**
```python
from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import Optional
import os

app = FastAPI()

# Cloud SQL connection
DATABASE_URL = f"""postgresql://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}@
{os.environ['CLOUDSQL_HOST']}/trailwatch"""

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)

@app.post("/validate-trail-point")
async def validate_trail_point(
    latitude: float,
    longitude: float,
    tolerance_meters: float = 50,
    max_results: int = 3
):
    """
    Validate GPS coordinate against USFS trail network.
    
    Args:
        latitude: WGS84 latitude (-90 to 90)
        longitude: WGS84 longitude (-180 to 180)
        tolerance_meters: Search radius for nearby trails (default 50m)
        max_results: Number of matching trails to return
    
    Returns:
        List of matching trails with snapped coordinates
    
    Example:
        POST /validate-trail-point
        {
            "latitude": 39.0842,
            "longitude": -120.2624,
            "tolerance_meters": 100
        }
    """
    
    # Validate input
    if not (-90 <= latitude <= 90):
        raise HTTPException(status_code=400, detail="Invalid latitude")
    if not (-180 <= longitude <= 180):
        raise HTTPException(status_code=400, detail="Invalid longitude")
    
    session = SessionLocal()
    
    try:
        # PostGIS query: ST_DWithin checks distance, returns results sorted by distance
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
                ST_Y(ST_ClosestPoint(geometry, 
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))) as snapped_lat,
                ST_X(ST_ClosestPoint(geometry, 
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))) as snapped_lon
            FROM nfs_trails
            WHERE ST_DWithin(
                geometry,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                :tolerance
            )
            ORDER BY distance_meters
            LIMIT :limit
        """)
        
        result = session.execute(query, {
            'lat': latitude,
            'lon': longitude,
            'tolerance': tolerance_meters,
            'limit': max_results
        })
        
        trails = []
        for row in result:
            trails.append({
                'trail_id': row[0],
                'trail_name': row[1],
                'managing_district': row[2],
                'length_miles': float(row[3]) if row[3] else None,
                'difficulty': row[4],
                'distance_from_input_meters': float(row[5]),
                'snapped_point': {
                    'latitude': float(row[6]),
                    'longitude': float(row[7])
                },
                'confidence': calculate_confidence(row[5], tolerance_meters)
            })
        
        if not trails:
            return {
                'valid': False,
                'message': f'No trails found within {tolerance_meters}m',
                'trails': []
            }
        
        return {
            'valid': True,
            'closest_trail': trails[0],
            'nearby_trails': trails,
            'message': f"Snapped to {trails[0]['trail_name']}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    finally:
        session.close()


def calculate_confidence(distance_meters: float, tolerance_meters: float) -> float:
    """Calculate confidence score (0-1) based on distance"""
    if distance_meters == 0:
        return 1.0
    confidence = max(0, 1 - (distance_meters / tolerance_meters))
    return round(confidence, 3)


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}
```

**Example Response:**
```json
{
  "valid": true,
  "closest_trail": {
    "trail_id": "USFS-CA-2024-001",
    "trail_name": "Tahoe Rim Trail",
    "managing_district": "Lake Tahoe Basin Management Unit",
    "length_miles": 165.5,
    "difficulty": "Moderate",
    "distance_from_input_meters": 23.4,
    "snapped_point": {
      "latitude": 39.0845,
      "longitude": -120.2621
    },
    "confidence": 0.532
  },
  "nearby_trails": [
    { "trail_id": "...", "distance_from_input_meters": 23.4, ... },
    { "trail_id": "...", "distance_from_input_meters": 145.2, ... }
  ],
  "message": "Snapped to Tahoe Rim Trail"
}
```

### Step 5: Quarterly Update Automation

**Cloud Scheduler + Cloud Function:**
```python
# deployed_function.py - triggered by Cloud Scheduler (monthly)

import functions_framework
from google.cloud import storage
from datetime import datetime
import subprocess
import os

@functions_framework.http
def quarterly_trail_update(request):
    """
    Quarterly trail data refresh from USFS Geodata.
    Triggered by Cloud Scheduler at 2AM UTC on 1st of each quarter.
    """
    
    try:
        # 1. Download latest data
        download_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        local_path = f"/tmp/nfs-trails-{download_timestamp}.gdb"
        gcs_path = f"gs://trails-data/nfs-trails-{download_timestamp}.gdb"
        
        # For automation, you'd need:
        # a) USFS to provide automated download link, OR
        # b) Use wget/curl to download from known URL, OR
        # c) Implement API scraping
        
        print(f"[{download_timestamp}] Starting quarterly trail data update...")
        
        # 2. Validate download
        storage_client = storage.Client()
        bucket = storage_client.bucket('trails-data')
        blob = bucket.blob(f"nfs-trails-{download_timestamp}.gdb")
        
        if not blob.exists():
            return {"status": "error", "message": "Download failed"}
        
        # 3. Import to Cloud SQL
        import_result = subprocess.run([
            'gcloud', 'sql', 'import', 'sql',
            os.environ['CLOUD_SQL_INSTANCE'],
            gcs_path,
            '--database=trailwatch'
        ], capture_output=True, text=True)
        
        if import_result.returncode != 0:
            return {"status": "error", "details": import_result.stderr}
        
        # 4. Rebuild indexes
        # (via separate SQL connection or gcloud sql connect)
        
        return {
            "status": "success",
            "timestamp": download_timestamp,
            "records_imported": "pending_verification",
            "next_update": "next_quarter"
        }
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

**Deploy to Cloud Scheduler:**
```bash
# Create Cloud Function
gcloud functions deploy quarterly_trail_update \
  --runtime python311 \
  --trigger-topic trail-update-trigger \
  --entry-point quarterly_trail_update

# Create Cloud Scheduler job (runs 1st of each quarter at 2 AM UTC)
gcloud scheduler jobs create pubsub quarterly-trail-sync \
  --location us-central1 \
  --schedule "0 2 1 */3 *" \
  --time-zone "UTC" \
  --topic trail-update-trigger \
  --message-body '{}'
```

---

## Part 4: RIDB Integration (Optional Enrichment)

### Use RIDB for Context Data (NOT Trail Geometry)

While RIDB doesn't have trail geometry, it's useful for:
- Recreation area context
- Permit entrance associations
- Organization/district metadata
- Activities available at each area

**Register for RIDB API Key:**
1. Visit: https://ridb.recreation.gov/access-agreement-ridb
2. Accept terms
3. Fill registration form
4. **Timeline:** Instant to 1-2 days (usually instant)
5. Receive API key via email

**Example RIDB Enrichment Query:**
```python
import httpx

async def get_recreation_area_context(trail_id: str, api_key: str):
    """Optionally enrich trail data with RIDB context"""
    
    async with httpx.AsyncClient() as client:
        # Query RIDB for recreation areas by organization
        response = await client.get(
            "https://ridb.recreation.gov/api/v1/recareas",
            params={
                "query": "Lake Tahoe",  # example
                "limit": 50
            },
            headers={"apikey": api_key}
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('RECDATA', [])
        
        return None
```

**Data freshness note:** RIDB is updated regularly; bulk downloads available at ridb.recreation.gov/download if you want to cache it locally.

---

## Part 5: Performance Optimization

### Query Performance Targets

With proper spatial indexing:
- **Single trail lookup:** <20ms
- **Bulk validation (10 points):** <200ms
- **Your load (100-500 req/day):** Single Cloud SQL instance sufficient

### Monitoring & Alerts

```python
# Add to FastAPI startup
from prometheus_client import Counter, Histogram, generate_latest
import time

validation_count = Counter('trail_validations_total', 'Total validations')
validation_latency = Histogram('trail_validation_latency_seconds', 'Query latency')
validation_errors = Counter('trail_validation_errors', 'Validation errors')

@app.post("/validate-trail-point")
async def validate_trail_point(...):
    start = time.time()
    try:
        # ... validation logic ...
        validation_count.inc()
        return result
    except Exception as e:
        validation_errors.inc()
        raise
    finally:
        validation_latency.observe(time.time() - start)

@app.get("/metrics")
async def metrics():
    """Expose Prometheus metrics for Cloud Monitoring"""
    return generate_latest()
```

---

## Part 6: Data Freshness & Versioning

### Current Data Status
- **Last refresh:** September 21, 2025
- **Maintenance:** USFS refreshes quarterly
- **Your sync frequency:** Monthly (ahead of USFS schedule)

### Versioning Strategy
```sql
-- Track data versions
CREATE TABLE trail_data_versions (
    version_id SERIAL PRIMARY KEY,
    usfs_refresh_date DATE NOT NULL,
    import_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_count INT,
    status VARCHAR(50),  -- 'active', 'archived'
    notes TEXT
);

-- Insert after each import
INSERT INTO trail_data_versions (usfs_refresh_date, record_count, status)
VALUES (CURRENT_DATE, (SELECT COUNT(*) FROM nfs_trails), 'active');
```

---

## Summary & Next Steps

### Decision Recap
✅ **Use:** USFS Geodata Clearinghouse + PostGIS (bulk download quarterly)
❌ **Don't use:** RIDB API for trail geometry (it doesn't have it)
✓ **Do use:** RIDB API for optional enrichment (permits, recreation areas)

### Implementation Phases

1. **Week 1:** Set up Cloud SQL, download NFS Trails, import to PostGIS
2. **Week 2:** Build FastAPI validation endpoint, test locally
3. **Week 3:** Deploy to Cloud Run, integrate with citizen app
4. **Week 4:** Set up quarterly automation, monitoring, error handling

### Cost Estimate (Annual)
- Cloud SQL (db-custom-2-8192): ~$2,000/year
- Cloud Run (validation endpoint): ~$500/year (~50k requests/day at 500 QPS)
- Cloud Storage (backups): <$100/year
- **Total:** ~$2,600/year for production-grade system

### Files to Keep

1. **NFS Trails geodatabase** - gs://your-bucket/trail-data/nfs-trails-*.gdb
2. **Database schema SQL** - schema.sql (versionable in GitHub)
3. **FastAPI service** - validation_service.py (in your repo)
4. **Cloud Function** - quarterly_update.py (for automation)

---

## Questions & Support

**If RIDB API keys don't work:** Contact ridb@recreation.gov with your use case

**For USFS trail data questions:** SM.FS.data@usda.gov

**For PostGIS spatial query help:** PostGIS documentation (postgis.net) has excellent spatial join examples
