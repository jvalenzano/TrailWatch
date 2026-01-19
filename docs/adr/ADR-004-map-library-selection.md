# ADR-004: Map Library Selection

## Status

**Accepted** — January 2026

## Context

TrailWatch requires a web mapping library for the Ranger Dashboard to display hazard report locations, trail overlays, and spatial insights. Two primary options were considered:

1. **Google Maps JavaScript API** — FedRAMP authorized, GCP-native billing
2. **MapLibre GL JS** — Open source fork of Mapbox GL JS, free, self-hostable tiles

Key requirements from USER_JOURNEYS.md:
- Sarah (Volunteer Coordinator) explicitly requires **offline capability** for field use in areas without cell coverage
- Rangers need to view 100-500+ markers with clustering
- Future potential for federal contract use (FedRAMP awareness)

## Decision

**Use MapLibre GL JS with Protomaps/PMTiles for tile hosting.**

## Rationale

### Offline Capability is a Hard Requirement

Google Maps requires an active internet connection for tile loading. While the SDK offers limited caching, it:
- Has restrictive licensing for offline use
- Requires Google Maps Platform Premium for full offline support ($$$)
- Cannot use self-hosted tiles

MapLibre + PMTiles enables:
- Fully offline operation with self-hosted tiles
- Tile caching via Service Worker for progressive offline
- No licensing restrictions on tile storage

### FedRAMP Compliance

Google Maps is FedRAMP Moderate authorized, but this is **not a blocker for MapLibre**:
- MapLibre itself is open-source client-side code (no authorization needed)
- FedRAMP compliance depends on **where tiles are served from**
- Tiles hosted on GCP Cloud Storage inherit GCP's FedRAMP authorization
- Protomaps tiles can be self-hosted on any FedRAMP-authorized infrastructure

### Cost at Scale

| Scenario | Google Maps | MapLibre + Protomaps |
|----------|-------------|---------------------|
| 10,000 map loads/month | ~$70/month | $0 (self-hosted) |
| 100,000 map loads/month | ~$700/month | $0 (self-hosted) |
| Offline tile downloads | Premium license required | Free |

### Trade-offs Accepted

- **Smaller community:** MapLibre has fewer Stack Overflow answers than Google Maps
- **Setup complexity:** Requires configuring tile source (Protomaps, Stadia, or self-host)
- **No built-in geocoding:** Address search requires separate service (Nominatim, Photon)

## Consequences

1. **Phase 2 (Traditional UI):** Use MapLibre with Protomaps CDN tiles for initial development
2. **Phase 3 (Offline):** Implement PMTiles + Service Worker for offline tile caching
3. **GEMINI.md:** Updated to reflect MapLibre as the map library
4. **Conductor workflow:** Updated dependencies to use `maplibre-gl` and `pmtiles`

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|-----------------|
| Google Maps | Offline licensing too restrictive |
| Mapbox GL JS | Proprietary license since v2.0; MapLibre is the FOSS fork |
| Leaflet | Less performant for 500+ markers; no vector tile support |
| OpenLayers | Steeper learning curve; overkill for our needs |

## References

- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [Protomaps PMTiles Specification](https://docs.protomaps.com/pmtiles/)
- [FedRAMP Marketplace - Google Maps](https://marketplace.fedramp.gov/)
- TrailWatch USER_JOURNEYS.md — Sarah's offline requirement
