# External Integrations

## RIDB API (Recreation Information Database)
- **Endpoint:** https://ridb.recreation.gov/api/v1/
- **Auth:** API key (free registration)
- **Use for:** Trail registry validation, trail metadata
- **Rate limit:** Respect published limits; cache aggressively
- **Fallback:** If RIDB unavailable, accept report with `trail_validated: false`

```python
# Example query
GET /facilities?query=Pacific+Crest+Trail&state=CA
GET /trails?facilityId=12345
```

## USFS Geodata Clearinghouse
- **Source:** https://data.fs.usda.gov/geodata/edw/datasets.php
- **Format:** ESRI File Geodatabase, Shapefile, GeoJSON
- **Update frequency:** Quarterly
- **Use for:** Trail geometry (line features), management attributes
- **Storage:** Load into PostGIS, refresh quarterly via batch job

## Weather Data (NOAA/USGS)
- **Use for:** Contextualizing reports (recent rain, fire activity)
- **Implementation:** Daily batch pull, not real-time
- **Fields needed:** Precipitation (48h), temperature, fire perimeters
