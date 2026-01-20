/**
 * SpatialInsightsSidebar - Left panel container for spatial insights.
 * Displays cluster alerts, consistency checks, and duplicate detections.
 */
import { useState, useCallback } from 'react';
import { useSpatialInsights } from '../../hooks/useSpatialInsights';
import { InsightCard } from '../insights/InsightCard';
import type { SpatialInsight } from '../../types/spatial';

export interface SpatialInsightsSidebarProps {
    /** Callback when an insight is selected or deselected */
    onInsightSelect?: (insight: SpatialInsight | null) => void;
}

/**
 * Sidebar container for the left panel in MapFirstLayout.
 * Fetches and displays spatial insights with selection support.
 *
 * @example
 * <MapFirstLayout
 *   insightPanel={<SpatialInsightsSidebar onInsightSelect={handleSelect} />}
 *   mapPanel={<MapView />}
 *   reportPanel={<ReportList />}
 * />
 */
export function SpatialInsightsSidebar({ onInsightSelect }: SpatialInsightsSidebarProps) {
    const { data: insights, isLoading, isError } = useSpatialInsights();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleInsightSelect = useCallback(
        (insight: SpatialInsight) => {
            const isCurrentlySelected = selectedId === insight.id;
            const newSelectedId = isCurrentlySelected ? null : insight.id;

            setSelectedId(newSelectedId);
            onInsightSelect?.(isCurrentlySelected ? null : insight);
        },
        [selectedId, onInsightSelect]
    );

    return (
        <section
            className="h-full flex flex-col bg-gray-900/50"
            data-testid="spatial-insights-sidebar"
            role="region"
            aria-label="Spatial Insights"
        >
            {/* Header */}
            <header className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">
                    Spatial Insights
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                    AI-detected patterns and anomalies
                </p>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Loading state */}
                {isLoading && (
                    <div
                        className="space-y-4"
                        data-testid="insights-loading"
                    >
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-gray-800 rounded-lg h-32"
                            />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <div
                        className="text-center py-8"
                        data-testid="insights-error"
                    >
                        <div className="text-red-400 mb-2">
                            Failed to load insights
                        </div>
                        <p className="text-gray-500 text-sm">
                            Please try refreshing the page
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && insights?.length === 0 && (
                    <div
                        className="text-center py-8"
                        data-testid="insights-empty"
                    >
                        <div className="text-gray-400 mb-2">
                            No insights available
                        </div>
                        <p className="text-gray-500 text-sm">
                            Spatial analysis found no patterns in current data
                        </p>
                    </div>
                )}

                {/* Insights list */}
                {!isLoading && !isError && insights && insights.length > 0 && (
                    <div className="space-y-3">
                        {insights.map((insight) => (
                            <InsightCard
                                key={insight.id}
                                insight={insight}
                                isSelected={selectedId === insight.id}
                                onSelect={() => handleInsightSelect(insight)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer with insight count */}
            {insights && insights.length > 0 && (
                <footer className="p-3 border-t border-gray-700 text-xs text-gray-500">
                    {insights.length} insight{insights.length !== 1 ? 's' : ''} detected
                </footer>
            )}
        </section>
    );
}
