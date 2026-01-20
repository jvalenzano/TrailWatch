/**
 * useOfflineStatus - Hook to detect and manage offline/online status.
 * Tracks connection status, last sync time, and pending sync queue.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/** Item waiting to be synced when connection is restored */
export interface PendingSyncItem {
    type: string;
    id: string;
    [key: string]: unknown;
}

export interface UseOfflineStatusResult {
    /** Whether the app is currently offline */
    isOffline: boolean;
    /** Whether the app is currently online */
    isOnline: boolean;
    /** Timestamp of the last successful sync */
    lastSyncTime: Date;
    /** Number of items waiting to be synced */
    pendingSyncCount: number;
    /** Items waiting to be synced */
    pendingItems: PendingSyncItem[];
    /** Whether a sync is currently in progress */
    isSyncing: boolean;
    /** Trigger a manual sync */
    triggerSync: () => Promise<boolean>;
    /** Add an item to the pending sync queue */
    addPendingItem: (item: PendingSyncItem) => void;
}

const LAST_SYNC_KEY = 'trailwatch_last_sync';

/**
 * Load last sync time from localStorage, or return current time.
 */
function loadLastSyncTime(): Date {
    try {
        const stored = localStorage.getItem(LAST_SYNC_KEY);
        if (stored) {
            return new Date(stored);
        }
    } catch {
        // localStorage may not be available
    }
    return new Date();
}

/**
 * Save last sync time to localStorage.
 */
function saveLastSyncTime(date: Date): void {
    try {
        localStorage.setItem(LAST_SYNC_KEY, date.toISOString());
    } catch {
        // localStorage may not be available
    }
}

/**
 * Hook to detect and manage offline/online status.
 *
 * Features:
 * - Detects online/offline status via navigator.onLine
 * - Listens for online/offline events
 * - Tracks last sync timestamp (persisted to localStorage)
 * - Manages pending sync queue
 * - Provides manual sync trigger
 * - Auto-syncs when connection is restored
 *
 * @example
 * const {
 *   isOffline,
 *   lastSyncTime,
 *   pendingSyncCount,
 *   triggerSync,
 *   addPendingItem
 * } = useOfflineStatus();
 *
 * // In OfflineBanner
 * <OfflineBanner
 *   isOffline={isOffline}
 *   lastSyncTime={lastSyncTime}
 *   pendingSyncCount={pendingSyncCount}
 * />
 *
 * // Queue an action while offline
 * if (isOffline) {
 *   addPendingItem({ type: 'report', id: reportId });
 * }
 */
export function useOfflineStatus(): UseOfflineStatusResult {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastSyncTime, setLastSyncTime] = useState<Date>(loadLastSyncTime);
    const [pendingItems, setPendingItems] = useState<PendingSyncItem[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // Track if we were previously offline to detect reconnection
    const wasOfflineRef = useRef(!navigator.onLine);

    /**
     * Perform sync operation - clears pending queue and updates sync time.
     * Returns true if sync was successful, false if offline.
     */
    const performSync = useCallback(async (): Promise<boolean> => {
        if (!navigator.onLine) {
            return false;
        }

        setIsSyncing(true);

        try {
            // In a real implementation, this would sync pending items to the server
            // For now, we just clear the queue and update the sync time
            await Promise.resolve(); // Simulate async operation

            const now = new Date();
            setLastSyncTime(now);
            saveLastSyncTime(now);
            setPendingItems([]);

            return true;
        } finally {
            setIsSyncing(false);
        }
    }, []);

    /**
     * Handle coming back online - auto-sync pending items.
     */
    const handleOnline = useCallback(() => {
        setIsOnline(true);

        // Auto-sync when coming back online
        if (wasOfflineRef.current) {
            performSync();
        }
        wasOfflineRef.current = false;
    }, [performSync]);

    /**
     * Handle going offline.
     */
    const handleOffline = useCallback(() => {
        setIsOnline(false);
        wasOfflineRef.current = true;
    }, []);

    // Set up event listeners for online/offline events
    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    /**
     * Add an item to the pending sync queue.
     */
    const addPendingItem = useCallback((item: PendingSyncItem) => {
        setPendingItems((prev) => [...prev, item]);
    }, []);

    /**
     * Trigger a manual sync.
     */
    const triggerSync = useCallback(async (): Promise<boolean> => {
        return performSync();
    }, [performSync]);

    return {
        isOffline: !isOnline,
        isOnline,
        lastSyncTime,
        pendingSyncCount: pendingItems.length,
        pendingItems,
        isSyncing,
        triggerSync,
        addPendingItem,
    };
}
