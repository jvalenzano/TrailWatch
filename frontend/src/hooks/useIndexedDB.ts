/**
 * useIndexedDB - Hook for IndexedDB operations with offline data persistence.
 * Provides caching, sync queue management, and storage quota handling.
 */

import { useCallback, useState } from 'react';
import { db, isIndexedDBAvailable } from '../db/indexedDB';
import type {
    CachedReport,
    CachedInsight,
    SyncQueueItem,
    SyncQueueType,
    StorageUsage,
} from '../db/schema';
import {
    DEFAULT_CACHE_EXPIRATION_MS,
    STORAGE_WARNING_THRESHOLD,
    MAX_RETRY_COUNT,
} from '../db/schema';

export interface UseIndexedDBResult {
    /** Whether IndexedDB is available */
    isAvailable: boolean;
    /** Whether a database operation is in progress */
    isLoading: boolean;
    /** Error from the last operation, if any */
    error: Error | null;
    /** Cache a report for offline access */
    cacheReport: (report: CachedReport) => Promise<boolean>;
    /** Get a cached report by ID */
    getCachedReport: (id: string) => Promise<CachedReport | undefined>;
    /** Get all cached reports */
    getAllCachedReports: () => Promise<CachedReport[]>;
    /** Cache an insight for offline access */
    cacheInsight: (insight: CachedInsight) => Promise<boolean>;
    /** Get cached insights for a report */
    getCachedInsights: (reportId: string) => Promise<CachedInsight[]>;
    /** Add an item to the sync queue */
    addToSyncQueue: (item: Omit<SyncQueueItem, 'id'>) => Promise<number | undefined>;
    /** Get pending sync items */
    getPendingSyncItems: () => Promise<SyncQueueItem[]>;
    /** Mark a sync item as syncing */
    markSyncing: (id: number) => Promise<boolean>;
    /** Mark a sync item as completed (removes it) */
    markSynced: (id: number) => Promise<boolean>;
    /** Mark a sync item as failed and increment retry count */
    markFailed: (id: number) => Promise<boolean>;
    /** Clear expired cache entries */
    clearExpiredCache: () => Promise<number>;
    /** Get storage usage information */
    getStorageUsage: () => Promise<StorageUsage>;
    /** Check if storage is low (above warning threshold) */
    isStorageLow: () => Promise<boolean>;
    /** Perform LRU eviction to free storage space */
    evictOldestEntries: (count: number) => Promise<number>;
    /** Clear all sync queue items */
    clearSyncQueue: () => Promise<void>;
}

/**
 * Hook for managing IndexedDB operations for offline data persistence.
 *
 * Features:
 * - Cache reports and insights for offline access
 * - Manage sync queue for offline operations
 * - Handle storage quota with LRU eviction
 * - Track expiration and clear stale data
 *
 * @example
 * const {
 *   cacheReport,
 *   getCachedReport,
 *   addToSyncQueue,
 *   getPendingSyncItems,
 *   clearExpiredCache,
 *   getStorageUsage,
 * } = useIndexedDB();
 *
 * // Cache a report
 * await cacheReport({
 *   id: 'report-123',
 *   data: reportData,
 *   cachedAt: new Date().toISOString(),
 *   expiresAt: new Date(Date.now() + 86400000).toISOString(),
 * });
 *
 * // Queue an action while offline
 * await addToSyncQueue({
 *   type: 'report_update',
 *   data: { id: 'report-123', status: 'reviewed' },
 *   timestamp: new Date().toISOString(),
 *   status: 'pending',
 *   retryCount: 0,
 * });
 */
export function useIndexedDB(): UseIndexedDBResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isAvailable = isIndexedDBAvailable();

    /**
     * Wrapper to handle errors and loading state for async operations.
     */
    const withErrorHandling = useCallback(
        async <T>(operation: () => Promise<T>, defaultValue: T): Promise<T> => {
            if (!isAvailable) {
                setError(new Error('IndexedDB is not available'));
                return defaultValue;
            }

            setIsLoading(true);
            setError(null);

            try {
                const result = await operation();
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('[useIndexedDB] Operation failed:', errorMessage);
                setError(err instanceof Error ? err : new Error(errorMessage));
                return defaultValue;
            } finally {
                setIsLoading(false);
            }
        },
        [isAvailable]
    );

    /**
     * Cache a report for offline access.
     */
    const cacheReport = useCallback(
        async (report: CachedReport): Promise<boolean> => {
            return withErrorHandling(async () => {
                // Check storage before caching
                const usage = await getStorageUsageInternal();
                if (usage.usagePercent !== null && usage.usagePercent >= STORAGE_WARNING_THRESHOLD) {
                    console.warn('[useIndexedDB] Storage low, evicting oldest entries');
                    await evictOldestEntriesInternal(5);
                }

                await db.reports.put(report);
                return true;
            }, false);
        },
        [withErrorHandling]
    );

    /**
     * Get a cached report by ID.
     */
    const getCachedReport = useCallback(
        async (id: string): Promise<CachedReport | undefined> => {
            return withErrorHandling(async () => {
                const report = await db.reports.get(id);

                // Check if expired
                if (report && new Date(report.expiresAt) < new Date()) {
                    await db.reports.delete(id);
                    return undefined;
                }

                return report;
            }, undefined);
        },
        [withErrorHandling]
    );

    /**
     * Get all cached reports.
     */
    const getAllCachedReports = useCallback(
        async (): Promise<CachedReport[]> => {
            return withErrorHandling(async () => {
                const now = new Date().toISOString();
                // Return only non-expired reports
                return db.reports.filter((report) => report.expiresAt > now).toArray();
            }, []);
        },
        [withErrorHandling]
    );

    /**
     * Cache an insight for offline access.
     */
    const cacheInsight = useCallback(
        async (insight: CachedInsight): Promise<boolean> => {
            return withErrorHandling(async () => {
                await db.insights.put(insight);
                return true;
            }, false);
        },
        [withErrorHandling]
    );

    /**
     * Get cached insights for a report.
     */
    const getCachedInsights = useCallback(
        async (reportId: string): Promise<CachedInsight[]> => {
            return withErrorHandling(async () => {
                return db.insights.where('reportId').equals(reportId).toArray();
            }, []);
        },
        [withErrorHandling]
    );

    /**
     * Add an item to the sync queue.
     */
    const addToSyncQueue = useCallback(
        async (item: Omit<SyncQueueItem, 'id'>): Promise<number | undefined> => {
            return withErrorHandling(async () => {
                const id = await db.syncQueue.add(item as SyncQueueItem);
                return id;
            }, undefined);
        },
        [withErrorHandling]
    );

    /**
     * Get pending sync items.
     */
    const getPendingSyncItems = useCallback(
        async (): Promise<SyncQueueItem[]> => {
            return withErrorHandling(async () => {
                return db.syncQueue
                    .where('status')
                    .anyOf(['pending', 'failed'])
                    .filter((item) => item.retryCount < MAX_RETRY_COUNT)
                    .toArray();
            }, []);
        },
        [withErrorHandling]
    );

    /**
     * Mark a sync item as syncing.
     */
    const markSyncing = useCallback(
        async (id: number): Promise<boolean> => {
            return withErrorHandling(async () => {
                await db.syncQueue.update(id, { status: 'syncing' });
                return true;
            }, false);
        },
        [withErrorHandling]
    );

    /**
     * Mark a sync item as completed (removes it).
     */
    const markSynced = useCallback(
        async (id: number): Promise<boolean> => {
            return withErrorHandling(async () => {
                await db.syncQueue.delete(id);
                return true;
            }, false);
        },
        [withErrorHandling]
    );

    /**
     * Mark a sync item as failed and increment retry count.
     */
    const markFailed = useCallback(
        async (id: number): Promise<boolean> => {
            return withErrorHandling(async () => {
                const item = await db.syncQueue.get(id);
                if (item) {
                    await db.syncQueue.update(id, {
                        status: 'failed',
                        retryCount: item.retryCount + 1,
                    });
                }
                return true;
            }, false);
        },
        [withErrorHandling]
    );

    /**
     * Clear expired cache entries.
     */
    const clearExpiredCache = useCallback(
        async (): Promise<number> => {
            return withErrorHandling(async () => {
                const now = new Date().toISOString();
                const expiredReports = await db.reports
                    .filter((report) => report.expiresAt <= now)
                    .toArray();

                if (expiredReports.length > 0) {
                    await db.reports.bulkDelete(expiredReports.map((r) => r.id));
                }

                return expiredReports.length;
            }, 0);
        },
        [withErrorHandling]
    );

    /**
     * Get storage usage information (internal helper, no state updates).
     */
    const getStorageUsageInternal = async (): Promise<StorageUsage> => {
        // Use Storage API if available
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            const usedBytes = estimate.usage ?? 0;
            const quotaBytes = estimate.quota ?? null;
            const usagePercent = quotaBytes ? usedBytes / quotaBytes : null;

            return { usedBytes, quotaBytes, usagePercent };
        }

        // Fallback: estimate from table counts (rough approximation)
        const reportCount = await db.reports.count();
        const insightCount = await db.insights.count();
        const syncCount = await db.syncQueue.count();

        // Rough estimate: ~1KB per record
        const estimatedBytes = (reportCount + insightCount + syncCount) * 1024;

        return {
            usedBytes: estimatedBytes,
            quotaBytes: null,
            usagePercent: null,
        };
    };

    /**
     * Get storage usage information.
     */
    const getStorageUsage = useCallback(
        async (): Promise<StorageUsage> => {
            return withErrorHandling(getStorageUsageInternal, {
                usedBytes: 0,
                quotaBytes: null,
                usagePercent: null,
            });
        },
        [withErrorHandling]
    );

    /**
     * Check if storage is low (above warning threshold).
     */
    const isStorageLow = useCallback(
        async (): Promise<boolean> => {
            return withErrorHandling(async () => {
                const usage = await getStorageUsageInternal();
                return (
                    usage.usagePercent !== null &&
                    usage.usagePercent >= STORAGE_WARNING_THRESHOLD
                );
            }, false);
        },
        [withErrorHandling]
    );

    /**
     * Perform LRU eviction to free storage space (internal helper).
     */
    const evictOldestEntriesInternal = async (count: number): Promise<number> => {
        // Get oldest reports by cachedAt
        const oldestReports = await db.reports
            .orderBy('cachedAt')
            .limit(count)
            .toArray();

        if (oldestReports.length > 0) {
            await db.reports.bulkDelete(oldestReports.map((r) => r.id));
        }

        return oldestReports.length;
    };

    /**
     * Perform LRU eviction to free storage space.
     */
    const evictOldestEntries = useCallback(
        async (count: number): Promise<number> => {
            return withErrorHandling(() => evictOldestEntriesInternal(count), 0);
        },
        [withErrorHandling]
    );

    /**
     * Clear all sync queue items.
     */
    const clearSyncQueue = useCallback(
        async (): Promise<void> => {
            await withErrorHandling(async () => {
                await db.syncQueue.clear();
                return true;
            }, false);
        },
        [withErrorHandling]
    );

    return {
        isAvailable,
        isLoading,
        error,
        cacheReport,
        getCachedReport,
        getAllCachedReports,
        cacheInsight,
        getCachedInsights,
        addToSyncQueue,
        getPendingSyncItems,
        markSyncing,
        markSynced,
        markFailed,
        clearExpiredCache,
        getStorageUsage,
        isStorageLow,
        evictOldestEntries,
        clearSyncQueue,
    };
}

/**
 * Helper function to create a cached report with default expiration.
 */
export function createCachedReport(
    id: string,
    data: Record<string, unknown>,
    expirationMs: number = DEFAULT_CACHE_EXPIRATION_MS
): CachedReport {
    const now = new Date();
    return {
        id,
        data,
        cachedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + expirationMs).toISOString(),
    };
}

/**
 * Helper function to create a sync queue item.
 */
export function createSyncQueueItem(
    type: SyncQueueType,
    data: Record<string, unknown>
): Omit<SyncQueueItem, 'id'> {
    return {
        type,
        data,
        timestamp: new Date().toISOString(),
        status: 'pending',
        retryCount: 0,
    };
}
