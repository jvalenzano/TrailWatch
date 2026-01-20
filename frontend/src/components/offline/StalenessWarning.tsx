/**
 * StalenessWarning - Displays a yellow warning badge indicating data may be stale.
 * Used when cached data might be outdated due to offline status.
 */

export interface StalenessWarningProps {
    /** Additional CSS classes */
    className?: string;
    /** Optional custom message override */
    message?: string;
}

/** Default explanatory message */
const DEFAULT_MESSAGE = 'Data may not be current';

/**
 * StalenessWarning displays a yellow "[OFFLINE - STALE]" warning badge
 * to indicate that cached data may be outdated.
 *
 * @example
 * <StalenessWarning />
 *
 * @example
 * <StalenessWarning className="ml-2" message="Last updated 2 hours ago" />
 */
export function StalenessWarning({
    className = '',
    message = DEFAULT_MESSAGE,
}: StalenessWarningProps) {
    return (
        <div
            className={`inline-flex items-center gap-2 font-semibold bg-amber-100 text-amber-800 rounded px-2 py-1 ${className}`.trim()}
            data-testid="staleness-warning"
            role="alert"
            aria-label="Warning: Data may be stale due to offline status"
        >
            <span>[OFFLINE - STALE]</span>
            <span className="font-normal text-sm">{message}</span>
        </div>
    );
}
