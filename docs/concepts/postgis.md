# PostGIS

PostGIS is a spatial database extension for PostgreSQL that adds support for geographic objects and location-based queries. It transforms PostgreSQL into a full Geographic Information System (GIS) database.

## What It Does

PostGIS adds spatial data types (geometry, geography), functions, and indexes that let you store and query location data efficiently. You can store points (lat/long coordinates), lines (trails), and polygons (wilderness boundaries, ranger districts), then run queries like:

- "Is this GPS coordinate within 50 meters of any official USFS trail?"
- "Which trails intersect the Shasta-Trinity National Forest boundary?"
- "Find all hazard reports within 2 miles of Trail #1234"

## Why TrailWatch Needs It

The USFS Geodata Clearinghouse publishes official trail geometry as shapefiles and GeoJSON. To validate that a citizen's GPS coordinates actually fall on or near a real trail (not in the middle of a lake or 500 miles from their claimed location), we need to compare their submitted point against official trail linestrings.

PostGIS makes these spatial comparisons fast through specialized indexing (R-trees via GiST indexes). Without it, you'd be doing point-in-polygon and distance calculations in application code, iterating through potentially millions of coordinate pairs. PostGIS handles this at the database level with optimized C libraries (GEOS for geometry operations, PROJ for coordinate transformations).

## How We Use It

Cloud SQL for PostgreSQL supports PostGIS as an extension. Enable it with:

```sql
CREATE EXTENSION postgis;
```

From there, you can load USFS trail geometry and run spatial queries against citizen-submitted coordinates.

Example validation query:

```sql
SELECT t.trail_name, ST_Distance(
    ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography,
    t.geometry::geography
) AS distance_meters
FROM usfs_trails t
WHERE ST_DWithin(
    ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography,
    t.geometry::geography,
    100  -- within 100 meters
);
```

## Key Concepts

**SRID 4326**: The coordinate reference system for GPS coordinates (WGS 84). Always set this explicitly when creating points from lat/long.

**Geometry vs Geography**: Geometry uses planar math (faster, less accurate over large distances). Geography uses spherical math (slower, accurate anywhere on Earth). For trail validation, use geography types.

**GiST Index**: The spatial index type that makes PostGIS queries fast. Always create one on your geometry columns.

## Related Resources

- [PostGIS Documentation](https://postgis.net/documentation/)
- [USFS Geodata Clearinghouse](https://data.fs.usda.gov/geodata/)
- ADR-001: Trail Validation Architecture

## TrailWatch Context

This technology powers the Trail Validation Service track, which validates citizen-submitted GPS coordinates against official USFS trail data. See ADR-001 for the architectural decision that scoped this work.
