/**
 * CachedBadge - Displays a yellow "[CACHED]" badge to indicate data is from cache.
 * Used alongside offline data to inform users the data may not be current.
 */

export interface CachedBadgeProps {
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

/**
 * Get size classes for the badge.
 */
function getSizeClasses(size: CachedBadgeProps['size']): string {
    switch (size) {
        case 'lg':
            return 'text-base px-2 py-1';
        case 'md':
            return 'text-sm px-1.5 py-0.5';
        default:
            return 'text-xs px-1 py-0.5';
    }
}

/**
 * CachedBadge displays a yellow "[CACHED]" badge to indicate cached data.
 *
 * @example
 * <div className="flex items-center gap-2">
 *   <span>Report #1234</span>
 *   <CachedBadge />
 * </div>
 *
 * @example
 * <CachedBadge size="md" className="ml-2" />
 */
export function CachedBadge({ size = 'sm', className = '' }: CachedBadgeProps) {
    const sizeClasses = getSizeClasses(size);

    return (
        <span
            className={`inline-flex items-center font-semibold bg-amber-100 text-amber-800 rounded ${sizeClasses} ${className}`.trim()}
            data-testid="cached-badge"
            role="status"
            aria-label="Data loaded from cache"
        >
            [CACHED]
        </span>
    );
}
