/**
 * InsightCard - Generic container for spatial insight cards.
 * Uses composition pattern with specialized children components.
 */
import type { ReactNode } from 'react';
import type { SpatialInsight, SpatialInsightType } from '../../types/spatial';

export interface InsightCardProps {
    insight: SpatialInsight;
    isSelected: boolean;
    onSelect: () => void;
    children?: ReactNode;
}

const severityBorderColors: Record<SpatialInsight['severity'], string> = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
};

const severityBadgeStyles: Record<SpatialInsight['severity'], string> = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const typeIcons: Record<SpatialInsightType, string> = {
    cluster: '\uD83D\uDCCD', // pin
    hotspot: '\uD83D\uDD25', // fire
    trend: '\uD83D\uDCC8', // chart
    anomaly: '\u26A0\uFE0F', // warning
    duplicate: '\uD83D\uDCC4', // document
    consistency_check: '\u2696\uFE0F', // balance scale
};

const typeLabels: Record<SpatialInsightType, string> = {
    cluster: 'Cluster',
    hotspot: 'Hotspot',
    trend: 'Trend',
    anomaly: 'Anomaly',
    duplicate: 'Duplicate',
    consistency_check: 'Consistency',
};

export function InsightCard({
    insight,
    isSelected,
    onSelect,
    children,
}: InsightCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`
                w-full text-left p-4 rounded-lg border-l-4 transition-all duration-200
                bg-gray-800/50 backdrop-blur-sm
                ${severityBorderColors[insight.severity]}
                ${isSelected
                    ? 'ring-1 ring-emerald-500/50 bg-emerald-500/10 border-r border-t border-b border-emerald-500/30'
                    : 'border-r border-t border-b border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                }
            `}
            aria-pressed={isSelected}
            data-testid={`insight-card-${insight.id}`}
        >
            {/* Header row with type icon and severity badge */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span
                        className="text-lg"
                        role="img"
                        aria-label={typeLabels[insight.type]}
                    >
                        {typeIcons[insight.type]}
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {typeLabels[insight.type]}
                    </span>
                </div>
                <span
                    className={`
                        px-2 py-0.5 text-xs font-medium rounded border
                        ${severityBadgeStyles[insight.severity]}
                    `}
                >
                    {insight.severity}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-white mb-1">
                {insight.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                {insight.description}
            </p>

            {/* Specialized insight content (children) */}
            {children && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                    {children}
                </div>
            )}

            {/* Footer: Report count */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span>
                    {insight.report_ids.length} report
                    {insight.report_ids.length !== 1 ? 's' : ''}
                </span>
            </div>
        </button>
    );
}
