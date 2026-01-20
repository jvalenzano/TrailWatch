/**
 * IndexedDB database configuration using Dexie.js.
 * Provides type-safe access to cached reports, insights, and sync queue.
 */

import Dexie, { type Table } from 'dexie';
import type { CachedReport, CachedInsight, SyncQueueItem } from './schema';

/**
 * TrailWatch IndexedDB database class.
 * Extends Dexie for type-safe table definitions.
 */
export class TrailWatchDB extends Dexie {
    /** Cached reports table */
    reports!: Table<CachedReport, string>;
    /** Cached insights table */
    insights!: Table<CachedInsight, string>;
    /** Sync queue table for offline operations */
    syncQueue!: Table<SyncQueueItem, number>;

    constructor() {
        super('TrailWatchDB');

        // Schema version 1
        this.version(1).stores({
            // Primary key: id, indexes: cachedAt, expiresAt
            reports: 'id, cachedAt, expiresAt',
            // Primary key: id, indexes: reportId, cachedAt
            insights: 'id, reportId, cachedAt',
            // Primary key: ++id (auto-increment), indexes: type, status, timestamp
            syncQueue: '++id, type, status, timestamp'
        });
    }
}

/**
 * Singleton database instance.
 * Use this for all database operations.
 */
export const db = new TrailWatchDB();

/**
 * Clear all data from the database.
 * Useful for testing and cache reset.
 */
export async function clearAllData(): Promise<void> {
    await db.reports.clear();
    await db.insights.clear();
    await db.syncQueue.clear();
}

/**
 * Delete the entire database.
 * Useful for testing and complete reset.
 */
export async function deleteDatabase(): Promise<void> {
    await db.delete();
}

/**
 * Check if IndexedDB is available in the current environment.
 */
export function isIndexedDBAvailable(): boolean {
    try {
        return typeof indexedDB !== 'undefined';
    } catch {
        return false;
    }
}
