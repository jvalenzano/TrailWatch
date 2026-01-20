/**
 * RouteSummary - Displays optimized route metrics
 *
 * Shows:
 * - Total distance in miles
 * - Estimated travel time
 * - Estimated work time
 */

import type { RouteSummary as RouteSummaryType } from '../../types/assignment';

export interface RouteSummaryProps {
    /** Route summary data */
    routeSummary: RouteSummaryType;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * Format hours to human-readable string
 */
function formatHours(hours: number): string {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} min`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
        return `${wholeHours} hr`;
    }
    return `${wholeHours} hr ${minutes} min`;
}

/**
 * Route summary display component
 */
export function RouteSummary({
    routeSummary,
    isLoading = false,
}: RouteSummaryProps) {
    if (isLoading) {
        return (
            <div
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg animate-pulse"
                data-testid="route-summary-loading"
            >
                <div className="h-4 w-24 bg-gray-700 rounded mb-3" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-12 bg-gray-700 rounded" />
                    <div className="h-12 bg-gray-700 rounded" />
                    <div className="h-12 bg-gray-700 rounded" />
                </div>
            </div>
        );
    }

    const totalHours = routeSummary.estimated_travel_hours + routeSummary.estimated_work_hours;

    return (
        <div
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
            data-testid="route-summary"
        >
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                </svg>
                Route Optimization
            </h4>

            <div className="grid grid-cols-3 gap-4">
                {/* Distance */}
                <div className="text-center">
                    <div
                        className="text-2xl font-bold text-white"
                        data-testid="route-distance"
                    >
                        {routeSummary.total_distance_miles.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">miles</div>
                </div>

                {/* Travel time */}
                <div className="text-center">
                    <div
                        className="text-2xl font-bold text-blue-400"
                        data-testid="route-travel-time"
                    >
                        {formatHours(routeSummary.estimated_travel_hours)}
                    </div>
                    <div className="text-xs text-gray-400">travel</div>
                </div>

                {/* Work time */}
                <div className="text-center">
                    <div
                        className="text-2xl font-bold text-emerald-400"
                        data-testid="route-work-time"
                    >
                        {formatHours(routeSummary.estimated_work_hours)}
                    </div>
                    <div className="text-xs text-gray-400">work</div>
                </div>
            </div>

            {/* Total estimate */}
            <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                <span className="text-sm text-gray-400">Total: </span>
                <span className="text-sm font-medium text-white" data-testid="route-total">
                    {formatHours(totalHours)}
                </span>
            </div>
        </div>
    );
}
