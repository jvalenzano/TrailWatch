/**
 * Type guards for narrowing SpatialInsight metadata types.
 */
import type {
    SpatialInsight,
    ClusterMetadata,
    DuplicateMetadata,
    ConsistencyCheckMetadata,
} from '../../types/spatial';

/**
 * Type guard for cluster insights.
 */
export function isClusterInsight(
    insight: SpatialInsight
): insight is SpatialInsight & { metadata: ClusterMetadata } {
    return (
        insight.type === 'cluster' &&
        insight.metadata !== undefined &&
        'radius_miles' in insight.metadata
    );
}

/**
 * Type guard for duplicate insights.
 */
export function isDuplicateInsight(
    insight: SpatialInsight
): insight is SpatialInsight & { metadata: DuplicateMetadata } {
    return (
        insight.type === 'duplicate' &&
        insight.metadata !== undefined &&
        'similarity_score' in insight.metadata
    );
}

/**
 * Type guard for bias/consistency check insights.
 */
export function isBiasInsight(
    insight: SpatialInsight
): insight is SpatialInsight & { metadata: ConsistencyCheckMetadata } {
    return (
        insight.type === 'consistency_check' &&
        insight.metadata !== undefined &&
        'check_type' in insight.metadata
    );
}

/**
 * Type guard for generic insights (anomaly, hotspot, trend).
 */
export function isGenericInsight(insight: SpatialInsight): boolean {
    return (
        insight.type === 'anomaly' ||
        insight.type === 'hotspot' ||
        insight.type === 'trend'
    );
}
