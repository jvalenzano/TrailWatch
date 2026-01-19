/**
 * TRACS Category types for trail hazard classification.
 * See GEMINI.md for category mapping reference.
 */

export type TRACSCategoryCode = 'CLR' | 'DRN' | 'GRD' | 'STR' | 'SGN' | 'TRD' | 'OTH';

export interface TRACSCategory {
    code: TRACSCategoryCode;
    name: string;
    description: string;
}

export type SeverityCode = 'SEV0' | 'SEV1' | 'SEV2' | 'SEV3';

export interface Severity {
    code: SeverityCode;
    name: string;
    description: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    accuracy_meters?: number;
}

export interface ConfidenceFactors {
    has_photo: boolean;
    photo_matches_hazard: boolean;
    gps_accurate: boolean;
    description_specific: boolean;
    reporter_trusted: boolean;
    corroborating_reports: number;
    weather_context?: string;
}

export interface TriageResult {
    tracs_category: TRACSCategoryCode;
    tracs_category_name: string;
    severity: SeverityCode;
    severity_name: string;
    confidence_score: number;
    confidence_factors: ConfidenceFactors;
    recommended_action: string;
    similar_reports: string[];
}

export interface HazardReport {
    id: string;
    trail_id?: string;
    trail_name?: string;
    location: Location;
    hazard_type: string;
    severity_estimate: 'passable' | 'difficult' | 'impassable' | 'dangerous';
    description: string;
    photos: string[];
    reporter_type: 'anonymous' | 'volunteer' | 'coordinator';
    reporter_organization?: string;
    triage_result?: TriageResult;
    submitted_at: string;
    triaged_at?: string;
    reviewed_at?: string;
    resolved_at?: string;
}
