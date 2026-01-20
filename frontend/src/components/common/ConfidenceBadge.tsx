/**
 * ConfidenceBadge - Displays AI confidence score as a colored percentage pill.
 * Color-coded: Green (≥80%), Amber (50-79%), Red (<50%)
 */

export interface ConfidenceBadgeProps {
    /** Confidence score (0.0 - 1.0) */
    confidence: number;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Show "Confidence" label next to percentage */
    showLabel?: boolean;
}

/**
 * Get background color class based on confidence score.
 * Green (≥80%), Amber (50-79%), Red (<50%)
 */
function getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'bg-emerald-500';
    if (confidence >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
}

/**
 * Get size classes for the badge.
 */
function getSizeClasses(size: ConfidenceBadgeProps['size']): string {
    switch (size) {
        case 'sm':
            return 'text-xs px-2 py-0.5';
        case 'lg':
            return 'text-lg px-4 py-1.5';
        default:
            return 'text-sm px-3 py-1';
    }
}

/**
 * ConfidenceBadge displays a confidence score as a colored percentage pill.
 *
 * @example
 * <ConfidenceBadge confidence={0.89} />
 * // Renders: "89% Confidence" with green background
 *
 * @example
 * <ConfidenceBadge confidence={0.65} size="lg" showLabel={false} />
 * // Renders: "65%" with amber background, large size
 */
export function ConfidenceBadge({
    confidence,
    size = 'md',
    showLabel = true,
}: ConfidenceBadgeProps) {
    const percentage = Math.round(confidence * 100);
    const colorClass = getConfidenceColor(confidence);
    const sizeClass = getSizeClasses(size);

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-bold text-white rounded-full ${colorClass} ${sizeClass}`}
            data-testid="confidence-badge"
            role="status"
            aria-label={`${percentage}% confidence`}
        >
            <span>{percentage}%</span>
            {showLabel && (
                <span className="font-medium">Confidence</span>
            )}
        </span>
    );
}
