/**
 * Spatial types for map and location features.
 */

export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
}

export interface GeoJSONLineString {
    type: 'LineString';
    coordinates: [number, number][];
}

export interface MapViewport {
    center: [number, number]; // [lng, lat]
    zoom: number;
    bearing?: number;
    pitch?: number;
}

export interface SpatialInsight {
    id: string;
    type: 'cluster' | 'hotspot' | 'trend' | 'anomaly';
    title: string;
    description: string;
    location: GeoJSONPoint;
    severity: 'low' | 'medium' | 'high';
    report_ids: string[];
    metadata?: Record<string, unknown>;
}

export interface MarkerCluster {
    id: string;
    coordinates: [number, number];
    count: number;
    report_ids: string[];
    expansion_zoom: number;
}
