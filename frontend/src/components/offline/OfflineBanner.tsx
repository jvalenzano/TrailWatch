/**
 * OfflineBanner - Displays an orange banner when the app is offline.
 * Shows last sync time, data staleness warning, and pending sync count.
 * Includes smooth show/hide animation.
 */

export interface OfflineBannerProps {
    /** Whether the app is currently offline */
    isOffline: boolean;
    /** Timestamp of the last successful sync */
    lastSyncTime: Date;
    /** Number of items waiting to be synced */
    pendingSyncCount: number;
}

/**
 * Formats a relative time string (e.g., "2 hours ago", "just now")
 */
function formatRelativeTime(date: Date): string {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return 'just now';
    }
    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    }
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

/**
 * SatelliteIcon - SVG icon representing a satellite dish
 */
function SatelliteIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            data-testid="satellite-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M13 7L9 3L3 9l4 4" />
            <path d="M10 10L21 21" />
            <path d="M4 10c7 0 10 3 10 10" />
            <circle cx="18" cy="18" r="3" />
        </svg>
    );
}

/**
 * OfflineBanner displays an orange notification banner when the app is offline.
 * Features:
 * - Satellite icon for visual identification
 * - "OFFLINE MODE" text
 * - Relative time since last sync
 * - Data staleness warning
 * - Pending sync count (when > 0)
 * - Smooth show/hide animation
 *
 * @example
 * <OfflineBanner
 *   isOffline={true}
 *   lastSyncTime={new Date(Date.now() - 2 * 60 * 60 * 1000)}
 *   pendingSyncCount={3}
 * />
 */
export function OfflineBanner({
    isOffline,
    lastSyncTime,
    pendingSyncCount,
}: OfflineBannerProps) {
    if (!isOffline) {
        return null;
    }

    const relativeTime = formatRelativeTime(lastSyncTime);

    return (
        <div
            className="bg-orange-500 text-white px-4 py-2 flex items-center justify-center gap-4 transition-all duration-300 ease-in-out"
            data-testid="offline-banner"
            role="alert"
            aria-live="polite"
            aria-label="You are currently offline. Data may be stale."
        >
            <div className="flex items-center gap-2">
                <SatelliteIcon className="w-5 h-5" />
                <span className="font-bold">OFFLINE MODE</span>
            </div>

            <span className="text-sm">
                Last sync: {relativeTime}. Data may be stale.
            </span>

            {pendingSyncCount > 0 && (
                <span className="text-sm bg-orange-600 px-2 py-0.5 rounded">
                    {pendingSyncCount} pending
                </span>
            )}
        </div>
    );
}
