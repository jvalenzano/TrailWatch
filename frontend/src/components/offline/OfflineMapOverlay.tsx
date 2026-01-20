/**
 * OfflineMapOverlay - Displays over map areas when offline to indicate
 * live data is unavailable.
 *
 * Features:
 * - Semi-transparent overlay that doesn't completely obscure the map
 * - Cloud-off icon to visually indicate offline status
 * - Tablet-optimized layout with readable text and touch-friendly sizing
 * - Accessible with proper ARIA attributes
 * - High contrast text for readability against varying map backgrounds
 */

export interface OfflineMapOverlayProps {
    /** Additional CSS classes */
    className?: string;
    /** Override default message */
    message?: string;
    /** Show cloud-off icon (default: true) */
    showIcon?: boolean;
}

/**
 * CloudOffIcon - SVG icon representing disconnected cloud/offline status
 */
function CloudOffIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            data-testid="cloud-off-icon"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M2 2l20 20" />
            <path d="M5.5 5.5A6.5 6.5 0 0 0 4 10a5 5 0 0 0 0.5 9.5h13" />
            <path d="M8.5 5h.5a6.5 6.5 0 0 1 6.5 6.5v.5" />
            <path d="M17 17h.5a3.5 3.5 0 0 0 0-7h-.5" />
        </svg>
    );
}

const DEFAULT_MESSAGE = 'Live crew locations unavailable offline';

/**
 * OfflineMapOverlay displays a semi-transparent overlay over map areas
 * when the application is offline to indicate live data is unavailable.
 *
 * @example
 * <div className="relative h-64">
 *   <MapComponent />
 *   <OfflineMapOverlay />
 * </div>
 *
 * @example
 * <OfflineMapOverlay message="Map tiles cached for offline viewing" />
 */
export function OfflineMapOverlay({
    className = '',
    message = DEFAULT_MESSAGE,
    showIcon = true,
}: OfflineMapOverlayProps) {
    return (
        <div
            className={`absolute inset-0 flex items-center justify-center bg-gray-900/75 ${className}`.trim()}
            data-testid="offline-map-overlay"
            role="status"
            aria-live="polite"
            aria-label="Map is offline. Live data unavailable."
        >
            <div
                className="flex flex-col items-center gap-3 bg-gray-800 text-white p-6 rounded-lg text-lg max-w-sm text-center shadow-lg"
                data-testid="offline-map-message"
            >
                {showIcon && <CloudOffIcon className="w-8 h-8 text-gray-300" />}
                <span>{message}</span>
            </div>
        </div>
    );
}
