type EmptyStateVariant = 'no-reports' | 'no-insights' | 'no-crews';

interface EmptyStateProps {
    /** The type of empty state to display */
    variant: EmptyStateVariant;
    /** Custom title (overrides default) */
    title?: string;
    /** Custom description (overrides default) */
    description?: string;
    /** Label for optional action button */
    actionLabel?: string;
    /** Callback when action button is clicked */
    onAction?: () => void;
}

const VARIANT_DEFAULTS: Record<EmptyStateVariant, { title: string; description: string; icon: string }> = {
    'no-reports': {
        title: 'No reports found',
        description: 'Try adjusting your filters',
        icon: '\uD83D\uDCC4', // document emoji
    },
    'no-insights': {
        title: 'No spatial insights available',
        description: 'Insights will appear as patterns are detected',
        icon: '\uD83D\uDCA1', // lightbulb emoji
    },
    'no-crews': {
        title: 'No crews available',
        description: 'Crews will appear when assigned to trails',
        icon: '\uD83D\uDC77', // construction worker emoji
    },
};

/**
 * Empty state component for displaying when no data is available.
 *
 * @example
 * // Basic usage
 * <EmptyState variant="no-reports" />
 *
 * // With action button
 * <EmptyState
 *   variant="no-reports"
 *   actionLabel="Clear Filters"
 *   onAction={() => clearFilters()}
 * />
 *
 * // With custom text
 * <EmptyState
 *   variant="no-reports"
 *   title="No matching trails"
 *   description="Expand your search area"
 * />
 */
export function EmptyState({
    variant,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    const defaults = VARIANT_DEFAULTS[variant];

    return (
        <div
            role="region"
            aria-label="Empty state"
            className="flex flex-col items-center justify-center p-8 text-center"
            data-testid={`empty-state-${variant}`}
        >
            <span className="text-4xl mb-4" role="img" aria-hidden="true">
                {defaults.icon}
            </span>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                {title ?? defaults.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                {description ?? defaults.description}
            </p>
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
