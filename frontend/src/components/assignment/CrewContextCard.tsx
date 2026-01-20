/**
 * CrewContextCard - Displays crew performance and availability context
 *
 * Shows:
 * - Performance badge (excellent/good/fair/poor)
 * - Last assignment date
 * - Current capacity bar
 */

import type { CrewContext, CrewPerformanceLevel } from '../../types/assignment';

export interface CrewContextCardProps {
    /** Crew context data */
    crewContext: CrewContext;
    /** Loading state */
    isLoading?: boolean;
}

const performanceConfig: Record<
    CrewPerformanceLevel,
    { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
    excellent: {
        label: 'Excellent',
        bgColor: 'bg-emerald-500/20',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
    },
    good: {
        label: 'Good',
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
    },
    fair: {
        label: 'Fair',
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
    },
    poor: {
        label: 'Poor',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
    },
};

/**
 * Format date for display
 */
function formatDate(dateString: string | null): string {
    if (!dateString) return 'None';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Get capacity bar color based on percentage
 */
function getCapacityColor(percent: number): string {
    if (percent <= 30) return 'bg-emerald-500';
    if (percent <= 60) return 'bg-yellow-500';
    if (percent <= 80) return 'bg-orange-500';
    return 'bg-red-500';
}

/**
 * Crew context card showing performance and availability
 */
export function CrewContextCard({
    crewContext,
    isLoading = false,
}: CrewContextCardProps) {
    const performanceStyle = performanceConfig[crewContext.performance];
    const capacityColor = getCapacityColor(crewContext.capacity_percent);

    if (isLoading) {
        return (
            <div
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg animate-pulse"
                data-testid="crew-context-loading"
            >
                <div className="h-5 w-32 bg-gray-700 rounded mb-3" />
                <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
                <div className="h-4 w-full bg-gray-700 rounded" />
            </div>
        );
    }

    return (
        <div
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg space-y-3"
            data-testid="crew-context-card"
        >
            {/* Header with name and performance badge */}
            <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">{crewContext.crew_name}</h4>
                <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${performanceStyle.bgColor} ${performanceStyle.textColor} border ${performanceStyle.borderColor}`}
                    data-testid="performance-badge"
                >
                    {performanceStyle.label}
                </span>
            </div>

            {/* Last assignment */}
            <div className="text-sm">
                <span className="text-gray-400">Last Assignment: </span>
                <span className="text-white" data-testid="last-assignment">
                    {formatDate(crewContext.last_assignment_date)}
                </span>
            </div>

            {/* Capacity bar */}
            <div>
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Current Capacity</span>
                    <span className="text-white" data-testid="capacity-percent">
                        {crewContext.capacity_percent}%
                    </span>
                </div>
                <div
                    className="h-2 bg-gray-700 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={crewContext.capacity_percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Crew capacity: ${crewContext.capacity_percent}%`}
                >
                    <div
                        className={`h-full ${capacityColor} transition-all duration-300`}
                        style={{ width: `${crewContext.capacity_percent}%` }}
                        data-testid="capacity-bar"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {crewContext.capacity_percent <= 30
                        ? 'Highly available'
                        : crewContext.capacity_percent <= 60
                          ? 'Moderate workload'
                          : crewContext.capacity_percent <= 80
                            ? 'Heavy workload'
                            : 'Near capacity'}
                </p>
            </div>
        </div>
    );
}
