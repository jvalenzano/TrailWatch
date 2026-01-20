/**
 * ClusterInsight - Displays cluster-specific metadata.
 * Shows: report count, radius, time span, weather correlation.
 */
import type { ClusterMetadata } from '../../types/spatial';

export interface ClusterInsightProps {
    metadata: ClusterMetadata;
    reportCount: number;
}

export function ClusterInsight({ metadata, reportCount }: ClusterInsightProps) {
    return (
        <div className="space-y-1.5 text-xs" data-testid="cluster-insight-metadata">
            {/* Report count and radius */}
            <div className="flex items-center gap-2 text-gray-300">
                <span role="img" aria-label="chart">
                    {'\uD83D\uDCCA'}
                </span>
                <span>
                    {reportCount} report{reportCount !== 1 ? 's' : ''} &bull;{' '}
                    {metadata.radius_miles.toFixed(1)} mi radius
                </span>
            </div>

            {/* Time span */}
            <div className="flex items-center gap-2 text-gray-300">
                <span role="img" aria-label="clock">
                    {'\u23F1\uFE0F'}
                </span>
                <span>{metadata.time_span_hours} hour time span</span>
            </div>

            {/* Weather correlation (if present) */}
            {metadata.weather_correlation && (
                <div className="flex items-center gap-2 text-gray-300">
                    <span role="img" aria-label="cloud">
                        {'\u2601\uFE0F'}
                    </span>
                    <span>{metadata.weather_correlation}</span>
                </div>
            )}
        </div>
    );
}
