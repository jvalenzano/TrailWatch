/**
 * Feature Flag Types
 *
 * Types for the Feature Admin panel (WF10).
 */

/**
 * Feature status levels
 * - enabled: Fully enabled for all users (green)
 * - beta: Beta testing with wider audience (amber)
 * - alpha: Alpha testing with limited pilot users (red)
 * - disabled: Completely disabled (gray)
 */
export type FeatureStatus = 'enabled' | 'beta' | 'alpha' | 'disabled';

/**
 * Metric types that can be displayed on feature cards
 */
export type FeatureMetricType = 'adoption_rate' | 'acceptance_rate' | 'pilot_users';

/**
 * Feature metric data
 */
export interface FeatureMetric {
    type: FeatureMetricType;
    value: number;
    label: string;
    period?: string; // e.g., "Last 30 days"
}

/**
 * Feature flag definition
 */
export interface FeatureFlag {
    id: string;
    name: string;
    description?: string;
    status: FeatureStatus;
    metric: FeatureMetric;
    /** Available actions based on current status */
    availableActions: FeatureAction[];
    updatedAt?: string;
    updatedBy?: string;
}

/**
 * Available actions for feature flags
 */
export type FeatureAction =
    | 'enable_globally'
    | 'disable_globally'
    | 'enable_for_all'
    | 'disable'
    | 'promote_to_beta'
    | 'promote_to_enabled'
    | 'demote_to_alpha'
    | 'demote_to_disabled';

/**
 * Feature flag update request
 */
export interface FeatureFlagUpdateRequest {
    featureId: string;
    action: FeatureAction;
}

/**
 * Feature flag update response
 */
export interface FeatureFlagUpdateResponse {
    success: boolean;
    feature: FeatureFlag;
    message?: string;
}
