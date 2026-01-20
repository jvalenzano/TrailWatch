/**
 * IndexedDB schema types for offline data persistence.
 * Used with Dexie.js for type-safe IndexedDB operations.
 */

/**
 * Cached report stored in IndexedDB for offline access.
 */
export interface CachedReport {
    /** Unique report ID */
    id: string;
    /** Full report data */
    data: Record<string, unknown>;
    /** ISO timestamp when the report was cached */
    cachedAt: string;
    /** ISO timestamp when the cache expires */
    expiresAt: string;
}

/**
 * Cached spatial insight stored in IndexedDB.
 */
export interface CachedInsight {
    /** Unique insight ID */
    id: string;
    /** Associated report ID */
    reportId: string;
    /** Full insight data */
    data: Record<string, unknown>;
    /** ISO timestamp when the insight was cached */
    cachedAt: string;
}

/**
 * Types of sync queue operations.
 */
export type SyncQueueType = 'report_create' | 'report_update' | 'insight_action';

/**
 * Status of a sync queue item.
 */
export type SyncQueueStatus = 'pending' | 'syncing' | 'failed';

/**
 * Item in the sync queue waiting to be processed when online.
 */
export interface SyncQueueItem {
    /** Auto-increment primary key */
    id?: number;
    /** Type of operation */
    type: SyncQueueType;
    /** Operation payload data */
    data: Record<string, unknown>;
    /** ISO timestamp when the item was queued */
    timestamp: string;
    /** Current status of the sync item */
    status: SyncQueueStatus;
    /** Number of retry attempts */
    retryCount: number;
}

/**
 * Storage usage information.
 */
export interface StorageUsage {
    /** Used storage in bytes */
    usedBytes: number;
    /** Available quota in bytes (if available) */
    quotaBytes: number | null;
    /** Percentage of quota used */
    usagePercent: number | null;
}

/**
 * Default cache expiration time in milliseconds (24 hours).
 */
export const DEFAULT_CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

/**
 * Storage warning threshold (80% of quota).
 */
export const STORAGE_WARNING_THRESHOLD = 0.8;

/**
 * Maximum retry count before marking sync item as failed.
 */
export const MAX_RETRY_COUNT = 3;
