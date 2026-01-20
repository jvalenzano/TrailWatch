/**
 * Map utility functions for spatial calculations.
 */
import type { HazardReport } from '../types/report';
import type { BoundingBox, SpatialInsight } from '../types/spatial';

/**
 * Calculate a bounding box that encompasses all given coordinates.
 */
export function calculateBounds(coordinates: [number, number][]): BoundingBox | null {
    if (coordinates.length === 0) return null;

    let west = Infinity;
    let east = -Infinity;
    let south = Infinity;
    let north = -Infinity;

    for (const [lng, lat] of coordinates) {
        west = Math.min(west, lng);
        east = Math.max(east, lng);
        south = Math.min(south, lat);
        north = Math.max(north, lat);
    }

    return { north, south, east, west };
}

/**
 * Calculate bounding box from an array of reports.
 */
export function calculateBoundsFromReports(reports: HazardReport[]): BoundingBox | null {
    if (reports.length === 0) return null;

    const coordinates: [number, number][] = reports.map((r) => [
        r.location.longitude,
        r.location.latitude,
    ]);

    return calculateBounds(coordinates);
}

/**
 * Calculate bounding box from a spatial insight and its associated reports.
 */
export function calculateInsightBounds(
    insight: SpatialInsight,
    allReports: HazardReport[]
): BoundingBox | null {
    // Get reports matching the insight's report_ids
    const insightReports = allReports.filter((r) =>
        insight.report_ids.includes(r.id)
    );

    // If only one report or no reports, use a fixed padding around the insight center
    if (insightReports.length <= 1) {
        const [lng, lat] = insight.location.coordinates;
        const padding = 0.01; // ~1km at mid-latitudes
        return {
            north: lat + padding,
            south: lat - padding,
            east: lng + padding,
            west: lng - padding,
        };
    }

    return calculateBoundsFromReports(insightReports);
}

/**
 * Expand a bounding box by a percentage.
 */
export function expandBounds(bounds: BoundingBox, percentage: number = 0.1): BoundingBox {
    const lngRange = bounds.east - bounds.west;
    const latRange = bounds.north - bounds.south;

    const lngPadding = lngRange * percentage;
    const latPadding = latRange * percentage;

    return {
        north: bounds.north + latPadding,
        south: bounds.south - latPadding,
        east: bounds.east + lngPadding,
        west: bounds.west - lngPadding,
    };
}

/**
 * Convert a BoundingBox to MapLibre LngLatBoundsLike format.
 */
export function boundsToLngLatBounds(
    bounds: BoundingBox
): [[number, number], [number, number]] {
    return [
        [bounds.west, bounds.south], // SW corner
        [bounds.east, bounds.north], // NE corner
    ];
}
