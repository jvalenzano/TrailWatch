/**
 * TrendLevelIndicator - Displays insight type with severity level.
 * Shows combined format like "TREND (Low)", "PATTERN (High)" with icons.
 */
import type { SpatialInsight, SpatialInsightType } from '../../types/spatial';

export interface TrendLevelIndicatorProps {
    type: SpatialInsightType;
    severity: SpatialInsight['severity'];
}

/**
 * Maps insight type to display label.
 * hotspot becomes "PATTERN" per wireframe spec.
 */
const typeLabels: Record<SpatialInsightType, string> = {
    cluster: 'CLUSTER',
    hotspot: 'PATTERN',
    trend: 'TREND',
    anomaly: 'ANOMALY',
    duplicate: 'DUPLICATE',
    consistency_check: 'CONSISTENCY',
};

/**
 * Severity level display text.
 */
const severityLabels: Record<SpatialInsight['severity'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

/**
 * Severity-based text colors.
 */
const severityColors: Record<SpatialInsight['severity'], string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
};

/**
 * Type-specific icons using SVG.
 */
function TypeIcon({ type }: { type: SpatialInsightType }) {
    const iconPaths: Record<SpatialInsightType, React.ReactNode> = {
        cluster: (
            // Pin/cluster icon
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
        ),
        hotspot: (
            // Fire/pattern icon
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
        ),
        trend: (
            // Chart/trend icon
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
        ),
        anomaly: (
            // Warning icon
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        ),
        duplicate: (
            // Document copy icon
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
        ),
        consistency_check: (
            // Balance/scale icon
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
        ),
    };

    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
        >
            {iconPaths[type]}
        </svg>
    );
}

export function TrendLevelIndicator({ type, severity }: TrendLevelIndicatorProps) {
    const typeLabel = typeLabels[type];
    const severityLabel = severityLabels[severity];
    const colorClass = severityColors[severity];

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${colorClass}`}
            data-testid="trend-level-indicator"
            aria-label={`${typeLabel} ${severityLabel}`}
        >
            <TypeIcon type={type} />
            <span>
                {typeLabel} <span className="font-normal opacity-75">({severityLabel})</span>
            </span>
        </span>
    );
}
