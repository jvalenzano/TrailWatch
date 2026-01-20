export interface GeneratedReport {
    report_id: string;
    timestamp_submission: string;
    citizen_data: {
        description: string;
        photo_url: string;
        gps_raw: {
            lat: number;
            lng: number;
        };
        reporter_type: 'hiker' | 'equestrian' | 'biker' | 'tourist' | 'volunteer';
    };
    ai_analysis: {
        tracs_code: string;
        hazard_class: string;
        confidence_score: number;
        classification_timestamp: string;
        reasoning_steps: {
            step: string;
            status: 'success' | 'failed' | 'skipped';
            detail: string;
        }[];
    };
    assignment: {
        district_id: string;
        crew_id?: string;
        status: 'pending_review' | 'assigned' | 'in_progress' | 'resolved';
        suggested_reason?: string;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
    };
    pattern_detection?: {
        cluster_id?: string;
        is_duplicate_candidate?: boolean;
        is_duplicate?: boolean;
        duplicate_of?: string;
        similarity_target?: string;
        similarity_score?: number;
        cluster_reason?: string;
        duplicate_reason?: string;
        is_cluster_member?: boolean;
    };
    safety_alert?: boolean;
    weather_context?: {
        timestamp: string;
        conditions: string;
        wind_speed_mph?: number;
        precipitation_inches?: number;
        relevant_to_hazard: boolean;
    };
}
