import httpx
import zipfile
import os
import geopandas as gpd
import datetime
from .core.config import settings
from .database import async_engine, AsyncSessionFactory
from .models import Trail
from geoalchemy2 import Geometry

async def download_usfs_geodata():
    """Downloads the USFS geodata zip file."""
    print(f"Downloading USFS geodata from {settings.USFS_GEODATA_URL}...")
    async with httpx.AsyncClient() as client:
        response = await client.get(settings.USFS_GEODATA_URL, follow_redirects=True)
        response.raise_for_status()

    with open("usfs_geodata.zip", "wb") as f:
        f.write(response.content)

    print("USFS geodata downloaded to usfs_geodata.zip")

def unzip_geodata():
    """Unzips the geodata file."""
    print("Unzipping usfs_geodata.zip...")
    with zipfile.ZipFile("usfs_geodata.zip", 'r') as zip_ref:
        zip_ref.extractall("usfs_geodata")
    print("Unzipped to usfs_geodata/")

async def import_geodata():
    """Reads the geodatabase, validates schema, and imports to PostGIS."""
    print("Starting geodata import...")

    # Find the .gdb directory
    gdb_path = None
    for root, dirs, files in os.walk("usfs_geodata"):
        for d in dirs:
            if d.endswith(".gdb"):
                gdb_path = os.path.join(root, d)
                break
        if gdb_path:
            break

    if not gdb_path:
        raise Exception("No .gdb directory found in the unzipped geodata.")

    print(f"Found geodatabase at: {gdb_path}")

    # Read the geodatabase
    gdf = gpd.read_file(gdb_path)

    # Schema validation
    required_cols = {'TRAIL_NAME', 'MANAGING_ORG', 'geometry'}
    if not required_cols.issubset(gdf.columns):
        raise Exception(f"Geodatabase schema is missing required columns. Found: {gdf.columns}")

    # Rename and select columns
    gdf = gdf[['TRAIL_NAME', 'MANAGING_ORG', 'geometry']]
    gdf = gdf.rename(columns={
        'TRAIL_NAME': 'name',
        'MANAGING_ORG': 'managing_district',
        'geometry': 'geom'
    })

    # Insert into PostGIS
    print("Inserting data into PostGIS...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Trail.__table__.drop, checkfirst=True)
        await conn.run_sync(Trail.__table__.create)

    async with AsyncSessionFactory() as session:
        for _, row in gdf.iterrows():
            trail = Trail(
                name=row['name'],
                managing_district=row['managing_district'],
                geom=row['geom'].wkt
            )
            session.add(trail)
        await session.commit()

import datetime

    # ... (rest of the function)

    print("Geodata import complete.")
    with open("last_import_timestamp.txt", "w") as f:
        f.write(datetime.datetime.utcnow().isoformat())
    with open("last_import_timestamp.txt", "w") as f:
        f.write(datetime.datetime.utcnow().isoformat())
