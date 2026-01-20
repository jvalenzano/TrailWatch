import type { SpatialInsight } from '../types/spatial';
import {
    InsightCard,
    ClusterInsight,
    DuplicateInsight,
    BiasInsight,
    GenericInsight,
    isClusterInsight,
    isDuplicateInsight,
    isBiasInsight,
    isGenericInsight,
} from './insights';

interface SpatialInsightsSidebarProps {
    insights: SpatialInsight[];
    selectedInsightId: string | null;
    onSelectInsight: (insightId: string) => void;
    isLoading?: boolean;
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

/**
 * Renders the appropriate specialized insight component based on insight type.
 */
function InsightContent({ insight }: { insight: SpatialInsight }) {
    if (isClusterInsight(insight)) {
        return (
            <ClusterInsight
                metadata={insight.metadata}
                reportCount={insight.report_ids.length}
            />
        );
    }

    if (isDuplicateInsight(insight)) {
        return <DuplicateInsight metadata={insight.metadata} />;
    }

    if (isBiasInsight(insight)) {
        return <BiasInsight metadata={insight.metadata} />;
    }

    if (isGenericInsight(insight)) {
        return (
            <GenericInsight
                type={insight.type}
                metadata={insight.metadata as Record<string, unknown> | undefined}
            />
        );
    }

    return null;
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
                    >
                        <InsightContent insight={insight} />
                    </InsightCard>
                ))}
            </div>
        </div>
    );
}
