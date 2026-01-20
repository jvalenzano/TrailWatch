import React, { useEffect, useRef } from 'react';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useUIMode } from '../../hooks/useUIMode';
import { FeatureGate } from '../common/FeatureGate';
import { FeedbackComponent } from '../feedback';

interface ConfidenceIndicatorProps {
    score: number;
    compact?: boolean;
    /** Optional ID for audit logging and feedback */
    targetId?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
    score,
    compact = false,
    targetId,
}) => {
    const { log } = useAuditLog();
    const { isFeatureEnabled } = useUIMode();
    const hasLoggedRef = useRef(false);

    // 4-level color system per spec
    // Very High (0.90 - 1.0): Dark Green
    // High (0.75 - 0.89): Green
    // Moderate (0.50 - 0.74): Yellow
    // Low (0.0 - 0.49): Gray

    let colorClass = 'bg-gray-200 text-gray-700 border-gray-300';
    let label = 'Low Confidence';

    if (score >= 0.9) {
        colorClass = 'bg-green-700 text-white border-green-800'; // Very High - distinct dark green
        label = 'Very High Confidence';
    } else if (score >= 0.75) {
        colorClass = 'bg-green-100 text-green-800 border-green-200'; // High - standard green
        label = 'High Confidence';
    } else if (score >= 0.5) {
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Moderate
        label = 'Moderate Confidence';
    }

    const percentage = Math.round(score * 100);

    // Log confidence score on mount (only once, only if audit logging enabled)
    useEffect(() => {
        if (!hasLoggedRef.current && isFeatureEnabled('enable_audit_logging') && targetId) {
            hasLoggedRef.current = true;
            log({
                actionType: 'confidence_scored',
                source: 'ConfidenceIndicator',
                description: `AI confidence scored: ${label} (${percentage}%)`,
                payload: {
                    targetId,
                    score,
                    percentage,
                    level: label,
                },
                outcome: 'success',
            });
        }
    }, [score, percentage, label, targetId, log, isFeatureEnabled]);

    if (compact) {
        return (
            <div
                className={`flex items-center justify-center w-8 h-6 text-xs font-bold rounded border ${colorClass}`}
                title={`${label} (${percentage}%)`}
                role="status"
                aria-label={`AI confidence: ${percentage}% - ${label}`}
                data-testid="confidence-indicator-compact"
            >
                {percentage}
            </div>
        );
    }

    return (
        <div data-testid="confidence-indicator-wrapper">
            <div
                className={`flex items-center gap-2 px-4 py-2 text-lg font-bold rounded border shadow-md mb-4 ${colorClass}`}
                title={`${label} (${percentage}%)`}
                role="status"
                aria-label={`AI confidence: ${percentage}% - ${label}`}
                data-testid="confidence-indicator"
            >
                <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-xs" aria-hidden="true">
                    {percentage}%
                </span>
                <span>{label}</span>
            </div>
            {targetId && (
                <FeatureGate feature="enable_feedback">
                    <FeedbackComponent
                        targetId={targetId}
                        targetType="confidence"
                        aiOutput={`${label} (${percentage}%)`}
                        compact
                    />
                </FeatureGate>
            )}
        </div>
    );
};
