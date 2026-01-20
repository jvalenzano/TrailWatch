/**
 * Types for offline sync queue functionality.
 * Supports field rangers working in areas with limited connectivity.
 */

/**
 * Type of action queued for synchronization.
 */
export type SyncQueueItemType = 'report_create' | 'report_update' | 'insight_action';

/**
 * Status of an item in the sync queue.
 */
export type SyncQueueItemStatus = 'pending' | 'syncing' | 'failed';

/**
 * Individual item in the offline sync queue.
 * Represents a single operation waiting to be synchronized with the server.
 */
export interface SyncQueueItem {
    /** Unique identifier for the queue item */
    id: string;
    /** Type of operation to perform when online */
    type: SyncQueueItemType;
    /** Data payload for the operation */
    data: Record<string, unknown>;
    /** ISO 8601 timestamp when the item was queued */
    timestamp: string;
    /** Current status of the sync item */
    status: SyncQueueItemStatus;
    /** Number of sync retry attempts */
    retryCount: number;
    /** Error message from last failed sync attempt */
    lastError?: string;
}

/**
 * Response from GET /api/sync/queue endpoint.
 */
export interface SyncQueueResponse {
    /** Array of pending sync items */
    items: SyncQueueItem[];
    /** Total count of items in the queue */
    count: number;
}

/**
 * Request body for POST /api/sync/queue endpoint.
 */
export interface SyncQueueAddRequest {
    /** Type of operation being queued */
    type: SyncQueueItemType;
    /** Data payload for the operation */
    data: Record<string, unknown>;
    /** ISO 8601 timestamp when the action was performed offline */
    timestamp: string;
}

/**
 * Response from POST /api/sync/queue endpoint.
 */
export interface SyncQueueAddResponse {
    /** ID of the newly created queue item */
    id: string;
    /** Initial status (always 'pending') */
    status: 'pending';
}

/**
 * Response from POST /api/sync/execute endpoint.
 */
export interface SyncExecuteResponse {
    /** Number of items successfully synced */
    synced: number;
    /** Number of items that failed to sync */
    failed: number;
    /** Array of error messages from failed items */
    errors: string[];
}

/**
 * Response from GET /api/sync/status endpoint.
 */
export interface SyncStatus {
    /** Whether the server considers the client online */
    isOnline: boolean;
    /** Number of items waiting to be synced */
    pendingCount: number;
    /** ISO 8601 timestamp of last successful sync, or null if never synced */
    lastSync: string | null;
}
