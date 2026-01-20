/**
 * ClusterAlertCard - Critical spatial alert card for cluster detection.
 * Displays: CRITICAL SPATIAL ALERT header, weather context, cluster details.
 * Follows WF2 wireframe specifications with red border styling.
 */
import type { ClusterMetadata } from '../../types/spatial';

export interface ClusterAlertCardProps {
    /** Cluster metadata including radius, time span, and weather */
    metadata: ClusterMetadata;
    /** Unique cluster identifier */
    clusterId: string;
    /** Number of reports in the cluster */
    reportCount: number;
    /** Callback when "Show AI Reasoning" is clicked */
    onShowReasoning?: () => void;
    /** Callback when "Assign Cluster" button is clicked */
    onAssignCluster?: () => void;
    /** Callback when "View on Map" button is clicked */
    onViewOnMap?: () => void;
}

/**
 * Warning triangle icon SVG for critical alerts.
 */
function WarningTriangleIcon() {
    return (
        <svg
            className="w-5 h-5 text-red-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="cluster-alert-warning-icon"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    );
}

/**
 * Cloud/Weather icon SVG.
 */
function WeatherIcon() {
    return (
        <svg
            className="w-4 h-4 text-red-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
        </svg>
    );
}

export function ClusterAlertCard({
    metadata,
    clusterId,
    reportCount,
    onShowReasoning,
    onAssignCluster,
    onViewOnMap,
}: ClusterAlertCardProps) {
    const hasActions = onShowReasoning || onAssignCluster || onViewOnMap;

    return (
        <div
            className="p-4 rounded-lg border-2 border-red-500 bg-red-500/10"
            data-testid="cluster-alert-card"
            data-cluster-id={clusterId}
            aria-live="polite"
            role="alert"
        >
            {/* Header with warning icon */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-500/30">
                <WarningTriangleIcon />
                <span className="font-bold text-red-400 text-sm uppercase tracking-wide">
                    CRITICAL SPATIAL ALERT
                </span>
            </div>

            {/* Weather context - prominent display */}
            {metadata.weather_correlation && (
                <div
                    className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded bg-red-500/20"
                    data-testid="weather-context"
                >
                    <WeatherIcon />
                    <span className="text-sm font-medium text-red-300">
                        Weather: {metadata.weather_correlation}
                    </span>
                </div>
            )}

            {/* Cluster metrics */}
            <div className="space-y-1.5 text-xs">
                {/* Report count and radius */}
                <div className="flex items-center gap-2 text-gray-300">
                    <span role="img" aria-label="chart">
                        📊
                    </span>
                    <span>
                        {reportCount} report{reportCount !== 1 ? 's' : ''} •{' '}
                        {metadata.radius_miles.toFixed(1)} mi radius
                    </span>
                </div>

                {/* Time span */}
                <div className="flex items-center gap-2 text-gray-300">
                    <span role="img" aria-label="clock">
                        ⏱️
                    </span>
                    <span>{metadata.time_span_hours} hour time span</span>
                </div>
            </div>

            {/* Action buttons */}
            {hasActions && (
                <div className="mt-4 pt-3 border-t border-red-500/30 space-y-2">
                    {/* Show AI Reasoning link */}
                    {onShowReasoning && (
                        <button
                            type="button"
                            onClick={onShowReasoning}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
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
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            Show AI Reasoning
                        </button>
                    )}

                    {/* Action buttons row */}
                    <div className="flex flex-wrap gap-2">
                        {onAssignCluster && (
                            <button
                                type="button"
                                onClick={onAssignCluster}
                                className="px-3 py-1.5 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                Assign Cluster
                            </button>
                        )}
                        {onViewOnMap && (
                            <button
                                type="button"
                                onClick={onViewOnMap}
                                className="px-3 py-1.5 text-xs font-medium rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                            >
                                View on Map
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
