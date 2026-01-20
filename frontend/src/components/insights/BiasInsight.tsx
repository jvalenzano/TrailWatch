/**
 * BiasInsight - Displays consistency check / bias detection metadata.
 * Shows: deviation percentage, affected districts, check type, explanations, and action buttons.
 */
import type { ConsistencyCheckMetadata } from '../../types/spatial';

export interface BiasInsightProps {
    metadata: ConsistencyCheckMetadata;
    /** Callback when "View Coverage Map" button is clicked */
    onViewCoverageMap?: () => void;
    /** Callback when "Acknowledge" button is clicked */
    onAcknowledge?: () => void;
    /** Callback when "Dismiss" button is clicked */
    onDismiss?: () => void;
    /** Show as yellow alert card with warning styling */
    showAlert?: boolean;
}

const checkTypeLabels: Record<ConsistencyCheckMetadata['check_type'], string> = {
    district_bias: 'District Bias',
    temporal_anomaly: 'Temporal Anomaly',
    geographic_gap: 'Geographic Gap',
};

/**
 * Warning icon SVG for alert mode.
 */
function WarningIcon() {
    return (
        <svg
            className="w-5 h-5 text-yellow-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="bias-alert-warning-icon"
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

export function BiasInsight({
    metadata,
    onViewCoverageMap,
    onAcknowledge,
    onDismiss,
    showAlert = false,
}: BiasInsightProps) {
    const hasActions = onViewCoverageMap || onAcknowledge || onDismiss;

    const containerClasses = showAlert
        ? 'space-y-1.5 text-xs p-3 rounded-lg border border-yellow-500 bg-yellow-500/10'
        : 'space-y-1.5 text-xs';
    return (
        <div className={containerClasses} data-testid="bias-insight-metadata">
            {/* Alert header (when showAlert is true) */}
            {showAlert && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-yellow-500/30">
                    <WarningIcon />
                    <span className="font-semibold text-yellow-400 text-sm">
                        Consistency Alert
                    </span>
                </div>
            )}

            {/* Check type */}
            <div className="flex items-center gap-2 text-gray-300">
                <span className="text-gray-500">Type:</span>
                <span>{checkTypeLabels[metadata.check_type]}</span>
            </div>

            {/* Deviation percentage (if present) */}
            {metadata.deviation_percentage !== undefined && (
                <div className="flex items-center gap-2 text-gray-300">
                    <span
                        className={`font-semibold ${
                            metadata.deviation_percentage > 30
                                ? 'text-red-400'
                                : metadata.deviation_percentage > 15
                                ? 'text-yellow-400'
                                : 'text-green-400'
                        }`}
                    >
                        {Math.round(metadata.deviation_percentage)}% deviation
                    </span>
                    <span className="text-gray-500">from expected</span>
                </div>
            )}

            {/* Affected districts (if present) */}
            {metadata.affected_districts && metadata.affected_districts.length > 0 && (
                <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500 shrink-0">Affected:</span>
                    <div className="flex flex-wrap gap-1">
                        {metadata.affected_districts.map((district) => (
                            <span
                                key={district}
                                className="px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-300"
                            >
                                {district}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Explanations / possible causes (if present) */}
            {metadata.explanations && metadata.explanations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                    <span className="text-gray-500 text-xs">Possible causes:</span>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-gray-300">
                        {metadata.explanations.map((explanation, index) => (
                            <li key={index} className="text-xs">
                                {explanation}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action buttons */}
            {hasActions && (
                <div className="mt-3 pt-2 border-t border-gray-700/50 flex flex-wrap gap-2">
                    {onViewCoverageMap && (
                        <button
                            type="button"
                            onClick={onViewCoverageMap}
                            className="px-2 py-1 text-xs font-medium rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                        >
                            View Coverage Map
                        </button>
                    )}
                    {onAcknowledge && (
                        <button
                            type="button"
                            onClick={onAcknowledge}
                            className="px-2 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
                        >
                            Acknowledge
                        </button>
                    )}
                    {onDismiss && (
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="px-2 py-1 text-xs font-medium rounded bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30 transition-colors"
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
