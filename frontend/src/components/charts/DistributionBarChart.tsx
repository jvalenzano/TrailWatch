/**
 * DistributionBarChart - Horizontal bar chart showing expected vs actual distribution.
 * Used for consistency checks (WF8) to visualize bias in report distribution.
 */
import { useId } from 'react';

export interface DistributionBarChartProps {
    /** Expected distribution by category (e.g., district name -> percentage) */
    expected: Record<string, number>;
    /** Actual distribution by category */
    actual: Record<string, number>;
    /** Optional title for the chart */
    title?: string;
    /** Optional additional CSS classes */
    className?: string;
}

/**
 * Calculate the deviation between expected and actual values.
 * Returns absolute difference in percentage points.
 */
function calculateDeviation(expected: number, actual: number): number {
    return Math.abs(actual - expected);
}

/**
 * Get color class for actual bar based on deviation from expected.
 * - Green: <= 5% deviation (close match)
 * - Yellow: 6-15% deviation (moderate difference)
 * - Red: > 15% deviation (significant difference)
 */
function getActualBarColor(expected: number, actual: number): string {
    const deviation = calculateDeviation(expected, actual);

    if (deviation <= 5) {
        return 'bg-green-500';
    }
    if (deviation <= 15) {
        return 'bg-yellow-500';
    }
    return 'bg-red-500';
}

export function DistributionBarChart({
    expected,
    actual,
    title,
    className = '',
}: DistributionBarChartProps) {
    const descriptionId = useId();

    // Get all unique categories from both expected and actual
    const categories = Array.from(
        new Set([...Object.keys(expected), ...Object.keys(actual)])
    ).sort();

    // Handle empty state
    if (categories.length === 0) {
        return (
            <div
                className={`w-full p-4 text-center text-gray-400 ${className}`}
                data-testid="distribution-bar-chart"
            >
                No distribution data available
            </div>
        );
    }

    return (
        <div
            className={`w-full space-y-4 ${className}`}
            data-testid="distribution-bar-chart"
            role="img"
            aria-label="Distribution comparison chart"
            aria-describedby={descriptionId}
        >
            {/* Screen reader description */}
            <span id={descriptionId} className="sr-only">
                Distribution comparison chart showing expected versus actual values
            </span>

            {/* Title */}
            {title && (
                <h4 className="text-sm font-semibold text-white">{title}</h4>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-500" aria-hidden="true" />
                    <span className="text-gray-300">Expected</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-green-500" aria-hidden="true" />
                    <span className="text-gray-300">Actual</span>
                </div>
            </div>

            {/* Bar chart */}
            <div className="space-y-3">
                {categories.map((category) => {
                    const expectedValue = expected[category] ?? 0;
                    const actualValue = actual[category] ?? 0;
                    const actualColor = getActualBarColor(expectedValue, actualValue);

                    return (
                        <div
                            key={category}
                            className="space-y-1"
                            data-testid={`bar-group-${category}`}
                        >
                            {/* Category label */}
                            <div className="text-xs text-gray-400 font-medium">
                                {category}
                            </div>

                            {/* Expected bar */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-4 bg-gray-700/50 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded transition-all duration-300"
                                        style={{ width: `${expectedValue}%` }}
                                        data-testid={`expected-bar-${category}`}
                                        role="meter"
                                        aria-label={`Expected: ${expectedValue}%`}
                                        aria-valuenow={expectedValue}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-10 text-right">
                                    {expectedValue}%
                                </span>
                            </div>

                            {/* Actual bar */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-4 bg-gray-700/50 rounded overflow-hidden">
                                    <div
                                        className={`h-full rounded transition-all duration-300 ${actualColor}`}
                                        style={{ width: `${actualValue}%` }}
                                        data-testid={`actual-bar-${category}`}
                                        role="meter"
                                        aria-label={`Actual: ${actualValue}%`}
                                        aria-valuenow={actualValue}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-10 text-right">
                                    {actualValue}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X-axis markers */}
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-700/50">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
        </div>
    );
}
