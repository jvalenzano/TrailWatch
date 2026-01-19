import type { SpatialInsight } from '../types/spatial';

interface SpatialInsightsSidebarProps {
    insights: SpatialInsight[];
    selectedInsightId: string | null;
    onSelectInsight: (insightId: string) => void;
    isLoading?: boolean;
}

const severityStyles: Record<SpatialInsight['severity'], string> = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const typeIcons: Record<SpatialInsight['type'], string> = {
    cluster: '\uD83D\uDCCD', // pin
    hotspot: '\uD83D\uDD25', // fire
    trend: '\uD83D\uDCC8', // chart
    anomaly: '\u26A0\uFE0F', // warning
};

const typeLabels: Record<SpatialInsight['type'], string> = {
    cluster: 'Cluster',
    hotspot: 'Hotspot',
    trend: 'Trend',
    anomaly: 'Anomaly',
};

interface InsightCardProps {
    insight: SpatialInsight;
    isSelected: boolean;
    onSelect: () => void;
}

function InsightCard({ insight, isSelected, onSelect }: InsightCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`
                w-full text-left p-4 rounded-lg border transition-all duration-200
                ${isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
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
                        ${severityStyles[insight.severity]}
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

            {/* Report count */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
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
                <span>{insight.report_ids.length} report{insight.report_ids.length !== 1 ? 's' : ''}</span>
            </div>
        </button>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="animate-pulse p-4 rounded-lg border border-gray-700 bg-gray-800/50"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-20 bg-gray-700 rounded" />
                        <div className="h-4 w-12 bg-gray-700 rounded" />
                    </div>
                    <div className="h-4 w-3/4 bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-full bg-gray-700 rounded" />
                </div>
            ))}
        </div>
    );
}

export function SpatialInsightsSidebar({
    insights,
    selectedInsightId,
    onSelectInsight,
    isLoading = false,
}: SpatialInsightsSidebarProps) {
    if (isLoading) {
        return (
            <div className="h-full" data-testid="insights-loading">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white">Spatial Insights</h2>
                    <p className="text-xs text-gray-400 mt-1">AI-detected patterns</p>
                </div>
                <LoadingSkeleton />
            </div>
        );
    }

    if (insights.length === 0) {
        return (
            <div className="h-full" data-testid="insights-empty">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white">Spatial Insights</h2>
                    <p className="text-xs text-gray-400 mt-1">AI-detected patterns</p>
                </div>
                <div className="p-4 text-center text-gray-400">
                    <p>No spatial insights available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col" data-testid="spatial-insights-sidebar">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 shrink-0">
                <h2 className="text-lg font-semibold text-white">Spatial Insights</h2>
                <p className="text-xs text-gray-400 mt-1">
                    {insights.length} AI-detected pattern{insights.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Insight list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {insights.map((insight) => (
                    <InsightCard
                        key={insight.id}
                        insight={insight}
                        isSelected={selectedInsightId === insight.id}
                        onSelect={() => onSelectInsight(insight.id)}
                    />
                ))}
            </div>
        </div>
    );
}
