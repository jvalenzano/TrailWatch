import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOfflineStatus } from './useOfflineStatus';

// Store original navigator.onLine
const originalOnLine = navigator.onLine;

function setOnlineStatus(isOnline: boolean) {
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: isOnline,
    });
}

function triggerOnlineEvent() {
    window.dispatchEvent(new Event('online'));
}

function triggerOfflineEvent() {
    window.dispatchEvent(new Event('offline'));
}

describe('useOfflineStatus', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        setOnlineStatus(true);
    });

    afterEach(() => {
        vi.useRealTimers();
        // Restore original online status
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            configurable: true,
            value: originalOnLine,
        });
    });

    describe('online/offline detection', () => {
        it('returns isOffline false when navigator.onLine is true', () => {
            setOnlineStatus(true);

            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.isOffline).toBe(false);
            expect(result.current.isOnline).toBe(true);
        });

        it('returns isOffline true when navigator.onLine is false', () => {
            setOnlineStatus(false);

            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.isOffline).toBe(true);
            expect(result.current.isOnline).toBe(false);
        });

        it('updates status when offline event is fired', () => {
            setOnlineStatus(true);
            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.isOffline).toBe(false);

            act(() => {
                setOnlineStatus(false);
                triggerOfflineEvent();
            });

            expect(result.current.isOffline).toBe(true);
        });

        it('updates status when online event is fired', () => {
            setOnlineStatus(false);
            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.isOffline).toBe(true);

            act(() => {
                setOnlineStatus(true);
                triggerOnlineEvent();
            });

            expect(result.current.isOffline).toBe(false);
        });
    });

    describe('last sync time tracking', () => {
        it('initializes lastSyncTime to current time', () => {
            const now = new Date('2026-01-19T12:00:00Z');
            vi.setSystemTime(now);

            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.lastSyncTime).toEqual(now);
        });

        it('updates lastSyncTime when sync is triggered', async () => {
            const initialTime = new Date('2026-01-19T12:00:00Z');
            vi.setSystemTime(initialTime);

            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.lastSyncTime).toEqual(initialTime);

            // Advance time
            const laterTime = new Date('2026-01-19T14:00:00Z');
            vi.setSystemTime(laterTime);

            await act(async () => {
                await result.current.triggerSync();
            });

            expect(result.current.lastSyncTime).toEqual(laterTime);
        });

        it('updates lastSyncTime when coming back online', async () => {
            const initialTime = new Date('2026-01-19T12:00:00Z');
            vi.setSystemTime(initialTime);
            setOnlineStatus(false);

            const { result } = renderHook(() => useOfflineStatus());

            // Advance time and come back online
            const laterTime = new Date('2026-01-19T14:00:00Z');
            vi.setSystemTime(laterTime);

            await act(async () => {
                setOnlineStatus(true);
                triggerOnlineEvent();
                // Allow auto-sync to complete
                await vi.runAllTimersAsync();
            });

            expect(result.current.lastSyncTime).toEqual(laterTime);
        });
    });

    describe('pending sync queue', () => {
        it('initializes with zero pending items', () => {
            const { result } = renderHook(() => useOfflineStatus());

            expect(result.current.pendingSyncCount).toBe(0);
        });

        it('allows adding items to pending queue', () => {
            const { result } = renderHook(() => useOfflineStatus());

            act(() => {
                result.current.addPendingItem({ type: 'report', id: '123' });
            });

            expect(result.current.pendingSyncCount).toBe(1);
        });

        it('increments count when multiple items added', () => {
            const { result } = renderHook(() => useOfflineStatus());

            act(() => {
                result.current.addPendingItem({ type: 'report', id: '123' });
                result.current.addPendingItem({ type: 'report', id: '456' });
                result.current.addPendingItem({ type: 'assignment', id: '789' });
            });

            expect(result.current.pendingSyncCount).toBe(3);
        });

        it('clears pending queue on successful sync', async () => {
            const { result } = renderHook(() => useOfflineStatus());

            act(() => {
                result.current.addPendingItem({ type: 'report', id: '123' });
                result.current.addPendingItem({ type: 'report', id: '456' });
            });

            expect(result.current.pendingSyncCount).toBe(2);

            await act(async () => {
                await result.current.triggerSync();
            });

            expect(result.current.pendingSyncCount).toBe(0);
        });

        it('provides access to pending items', () => {
            const { result } = renderHook(() => useOfflineStatus());

            const item1 = { type: 'report', id: '123' };
            const item2 = { type: 'assignment', id: '456' };

            act(() => {
                result.current.addPendingItem(item1);
                result.current.addPendingItem(item2);
            });

            expect(result.current.pendingItems).toEqual([item1, item2]);
        });
    });

    describe('manual sync trigger', () => {
        it('provides triggerSync function', () => {
            const { result } = renderHook(() => useOfflineStatus());

            expect(typeof result.current.triggerSync).toBe('function');
        });

        it('sets isSyncing to false after sync completes', async () => {
            const { result } = renderHook(() => useOfflineStatus());

            // Initially not syncing
            expect(result.current.isSyncing).toBe(false);

            await act(async () => {
                await result.current.triggerSync();
            });

            // After sync completes, should be false
            expect(result.current.isSyncing).toBe(false);
        });

        it('does not sync when offline', async () => {
            setOnlineStatus(false);
            const { result } = renderHook(() => useOfflineStatus());

            const initialSyncTime = result.current.lastSyncTime;

            await act(async () => {
                await result.current.triggerSync();
            });

            // Sync time should not update when offline
            expect(result.current.lastSyncTime).toEqual(initialSyncTime);
        });

        it('returns success status from triggerSync', async () => {
            setOnlineStatus(true);
            const { result } = renderHook(() => useOfflineStatus());

            let syncResult: boolean | undefined;

            await act(async () => {
                syncResult = await result.current.triggerSync();
            });

            expect(syncResult).toBe(true);
        });

        it('returns false when sync fails (offline)', async () => {
            setOnlineStatus(false);
            const { result } = renderHook(() => useOfflineStatus());

            let syncResult: boolean | undefined;

            await act(async () => {
                syncResult = await result.current.triggerSync();
            });

            expect(syncResult).toBe(false);
        });
    });

    describe('reconnection handling', () => {
        it('automatically syncs when coming back online', async () => {
            setOnlineStatus(false);
            const { result } = renderHook(() => useOfflineStatus());

            act(() => {
                result.current.addPendingItem({ type: 'report', id: '123' });
            });

            expect(result.current.pendingSyncCount).toBe(1);

            await act(async () => {
                setOnlineStatus(true);
                triggerOnlineEvent();
                // Allow auto-sync to complete
                await vi.runAllTimersAsync();
            });

            expect(result.current.pendingSyncCount).toBe(0);
        });

        it('updates lastSyncTime on reconnection', async () => {
            const initialTime = new Date('2026-01-19T12:00:00Z');
            vi.setSystemTime(initialTime);
            setOnlineStatus(false);

            const { result } = renderHook(() => useOfflineStatus());

            const laterTime = new Date('2026-01-19T14:00:00Z');
            vi.setSystemTime(laterTime);

            await act(async () => {
                setOnlineStatus(true);
                triggerOnlineEvent();
                await vi.runAllTimersAsync();
            });

            expect(result.current.lastSyncTime).toEqual(laterTime);
        });
    });

    describe('cleanup', () => {
        it('removes event listeners on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = renderHook(() => useOfflineStatus());

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });
    });

});
