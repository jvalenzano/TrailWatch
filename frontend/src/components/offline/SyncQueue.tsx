/**
 * SyncQueue - Displays and manages pending sync items.
 * Shows queue of offline actions waiting to be synchronized with server.
 */

import { useState, useCallback } from 'react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

/**
 * Format item type for display (e.g., "report_create" -> "Report Create")
 */
function formatItemType(type: string): string {
    return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Get description for a pending item (title if available, otherwise ID)
 */
function getItemDescription(item: { type: string; id: string; [key: string]: unknown }): string {
    if (item.title && typeof item.title === 'string') {
        return item.title;
    }
    return item.id;
}

/**
 * Spinner icon for loading state
 */
function SpinnerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className || ''}`}
            data-testid="spinner-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75" />
        </svg>
    );
}

/**
 * Cloud sync icon
 */
function SyncIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            data-testid="sync-icon"
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
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    );
}

export interface SyncQueueProps {
    /** Additional CSS classes */
    className?: string;
}

/**
 * SyncQueue displays a list of pending sync items with sync controls.
 *
 * Features:
 * - List of pending items with type and description
 * - "Sync Now" button to trigger manual sync
 * - Progress indicator when syncing
 * - Error display on sync failure
 * - Offline indicator
 * - Empty state when no pending items
 *
 * @example
 * <SyncQueue />
 *
 * @example
 * <SyncQueue className="mt-4" />
 */
export function SyncQueue({ className = '' }: SyncQueueProps) {
    const {
        isOffline,
        pendingItems,
        pendingSyncCount,
        isSyncing,
        triggerSync,
    } = useOfflineStatus();

    const [error, setError] = useState<string | null>(null);

    const handleSync = useCallback(async () => {
        setError(null);
        try {
            const success = await triggerSync();
            if (!success) {
                setError('Sync failed. Please try again.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }, [triggerSync]);

    const hasPendingItems = pendingSyncCount > 0;

    return (
        <div
            className={`bg-white rounded-lg shadow p-4 ${className}`.trim()}
            data-testid="sync-queue"
            aria-label="Sync queue for pending offline actions"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <SyncIcon className="w-5 h-5 text-gray-600" />
                    Sync Queue
                </h2>
                {isOffline && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                        Offline
                    </span>
                )}
            </div>

            {/* Progress indicator */}
            {isSyncing && (
                <div
                    className="flex items-center gap-2 mb-4 p-2 bg-blue-50 text-blue-700 rounded"
                    data-testid="sync-progress"
                    aria-live="polite"
                    role="status"
                >
                    <SpinnerIcon className="w-4 h-4" />
                    <span>Syncing...</span>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div
                    className="mb-4 p-2 bg-red-50 text-red-700 rounded"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!hasPendingItems && (
                <p className="text-gray-500 text-sm">
                    No pending items. All changes are synced.
                </p>
            )}

            {/* Pending items list */}
            {hasPendingItems && (
                <>
                    <p className="text-sm text-gray-600 mb-3">
                        {pendingSyncCount} pending item{pendingSyncCount !== 1 ? 's' : ''}
                    </p>

                    <ul
                        className="divide-y divide-gray-200 mb-4"
                        data-testid="sync-queue-list"
                    >
                        {pendingItems.map((item, index) => (
                            <li
                                key={`${item.type}-${item.id}-${index}`}
                                className="py-2 flex items-center justify-between"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatItemType(item.type)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {getItemDescription(item)}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                                    {item.type}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Sync button */}
                    <button
                        type="button"
                        onClick={handleSync}
                        disabled={isOffline || isSyncing}
                        className={`
                            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
                            transition-colors duration-200
                            ${isOffline || isSyncing
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                            }
                        `}
                        aria-label={isSyncing ? 'Syncing in progress' : 'Sync now'}
                    >
                        {isSyncing ? (
                            <>
                                <SpinnerIcon className="w-4 h-4" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <SyncIcon className="w-4 h-4" />
                                Sync Now
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
    );
}
