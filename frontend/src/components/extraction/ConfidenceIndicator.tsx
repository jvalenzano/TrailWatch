import React from 'react';

interface ConfidenceIndicatorProps {
    score: number;
    compact?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ score, compact = false }) => {
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

    if (compact) {
        return (
            <div
                className={`flex items-center justify-center w-8 h-6 text-xs font-bold rounded border ${colorClass}`}
                title={`${label} (${percentage}%)`}
            >
                {percentage}
            </div>
        );
    }

    return (
        <div
            className={`flex items-center gap-2 px-2 py-1 text-sm font-medium rounded border ${colorClass}`}
            title={`${label} (${percentage}%)`}
        >
            <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-xs">
                {percentage}%
            </span>
            <span>{label}</span>
        </div>
    );
};
