/**
 * Audit Log Types
 *
 * Standardized schema for tracking AI actions and user interactions
 * for compliance, debugging, and RLHF data collection.
 */

/**
 * Types of AI actions that can be audited.
 */
export type AuditActionType =
    | 'cluster_detected'           // AI identified a spatial cluster
    | 'duplicate_flagged'          // AI flagged potential duplicate
    | 'confidence_displayed'       // Confidence indicator shown to user
    | 'reasoning_expanded'         // User expanded reasoning panel
    | 'circuit_breaker_shown'      // High-risk confirmation modal displayed
    | 'circuit_breaker_approved'   // User approved high-risk action
    | 'circuit_breaker_rejected'   // User rejected high-risk action
    | 'feedback_submitted'         // User submitted feedback
    | 'feature_gate_evaluated'     // Feature gate checked
    | 'mode_changed'               // UI mode changed
    | 'extraction_started'         // AI extraction started
    | 'extraction_completed'       // AI extraction completed
    | 'extraction_failed';         // AI extraction failed

/**
 * Outcome of an audited action.
 */
export type AuditOutcome = 'success' | 'failure' | 'pending' | 'cancelled';

/**
 * Base payload interface - all payloads must extend this.
 */
export interface AuditPayloadBase {
    [key: string]: unknown;
}

/**
 * Typed payloads for specific action types.
 */
export interface ClusterDetectedPayload extends AuditPayloadBase {
    clusterId: string;
    reportIds: string[];
    reportCount: number;
    boundingBox?: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}

export interface DuplicateFlaggedPayload extends AuditPayloadBase {
    reportId: string;
    duplicateOfId: string;
    similarityScore: number;
}

export interface ConfidenceDisplayedPayload extends AuditPayloadBase {
    reportId: string;
    confidenceScore: number;
    confidenceLevel: 'high' | 'medium' | 'low';
}

export interface ReasoningExpandedPayload extends AuditPayloadBase {
    reportId: string;
    confidenceScore?: number;
    expandedVia: 'click' | 'hover' | 'keyboard';
}

export interface CircuitBreakerPayload extends AuditPayloadBase {
    reportId: string;
    actionType: string;
    riskLevel: 'high' | 'critical';
    checkboxesRequired?: number;
    checkboxesCompleted?: number;
}

export interface FeedbackSubmittedPayload extends AuditPayloadBase {
    targetId: string;
    targetType: 'cluster' | 'duplicate' | 'confidence' | 'classification';
    rating: 'positive' | 'negative';
    correctionText?: string;
}

export interface FeatureGatePayload extends AuditPayloadBase {
    feature: string;
    enabled: boolean;
    mode: string;
    hasOverride: boolean;
}

export interface ModeChangedPayload extends AuditPayloadBase {
    previousMode: string;
    newMode: string;
    trigger: 'user' | 'url' | 'override';
}

export interface ExtractionPayload extends AuditPayloadBase {
    reportId: string;
    extractionType: 'streaming' | 'batch';
    duration?: number;
    errorMessage?: string;
}

/**
 * Union type of all typed payloads.
 */
export type AuditPayload =
    | ClusterDetectedPayload
    | DuplicateFlaggedPayload
    | ConfidenceDisplayedPayload
    | ReasoningExpandedPayload
    | CircuitBreakerPayload
    | FeedbackSubmittedPayload
    | FeatureGatePayload
    | ModeChangedPayload
    | ExtractionPayload
    | AuditPayloadBase;

/**
 * A single audit log entry.
 */
export interface AuditLogEntry {
    /** Unique identifier (UUID v4) */
    id: string;
    /** ISO 8601 timestamp */
    timestamp: string;
    /** Type of action being logged */
    actionType: AuditActionType;
    /** Component or service that triggered the action */
    source: string;
    /** Human-readable description */
    description: string;
    /** Action-specific payload */
    payload: AuditPayload;
    /** AI confidence score if applicable (0-1) */
    confidence?: number;
    /** User identifier (anonymized) */
    userId?: string;
    /** Browser session identifier */
    sessionId: string;
    /** Feature flags active at time of action */
    activeFeatures: string[];
    /** Outcome of the action */
    outcome?: AuditOutcome;
}

/**
 * Input for creating a new log entry (without auto-generated fields).
 */
export interface AuditLogInput {
    actionType: AuditActionType;
    source: string;
    description: string;
    payload: AuditPayload;
    confidence?: number;
    activeFeatures?: string[];
    outcome?: AuditOutcome;
}

/**
 * Filter options for querying logs.
 */
export interface AuditLogFilter {
    actionType?: AuditActionType;
    source?: string;
    startTime?: string;
    endTime?: string;
    outcome?: AuditOutcome;
}

/**
 * Storage key for sessionStorage.
 */
export const AUDIT_LOG_STORAGE_KEY = 'trailwatch_audit_logs';

/**
 * Maximum number of logs to retain in storage.
 */
export const MAX_AUDIT_LOGS = 1000;
