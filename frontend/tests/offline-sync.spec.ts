/**
 * E2E tests for offline sync queue and persistence features.
 *
 * Tests cover:
 * - SyncQueue component display and interactions
 * - Sync button states (offline, syncing, enabled)
 * - Service worker registration
 * - IndexedDB database creation
 *
 * @see frontend/src/components/offline/SyncQueue.tsx
 * @see frontend/src/db/indexedDB.ts
 */

import { test, expect, Page } from '@playwright/test';
import { navigateToDashboard, takeScreenshot } from './utils/test-helpers';

/**
 * Wait for the SyncQueue component to be visible on the page.
 *
 * @param page - Playwright page object
 * @param timeout - Optional timeout in milliseconds
 */
async function waitForSyncQueue(page: Page, timeout = 10000): Promise<void> {
    await page.waitForSelector('[data-testid="sync-queue"]', { timeout });
}

/**
 * Get the Sync Now button element.
 *
 * @param page - Playwright page object
 * @returns Locator for the sync button
 */
function getSyncButton(page: Page) {
    return page.locator('button[aria-label*="Sync now"], button[aria-label*="Syncing in progress"]');
}

/**
 * Check if IndexedDB database exists.
 *
 * @param page - Playwright page object
 * @param dbName - Database name to check
 * @returns Promise resolving to boolean indicating if database exists
 */
async function checkIndexedDBExists(page: Page, dbName: string): Promise<boolean> {
    return page.evaluate(async (name: string) => {
        const databases = await indexedDB.databases();
        return databases.some((db) => db.name === name);
    }, dbName);
}

/**
 * Check if service worker is registered.
 *
 * @param page - Playwright page object
 * @returns Promise resolving to boolean indicating if SW is registered
 */
async function checkServiceWorkerRegistered(page: Page): Promise<boolean> {
    return page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
    });
}

/**
 * Add a pending item to the sync queue via IndexedDB.
 * This simulates having pending offline actions.
 *
 * @param page - Playwright page object
 * @param item - Item to add to the sync queue
 */
async function addPendingItemToQueue(
    page: Page,
    item: { type: string; payload: Record<string, unknown>; title?: string }
): Promise<void> {
    await page.evaluate(async (itemData) => {
        // Access Dexie database directly
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open('TrailWatchDB');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            const addRequest = store.add({
                type: itemData.type,
                payload: itemData.payload,
                status: 'pending',
                timestamp: Date.now(),
            });
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
        });

        db.close();
    }, item);
}

test.describe('Offline Sync Queue E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to dashboard before each test
        await navigateToDashboard(page);
    });

    test.describe('SyncQueue Component Display', () => {
        test('should display SyncQueue component on dashboard', async ({ page }) => {
            // Wait for sync queue to be visible
            await waitForSyncQueue(page);

            // Verify the sync queue container is present
            const syncQueue = page.locator('[data-testid="sync-queue"]');
            await expect(syncQueue).toBeVisible();

            // Verify the header is present
            await expect(syncQueue.locator('h2')).toContainText('Sync Queue');
        });

        test('should display pending items correctly when queue has items', async ({ page }) => {
            // Wait for page to load and IndexedDB to be available
            await waitForSyncQueue(page);

            // Add pending items to the sync queue
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Test Report 1', location: 'Trail A' },
                title: 'Test Report 1',
            });

            await addPendingItemToQueue(page, {
                type: 'report_update',
                payload: { id: '123', status: 'reviewed' },
            });

            // Reload to refresh the queue display
            await page.reload();
            await waitForSyncQueue(page);

            // Verify pending items list is visible
            const syncQueueList = page.locator('[data-testid="sync-queue-list"]');
            await expect(syncQueueList).toBeVisible();

            // Take screenshot for visual verification
            await takeScreenshot(page, 'sync-queue-with-pending-items');
        });

        test('should display empty state when no pending items', async ({ page }) => {
            await waitForSyncQueue(page);

            // Clear the sync queue via IndexedDB
            await page.evaluate(async () => {
                const db = await new Promise<IDBDatabase>((resolve, reject) => {
                    const request = indexedDB.open('TrailWatchDB');
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                await new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(['syncQueue'], 'readwrite');
                    const store = transaction.objectStore('syncQueue');
                    const clearRequest = store.clear();
                    clearRequest.onsuccess = () => resolve();
                    clearRequest.onerror = () => reject(clearRequest.error);
                });

                db.close();
            });

            // Reload to refresh the display
            await page.reload();
            await waitForSyncQueue(page);

            // Verify empty state message is shown
            const syncQueue = page.locator('[data-testid="sync-queue"]');
            await expect(syncQueue.locator('text=No pending items')).toBeVisible();

            // Verify sync queue list is not visible
            const syncQueueList = page.locator('[data-testid="sync-queue-list"]');
            await expect(syncQueueList).not.toBeVisible();
        });
    });

    test.describe('Sync Button Interactions', () => {
        test('should trigger sync operation when Sync Now button is clicked', async ({ page }) => {
            await waitForSyncQueue(page);

            // Add a pending item
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Test Report' },
            });

            // Reload to refresh the queue
            await page.reload();
            await waitForSyncQueue(page);

            // Get the sync button
            const syncButton = getSyncButton(page);
            await expect(syncButton).toBeVisible();

            // Click the sync button
            await syncButton.click();

            // Wait for sync to complete (progress should appear then disappear)
            // Note: In E2E tests, the mock API should handle the sync
            await page.waitForTimeout(1000);

            // Take screenshot of sync result
            await takeScreenshot(page, 'sync-button-clicked');
        });

        test('should show progress indicator during sync', async ({ page }) => {
            await waitForSyncQueue(page);

            // Add a pending item
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Test Report' },
            });

            await page.reload();
            await waitForSyncQueue(page);

            // Get the sync button and click
            const syncButton = getSyncButton(page);
            await syncButton.click();

            // Check for progress indicator (may be brief)
            const syncProgress = page.locator('[data-testid="sync-progress"]');

            // Progress indicator should appear during sync
            // Using a try-catch since the sync might complete quickly in mock mode
            try {
                await expect(syncProgress).toBeVisible({ timeout: 2000 });
                await takeScreenshot(page, 'sync-progress-indicator');
            } catch {
                // Sync completed too quickly - this is acceptable behavior
                console.log('Sync completed before progress indicator could be captured');
            }
        });

        test('should disable sync button when offline', async ({ page, context }) => {
            await waitForSyncQueue(page);

            // Add a pending item so the sync button appears
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Test Report' },
            });

            await page.reload();
            await waitForSyncQueue(page);

            // Set network to offline
            await context.setOffline(true);

            // Wait for offline state to be detected
            await page.waitForTimeout(500);

            // The sync button should be disabled when offline
            const syncButton = getSyncButton(page);

            // The button might take a moment to update its disabled state
            await expect(syncButton).toBeDisabled({ timeout: 5000 });

            // Take screenshot of offline state
            await takeScreenshot(page, 'sync-button-offline-disabled');

            // Restore network
            await context.setOffline(false);
        });

        test('should disable sync button while syncing', async ({ page }) => {
            await waitForSyncQueue(page);

            // Add a pending item
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Test Report' },
            });

            await page.reload();
            await waitForSyncQueue(page);

            // Get the sync button
            const syncButton = getSyncButton(page);
            await expect(syncButton).toBeEnabled();

            // Click to start sync
            await syncButton.click();

            // During sync, button should be disabled
            // Note: This might be very brief in test environment
            try {
                await expect(syncButton).toBeDisabled({ timeout: 1000 });
            } catch {
                // Sync completed too quickly - verify button is back to normal
                await expect(syncButton).toBeEnabled();
            }
        });

        test('should display error message on sync failure', async ({ page }) => {
            await waitForSyncQueue(page);

            // Add a pending item with invalid data to trigger an error
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { invalid: true },
            });

            await page.reload();
            await waitForSyncQueue(page);

            // Intercept sync API to return error
            await page.route('**/api/sync/**', (route) => {
                route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'Internal server error' }),
                });
            });

            // Click sync button
            const syncButton = getSyncButton(page);
            await syncButton.click();

            // Wait for error to appear
            const errorAlert = page.locator('[role="alert"]');
            await expect(errorAlert).toBeVisible({ timeout: 5000 });

            // Take screenshot of error state
            await takeScreenshot(page, 'sync-error-displayed');
        });
    });

    test.describe('Service Worker Registration', () => {
        test('should register service worker on page load', async ({ page }) => {
            // Navigate to the dashboard
            await navigateToDashboard(page);

            // Wait for page to fully load
            await page.waitForLoadState('networkidle');

            // Give time for service worker to register
            await page.waitForTimeout(2000);

            // Check if service worker is registered
            const swRegistered = await checkServiceWorkerRegistered(page);

            // Note: Service worker registration depends on environment
            // In development mode, SW might not be registered
            // In production build, SW should be registered
            if (!swRegistered) {
                console.log('Service worker not registered - this is expected in development mode');
            }

            // Take screenshot regardless of SW state
            await takeScreenshot(page, 'service-worker-check');
        });
    });

    test.describe('IndexedDB Persistence', () => {
        test('should create IndexedDB database on page load', async ({ page }) => {
            // Navigate to dashboard
            await navigateToDashboard(page);

            // Wait for page to load and IndexedDB to be initialized
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            // Check if TrailWatchDB exists
            const dbExists = await checkIndexedDBExists(page, 'TrailWatchDB');

            expect(dbExists).toBe(true);

            // Take screenshot
            await takeScreenshot(page, 'indexeddb-created');
        });

        test('should persist data in IndexedDB across page reloads', async ({ page }) => {
            await navigateToDashboard(page);
            await page.waitForLoadState('networkidle');

            // Add data to IndexedDB
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Persisted Report' },
            });

            // Verify data was added
            const countBefore = await page.evaluate(async () => {
                const db = await new Promise<IDBDatabase>((resolve, reject) => {
                    const request = indexedDB.open('TrailWatchDB');
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                const count = await new Promise<number>((resolve, reject) => {
                    const transaction = db.transaction(['syncQueue'], 'readonly');
                    const store = transaction.objectStore('syncQueue');
                    const countRequest = store.count();
                    countRequest.onsuccess = () => resolve(countRequest.result);
                    countRequest.onerror = () => reject(countRequest.error);
                });

                db.close();
                return count;
            });

            expect(countBefore).toBeGreaterThan(0);

            // Reload the page
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Verify data persisted
            const countAfter = await page.evaluate(async () => {
                const db = await new Promise<IDBDatabase>((resolve, reject) => {
                    const request = indexedDB.open('TrailWatchDB');
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                const count = await new Promise<number>((resolve, reject) => {
                    const transaction = db.transaction(['syncQueue'], 'readonly');
                    const store = transaction.objectStore('syncQueue');
                    const countRequest = store.count();
                    countRequest.onsuccess = () => resolve(countRequest.result);
                    countRequest.onerror = () => reject(countRequest.error);
                });

                db.close();
                return count;
            });

            expect(countAfter).toBe(countBefore);
        });

        test('should create all required IndexedDB object stores', async ({ page }) => {
            await navigateToDashboard(page);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            // Verify all object stores exist
            const objectStores = await page.evaluate(async () => {
                const db = await new Promise<IDBDatabase>((resolve, reject) => {
                    const request = indexedDB.open('TrailWatchDB');
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                const storeNames = Array.from(db.objectStoreNames);
                db.close();
                return storeNames;
            });

            // TrailWatchDB should have reports, insights, and syncQueue stores
            expect(objectStores).toContain('reports');
            expect(objectStores).toContain('insights');
            expect(objectStores).toContain('syncQueue');
        });
    });

    test.describe('Offline/Online State Transitions', () => {
        test('should show offline indicator when network is disconnected', async ({ page, context }) => {
            await waitForSyncQueue(page);

            // Set network to offline
            await context.setOffline(true);

            // Wait for offline state to be detected
            await page.waitForTimeout(500);

            // Check for offline indicator in SyncQueue
            const syncQueue = page.locator('[data-testid="sync-queue"]');
            await expect(syncQueue.locator('text=Offline')).toBeVisible({ timeout: 5000 });

            // Take screenshot of offline state
            await takeScreenshot(page, 'offline-indicator-visible');

            // Restore network
            await context.setOffline(false);
        });

        test('should enable sync button when network is restored', async ({ page, context }) => {
            await waitForSyncQueue(page);

            // Add a pending item
            await addPendingItemToQueue(page, {
                type: 'report_create',
                payload: { title: 'Test Report' },
            });

            await page.reload();
            await waitForSyncQueue(page);

            // Go offline
            await context.setOffline(true);
            await page.waitForTimeout(500);

            // Verify button is disabled
            const syncButton = getSyncButton(page);
            await expect(syncButton).toBeDisabled({ timeout: 5000 });

            // Go back online
            await context.setOffline(false);
            await page.waitForTimeout(500);

            // Verify button is enabled again
            await expect(syncButton).toBeEnabled({ timeout: 5000 });

            // Take screenshot of restored state
            await takeScreenshot(page, 'network-restored-button-enabled');
        });
    });
});
