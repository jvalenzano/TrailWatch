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
    /** Optional bounds to fit instead of center/zoom */
    bounds?: BoundingBox;
    /** Padding when fitting bounds (in pixels) */
    boundsPadding?: number;
}

/**
 * Types of spatial insights that can be detected.
 */
export type SpatialInsightType =
    | 'cluster'
    | 'hotspot'
    | 'trend'
    | 'anomaly'
    | 'duplicate'
    | 'consistency_check';

/**
 * Metadata for cluster-type insights.
 */
export interface ClusterMetadata {
    radius_miles: number;
    time_span_hours: number;
    weather_correlation?: string;
    report_count: number;
}

/**
 * Metadata for duplicate-type insights.
 */
export interface DuplicateMetadata {
    similarity_score: number;
    distance_meters: number;
    original_report_id: string;
    duplicate_report_id: string;
    shared_features: string[];
}

/**
 * Metadata for consistency check insights (bias detection).
 */
export interface ConsistencyCheckMetadata {
    check_type: 'district_bias' | 'temporal_anomaly' | 'geographic_gap';
    affected_districts?: string[];
    expected_distribution?: Record<string, number>;
    actual_distribution?: Record<string, number>;
    deviation_percentage?: number;
    /** Possible causes / explanations for the detected bias */
    explanations?: string[];
}

/**
 * Union type for typed insight metadata.
 */
export type InsightMetadata = ClusterMetadata | DuplicateMetadata | ConsistencyCheckMetadata;

export interface SpatialInsight {
    id: string;
    type: SpatialInsightType;
    title: string;
    description: string;
    location: GeoJSONPoint;
    severity: 'low' | 'medium' | 'high';
    report_ids: string[];
    metadata?: InsightMetadata | Record<string, unknown>;
}

export interface MarkerCluster {
    id: string;
    coordinates: [number, number];
    count: number;
    report_ids: string[];
    expansion_zoom: number;
}
