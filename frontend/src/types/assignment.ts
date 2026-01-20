/**
 * Assignment types for batch crew assignment functionality.
 * Supports multi-select reports → route optimization → crew assignment workflow.
 */

/**
 * Crew performance level based on historical metrics
 */
export type CrewPerformanceLevel = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Extended crew context for assignment decisions
 * Includes performance metrics and capacity information
 */
export interface CrewContext {
    /** Crew identifier */
    crew_id: string;
    /** Crew display name */
    crew_name: string;
    /** Performance rating based on completion rate and quality */
    performance: CrewPerformanceLevel;
    /** ISO date of last completed assignment, null if none */
    last_assignment_date: string | null;
    /** Current capacity as percentage (0-100), lower = more available */
    capacity_percent: number;
}

/**
 * Route optimization summary for batch assignment
 */
export interface RouteSummary {
    /** Total travel distance in miles */
    total_distance_miles: number;
    /** Estimated travel time in hours */
    estimated_travel_hours: number;
    /** Estimated work time in hours based on report types */
    estimated_work_hours: number;
}

/**
 * Request body for batch assignment
 */
export interface BatchAssignmentRequest {
    /** IDs of reports to assign */
    report_ids: string[];
    /** Target district ID */
    district_id: string;
    /** Crew ID to assign */
    crew_id: string;
}

/**
 * Response from batch assignment endpoint
 */
export interface BatchAssignmentResult {
    /** Whether the assignment was successful */
    success: boolean;
    /** Number of reports successfully assigned */
    assigned_count: number;
    /** Unique assignment batch ID for tracking */
    assignment_id: string;
    /** Optional error message if not successful */
    error_message?: string;
}

/**
 * Request for route optimization
 */
export interface RouteOptimizeRequest {
    /** IDs of reports to optimize route for */
    report_ids: string[];
}

/**
 * Request for crew context
 */
export interface CrewContextRequest {
    /** Crew ID to get context for */
    crew_id: string;
}
