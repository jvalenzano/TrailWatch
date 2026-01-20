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

/**
 * Step type for reasoning chain visualization.
 * Represents the AI analysis pipeline stages.
 */
export type ReasoningStepType = 'vision' | 'spatial' | 'policy';

/**
 * Status of a reasoning step.
 */
export type ReasoningStepStatus = 'pending' | 'processing' | 'complete' | 'skipped';

/**
 * Individual step in the AI reasoning chain.
 */
export interface ReasoningStep {
    type: ReasoningStepType;
    label: string;
    status: ReasoningStepStatus;
    summary: string;
    details?: string[];
    confidence?: number;
}

export interface TriageResult {
    tracs_category: TRACSCategoryCode;
    tracs_category_name: string;
    severity: SeverityCode;
    severity_name: string;
    confidence_score: number;
    reasoning: string;
    confidence_factors: ConfidenceFactors;
    recommended_action: string;
    similar_reports: string[];
    /** Step-by-step reasoning chain for agentic UI */
    reasoning_steps?: ReasoningStep[];
}

/**
 * Pattern detection results from AI analysis.
 * Identifies clusters, duplicates, and related reports.
 */
export interface PatternDetection {
    is_cluster_member?: boolean;
    cluster_id?: string;
    cluster_reason?: string;
    is_duplicate?: boolean;
    duplicate_of?: string;
    similarity_score?: number;
    duplicate_reason?: string;
}

/**
 * Weather context relevant to the hazard report.
 * Used to correlate weather events with hazard patterns.
 */
export interface WeatherContext {
    timestamp: string;
    conditions: string;
    wind_speed_mph?: number;
    precipitation_inches?: number;
    relevant_to_hazard: boolean;
}

/**
 * Assignment status for district/crew routing.
 */
export type AssignmentStatus = 'pending_review' | 'assigned' | 'in_progress' | 'resolved';

/**
 * Priority level for hazard response.
 */
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Assignment information for report routing to districts and crews.
 */
export interface Assignment {
    district_id: string;
    crew_id?: string;
    status: AssignmentStatus;
    priority?: AssignmentPriority;
    suggested_reason?: string;
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
    /** Pattern detection results (clusters, duplicates) */
    pattern_detection?: PatternDetection;
    /** Assignment routing information */
    assignment?: Assignment;
    /** Weather context at time of report */
    weather_context?: WeatherContext;
    /** Flag for high-risk hazards requiring immediate attention */
    safety_alert?: boolean;
}
