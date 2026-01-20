/**
 * ReasoningPanel - Displays AI chain-of-thought reasoning steps.
 * Shows the logical steps that led to the triage classification.
 */

export interface ReasoningStep {
    /** Step name, e.g., "Visual Analysis" */
    step: string;
    /** Status indicator: success (green), warning (amber), info (blue) */
    status: 'success' | 'warning' | 'info';
    /** Detailed explanation, e.g., "Identified fallen tree > 12in diameter" */
    detail: string;
}

export interface ReasoningPanelProps {
    /** Array of reasoning steps to display */
    steps: ReasoningStep[];
    /** Overall confidence score (0.0 - 1.0) */
    overallConfidence: number;
}

/**
 * Get color class for confidence badge based on score.
 * Green (>80%), Amber (50-79%), Red (<50%)
 */
function getConfidenceColorClass(confidence: number): string {
    if (confidence >= 0.8) return 'bg-emerald-500';
    if (confidence >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
}

/**
 * Status indicator component with appropriate icon and color.
 */
function StatusIndicator({ status }: { status: ReasoningStep['status'] }) {
    const statusConfig = {
        success: {
            color: 'bg-emerald-500',
            icon: (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        warning: {
            color: 'bg-amber-500',
            icon: (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        info: {
            color: 'bg-blue-500',
            icon: (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    };

    const config = statusConfig[status];

    return (
        <div
            className={`flex items-center justify-center w-6 h-6 rounded-full ${config.color}`}
            data-testid={`status-indicator-${status}`}
        >
            {config.icon}
            <span className="sr-only">Status: {status}</span>
        </div>
    );
}

/**
 * ReasoningPanel displays AI reasoning chain with step-by-step visualization.
 *
 * @example
 * <ReasoningPanel
 *   steps={[
 *     { step: 'Visual Analysis', status: 'success', detail: 'Identified obstruction' },
 *     { step: 'Location Check', status: 'warning', detail: 'GPS accuracy moderate' },
 *   ]}
 *   overallConfidence={0.89}
 * />
 */
export function ReasoningPanel({ steps, overallConfidence }: ReasoningPanelProps) {
    const confidencePercentage = Math.round(overallConfidence * 100);
    const confidenceColorClass = getConfidenceColorClass(overallConfidence);

    return (
        <section
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            data-testid="reasoning-panel"
            role="region"
            aria-label="AI Reasoning Chain"
        >
            {/* Header with confidence badge */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    AI Reasoning Chain
                </h4>
                <div
                    className={`px-3 py-1 rounded-full text-white text-sm font-bold ${confidenceColorClass}`}
                    data-testid="confidence-badge"
                >
                    {confidencePercentage}%
                </div>
            </div>

            {/* Steps list */}
            {steps.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                    No reasoning steps available
                </p>
            ) : (
                <ul className="space-y-3" role="list">
                    {steps.map((step, index) => (
                        <li
                            key={`${step.step}-${index}`}
                            className="flex items-start gap-3"
                            role="listitem"
                        >
                            {/* Status indicator */}
                            <div className="flex-shrink-0 mt-0.5">
                                <StatusIndicator status={step.status} />
                            </div>

                            {/* Step content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">
                                    {step.step}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {step.detail}
                                </p>
                            </div>

                            {/* Connector line (except last item) */}
                            {index < steps.length - 1 && (
                                <div
                                    className="absolute left-3 top-8 w-0.5 h-4 bg-gray-700"
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
