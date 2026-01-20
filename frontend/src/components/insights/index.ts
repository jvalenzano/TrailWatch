/**
 * Insight components for the Agentic UI left panel.
 * Re-exports all insight-related components and utilities.
 */

// Container
export { InsightCard } from './InsightCard';
export type { InsightCardProps } from './InsightCard';

// Specialized insight components
export { ClusterInsight } from './ClusterInsight';
export type { ClusterInsightProps } from './ClusterInsight';

export { DuplicateInsight } from './DuplicateInsight';
export type { DuplicateInsightProps } from './DuplicateInsight';

export { BiasInsight } from './BiasInsight';
export type { BiasInsightProps } from './BiasInsight';

export { GenericInsight } from './GenericInsight';
export type { GenericInsightProps } from './GenericInsight';

// Type guards
export {
    isClusterInsight,
    isDuplicateInsight,
    isBiasInsight,
    isGenericInsight,
} from './insightTypeGuards';
