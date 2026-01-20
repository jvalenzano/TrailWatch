/**
 * Tests for useIndexedDB hook.
 * Uses fake-indexeddb to mock IndexedDB operations.
 */

import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIndexedDB, createCachedReport, createSyncQueueItem } from './useIndexedDB';
import { db } from '../db/indexedDB';
import type { CachedReport, CachedInsight } from '../db/schema';

/**
 * Helper to clear database between tests.
 * Must be called outside of fake timers context.
 */
async function clearDatabase(): Promise<void> {
    await db.reports.clear();
    await db.insights.clear();
    await db.syncQueue.clear();
}

describe('useIndexedDB', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        vi.useRealTimers();
        await clearDatabase();
    });

    describe('initialization', () => {
        it('returns isAvailable as true when IndexedDB is available', () => {
            const { result } = renderHook(() => useIndexedDB());

            expect(result.current.isAvailable).toBe(true);
        });

        it('initializes with no error', () => {
            const { result } = renderHook(() => useIndexedDB());

            expect(result.current.error).toBeNull();
        });

        it('initializes with isLoading false', () => {
            const { result } = renderHook(() => useIndexedDB());

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('report caching', () => {
        it('caches a report successfully', async () => {
            const { result } = renderHook(() => useIndexedDB());

            const report: CachedReport = {
                id: 'report-123',
                data: { title: 'Test Report', status: 'new' },
                cachedAt: '2026-01-19T12:00:00Z',
                expiresAt: '2026-01-20T12:00:00Z',
            };

            let success = false;
            await act(async () => {
                success = await result.current.cacheReport(report);
            });

            expect(success).toBe(true);
        });

        it('retrieves a cached report by ID', async () => {
            const { result } = renderHook(() => useIndexedDB());

            const report: CachedReport = {
                id: 'report-456',
                data: { title: 'Another Report', status: 'pending' },
                cachedAt: '2026-01-19T12:00:00Z',
                expiresAt: '2026-01-20T12:00:00Z',
            };

            await act(async () => {
                await result.current.cacheReport(report);
            });

            let retrieved: CachedReport | undefined;
            await act(async () => {
                retrieved = await result.current.getCachedReport('report-456');
            });

            expect(retrieved).toEqual(report);
        });

        it('returns undefined for non-existent report', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let retrieved: CachedReport | undefined;
            await act(async () => {
                retrieved = await result.current.getCachedReport('non-existent');
            });

            expect(retrieved).toBeUndefined();
        });

        it('returns undefined for expired report', async () => {
            const { result } = renderHook(() => useIndexedDB());

            const report: CachedReport = {
                id: 'report-expired',
                data: { title: 'Expired Report' },
                cachedAt: '2026-01-19T12:00:00Z',
                expiresAt: '2020-01-19T11:00:00Z', // Far in the past
            };

            await db.reports.put(report); // Insert directly to bypass expiration check

            let retrieved: CachedReport | undefined;
            await act(async () => {
                retrieved = await result.current.getCachedReport('report-expired');
            });

            expect(retrieved).toBeUndefined();
        });

        it('retrieves all cached reports', async () => {
            const { result } = renderHook(() => useIndexedDB());

            // Use future dates to ensure reports are not expired
            const reports: CachedReport[] = [
                {
                    id: 'report-1',
                    data: { title: 'Report 1' },
                    cachedAt: '2026-01-19T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z',
                },
                {
                    id: 'report-2',
                    data: { title: 'Report 2' },
                    cachedAt: '2026-01-19T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z',
                },
            ];

            await act(async () => {
                for (const report of reports) {
                    await result.current.cacheReport(report);
                }
            });

            let allReports: CachedReport[] = [];
            await act(async () => {
                allReports = await result.current.getAllCachedReports();
            });

            expect(allReports).toHaveLength(2);
            expect(allReports.map((r) => r.id).sort()).toEqual(['report-1', 'report-2']);
        });

        it('excludes expired reports from getAllCachedReports', async () => {
            const { result } = renderHook(() => useIndexedDB());

            // Insert reports directly to control expiration
            await db.reports.bulkPut([
                {
                    id: 'report-valid',
                    data: { title: 'Valid' },
                    cachedAt: '2026-01-19T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z', // Future
                },
                {
                    id: 'report-expired',
                    data: { title: 'Expired' },
                    cachedAt: '2026-01-18T12:00:00Z',
                    expiresAt: '2020-01-19T11:00:00Z', // Past
                },
            ]);

            let allReports: CachedReport[] = [];
            await act(async () => {
                allReports = await result.current.getAllCachedReports();
            });

            expect(allReports).toHaveLength(1);
            expect(allReports[0].id).toBe('report-valid');
        });
    });

    describe('insight caching', () => {
        it('caches an insight successfully', async () => {
            const { result } = renderHook(() => useIndexedDB());

            const insight: CachedInsight = {
                id: 'insight-123',
                reportId: 'report-456',
                data: { type: 'cluster', severity: 'high' },
                cachedAt: '2026-01-19T12:00:00Z',
            };

            let success = false;
            await act(async () => {
                success = await result.current.cacheInsight(insight);
            });

            expect(success).toBe(true);
        });

        it('retrieves cached insights by report ID', async () => {
            const { result } = renderHook(() => useIndexedDB());

            const insights: CachedInsight[] = [
                {
                    id: 'insight-1',
                    reportId: 'report-456',
                    data: { type: 'cluster' },
                    cachedAt: '2026-01-19T12:00:00Z',
                },
                {
                    id: 'insight-2',
                    reportId: 'report-456',
                    data: { type: 'duplicate' },
                    cachedAt: '2026-01-19T12:00:00Z',
                },
                {
                    id: 'insight-3',
                    reportId: 'report-789', // Different report
                    data: { type: 'anomaly' },
                    cachedAt: '2026-01-19T12:00:00Z',
                },
            ];

            await act(async () => {
                for (const insight of insights) {
                    await result.current.cacheInsight(insight);
                }
            });

            let reportInsights: CachedInsight[] = [];
            await act(async () => {
                reportInsights = await result.current.getCachedInsights('report-456');
            });

            expect(reportInsights).toHaveLength(2);
            expect(reportInsights.map((i) => i.id).sort()).toEqual(['insight-1', 'insight-2']);
        });

        it('returns empty array when no insights for report', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let insights: CachedInsight[] = [];
            await act(async () => {
                insights = await result.current.getCachedInsights('non-existent');
            });

            expect(insights).toEqual([]);
        });
    });

    describe('sync queue operations', () => {
        it('adds item to sync queue', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let id: number | undefined;
            await act(async () => {
                id = await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'New Report' },
                    timestamp: '2026-01-19T12:00:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
            });

            expect(id).toBeDefined();
            expect(typeof id).toBe('number');
        });

        it('retrieves pending sync items', async () => {
            const { result } = renderHook(() => useIndexedDB());

            await act(async () => {
                await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'Report 1' },
                    timestamp: '2026-01-19T12:00:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
                await result.current.addToSyncQueue({
                    type: 'report_update',
                    data: { id: 'report-123', status: 'reviewed' },
                    timestamp: '2026-01-19T12:01:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
            });

            let pending: Array<{ id?: number; type: string }> = [];
            await act(async () => {
                pending = await result.current.getPendingSyncItems();
            });

            expect(pending).toHaveLength(2);
        });

        it('marks sync item as syncing', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let id: number | undefined;
            await act(async () => {
                id = await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'Report' },
                    timestamp: '2026-01-19T12:00:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
            });

            let success = false;
            await act(async () => {
                success = await result.current.markSyncing(id!);
            });

            expect(success).toBe(true);

            // Verify status changed
            const item = await db.syncQueue.get(id!);
            expect(item?.status).toBe('syncing');
        });

        it('marks sync item as synced (removes it)', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let id: number | undefined;
            await act(async () => {
                id = await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'Report' },
                    timestamp: '2026-01-19T12:00:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
            });

            let success = false;
            await act(async () => {
                success = await result.current.markSynced(id!);
            });

            expect(success).toBe(true);

            // Verify item removed
            const item = await db.syncQueue.get(id!);
            expect(item).toBeUndefined();
        });

        it('marks sync item as failed and increments retry count', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let id: number | undefined;
            await act(async () => {
                id = await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'Report' },
                    timestamp: '2026-01-19T12:00:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
            });

            let success = false;
            await act(async () => {
                success = await result.current.markFailed(id!);
            });

            expect(success).toBe(true);

            // Verify status and retry count
            const item = await db.syncQueue.get(id!);
            expect(item?.status).toBe('failed');
            expect(item?.retryCount).toBe(1);
        });

        it('excludes items with max retries from pending list', async () => {
            const { result } = renderHook(() => useIndexedDB());

            // Insert directly to control retry count
            await db.syncQueue.add({
                type: 'report_create',
                data: { title: 'Max Retries' },
                timestamp: '2026-01-19T12:00:00Z',
                status: 'failed',
                retryCount: 3, // MAX_RETRY_COUNT
            });

            await db.syncQueue.add({
                type: 'report_update',
                data: { title: 'Still Pending' },
                timestamp: '2026-01-19T12:01:00Z',
                status: 'pending',
                retryCount: 0,
            });

            let pending: Array<{ id?: number; type: string }> = [];
            await act(async () => {
                pending = await result.current.getPendingSyncItems();
            });

            expect(pending).toHaveLength(1);
            expect(pending[0].type).toBe('report_update');
        });

        it('clears sync queue', async () => {
            const { result } = renderHook(() => useIndexedDB());

            await act(async () => {
                await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'Report 1' },
                    timestamp: '2026-01-19T12:00:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
                await result.current.addToSyncQueue({
                    type: 'report_create',
                    data: { title: 'Report 2' },
                    timestamp: '2026-01-19T12:01:00Z',
                    status: 'pending',
                    retryCount: 0,
                });
            });

            await act(async () => {
                await result.current.clearSyncQueue();
            });

            const count = await db.syncQueue.count();
            expect(count).toBe(0);
        });
    });

    describe('cache expiration', () => {
        it('clears expired cache entries', async () => {
            const { result } = renderHook(() => useIndexedDB());

            // Insert reports with different expiration times
            await db.reports.bulkPut([
                {
                    id: 'report-valid-1',
                    data: { title: 'Valid 1' },
                    cachedAt: '2026-01-19T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z', // Future
                },
                {
                    id: 'report-expired-1',
                    data: { title: 'Expired 1' },
                    cachedAt: '2026-01-18T12:00:00Z',
                    expiresAt: '2020-01-19T11:00:00Z', // Past
                },
                {
                    id: 'report-expired-2',
                    data: { title: 'Expired 2' },
                    cachedAt: '2026-01-17T12:00:00Z',
                    expiresAt: '2020-01-18T12:00:00Z', // Past
                },
            ]);

            let clearedCount = 0;
            await act(async () => {
                clearedCount = await result.current.clearExpiredCache();
            });

            expect(clearedCount).toBe(2);

            const remaining = await db.reports.count();
            expect(remaining).toBe(1);
        });

        it('returns 0 when no expired entries', async () => {
            const { result } = renderHook(() => useIndexedDB());

            await db.reports.put({
                id: 'report-valid',
                data: { title: 'Valid' },
                cachedAt: '2026-01-19T12:00:00Z',
                expiresAt: '2030-01-20T12:00:00Z', // Future
            });

            let clearedCount = 0;
            await act(async () => {
                clearedCount = await result.current.clearExpiredCache();
            });

            expect(clearedCount).toBe(0);
        });
    });

    describe('storage management', () => {
        it('returns storage usage information', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let usage: { usedBytes: number; quotaBytes: number | null; usagePercent: number | null };
            await act(async () => {
                usage = await result.current.getStorageUsage();
            });

            expect(usage!.usedBytes).toBeGreaterThanOrEqual(0);
            // quotaBytes and usagePercent may be null if Storage API not available
        });

        it('evicts oldest entries', async () => {
            const { result } = renderHook(() => useIndexedDB());

            // Insert reports with different cache times
            await db.reports.bulkPut([
                {
                    id: 'report-oldest',
                    data: { title: 'Oldest' },
                    cachedAt: '2026-01-17T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z',
                },
                {
                    id: 'report-middle',
                    data: { title: 'Middle' },
                    cachedAt: '2026-01-18T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z',
                },
                {
                    id: 'report-newest',
                    data: { title: 'Newest' },
                    cachedAt: '2026-01-19T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z',
                },
            ]);

            let evictedCount = 0;
            await act(async () => {
                evictedCount = await result.current.evictOldestEntries(2);
            });

            expect(evictedCount).toBe(2);

            const remaining = await db.reports.toArray();
            expect(remaining).toHaveLength(1);
            expect(remaining[0].id).toBe('report-newest');
        });

        it('isStorageLow returns false when storage is not constrained', async () => {
            const { result } = renderHook(() => useIndexedDB());

            let isLow = true;
            await act(async () => {
                isLow = await result.current.isStorageLow();
            });

            // In test environment, storage should not be low
            expect(isLow).toBe(false);
        });
    });

    describe('error handling', () => {
        it('initializes with no error', async () => {
            const { result } = renderHook(() => useIndexedDB());

            expect(result.current.error).toBeNull();
        });

        it('clears error on successful operation', async () => {
            const { result } = renderHook(() => useIndexedDB());

            await act(async () => {
                await result.current.cacheReport({
                    id: 'report-test',
                    data: { title: 'Test' },
                    cachedAt: '2026-01-19T12:00:00Z',
                    expiresAt: '2030-01-20T12:00:00Z',
                });
            });

            expect(result.current.error).toBeNull();
        });
    });
});

describe('helper functions', () => {
    describe('createCachedReport', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('creates a cached report with default expiration', () => {
            vi.setSystemTime(new Date('2026-01-19T12:00:00.000Z'));

            const report = createCachedReport('report-123', { title: 'Test' });

            expect(report.id).toBe('report-123');
            expect(report.data).toEqual({ title: 'Test' });
            expect(report.cachedAt).toBe('2026-01-19T12:00:00.000Z');
            // Default expiration is 24 hours
            expect(report.expiresAt).toBe('2026-01-20T12:00:00.000Z');
        });

        it('creates a cached report with custom expiration', () => {
            vi.setSystemTime(new Date('2026-01-19T12:00:00.000Z'));

            // 1 hour expiration
            const report = createCachedReport('report-456', { title: 'Test' }, 60 * 60 * 1000);

            expect(report.expiresAt).toBe('2026-01-19T13:00:00.000Z');
        });
    });

    describe('createSyncQueueItem', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('creates a sync queue item with correct defaults', () => {
            vi.setSystemTime(new Date('2026-01-19T12:00:00.000Z'));

            const item = createSyncQueueItem('report_create', { title: 'New Report' });

            expect(item.type).toBe('report_create');
            expect(item.data).toEqual({ title: 'New Report' });
            expect(item.timestamp).toBe('2026-01-19T12:00:00.000Z');
            expect(item.status).toBe('pending');
            expect(item.retryCount).toBe(0);
        });

        it('handles different sync types', () => {
            vi.setSystemTime(new Date('2026-01-19T12:00:00.000Z'));

            const createItem = createSyncQueueItem('report_create', { title: 'New' });
            const updateItem = createSyncQueueItem('report_update', { id: '123', status: 'reviewed' });
            const actionItem = createSyncQueueItem('insight_action', { insightId: '456', action: 'dismiss' });

            expect(createItem.type).toBe('report_create');
            expect(updateItem.type).toBe('report_update');
            expect(actionItem.type).toBe('insight_action');
        });
    });
});
