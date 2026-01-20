/**
 * District types for batch assignment functionality.
 * Districts represent USFS administrative units containing trails and crews.
 */

/**
 * A USFS Ranger District
 */
export interface District {
    /** Unique identifier */
    id: string;
    /** Human-readable district name */
    name: string;
    /** District number (e.g., 05 for Gifford Pinchot) */
    number: number;
    /** IDs of crews typically assigned to this district */
    default_crew_ids?: string[];
}

/**
 * AI-suggested district for batch assignment
 */
export interface DistrictSuggestion {
    /** ID of the suggested district */
    district_id: string;
    /** Human-readable reason for the suggestion */
    reason: string;
    /** Number of selected reports that match this district */
    matching_reports: number;
}

/**
 * Response from /api/districts endpoint
 */
export interface DistrictsResponse {
    districts: District[];
    /** Optional suggestion based on selected reports */
    suggestion?: DistrictSuggestion;
}

/**
 * Status of a district boundary for map rendering.
 */
export type DistrictBoundaryStatus = 'active' | 'inactive';

/**
 * District boundary for map rendering with GeoJSON geometry.
 */
export interface DistrictBoundary {
    /** Unique identifier */
    id: string;
    /** Human-readable district name */
    name: string;
    /** Status for color coding */
    status: DistrictBoundaryStatus;
    /** GeoJSON Polygon geometry */
    geometry: GeoJSON.Polygon;
}
