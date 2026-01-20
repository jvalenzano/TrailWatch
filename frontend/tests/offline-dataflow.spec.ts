/**
 * E2E Playwright tests for offline data flow and reconnection.
 *
 * Tests the offline/online detection, cached data visibility,
 * and network status change handling in the Dashboard.
 *
 * @see frontend/src/components/offline/OfflineBanner.tsx
 * @see frontend/src/hooks/useOfflineStatus.ts
 */

import { test, expect, Page } from '@playwright/test';
import { navigateToDashboard, takeScreenshot } from './utils/test-helpers';

/**
 * Helper to set network offline/online state
 */
async function setOfflineState(page: Page, offline: boolean): Promise<void> {
    await page.context().setOffline(offline);
    // Small delay to allow React to process the network change event
    await page.waitForTimeout(100);
}

/**
 * Helper to verify the offline banner visibility
 */
async function verifyOfflineBannerVisible(page: Page): Promise<void> {
    const offlineBanner = page.locator('[data-testid="offline-banner"]');
    await expect(offlineBanner).toBeVisible();
    await expect(offlineBanner).toContainText('OFFLINE MODE');
}

/**
 * Helper to verify the offline banner is not visible
 */
async function verifyOfflineBannerNotVisible(page: Page): Promise<void> {
    const offlineBanner = page.locator('[data-testid="offline-banner"]');
    await expect(offlineBanner).not.toBeVisible();
}

/**
 * Helper to verify dashboard layout is visible (any mode)
 */
async function verifyDashboardLayoutVisible(page: Page): Promise<void> {
    // Either list-first or map-first layout should be visible
    const listFirstLayout = page.locator('[data-testid="list-first-layout"]');
    const mapFirstLayout = page.locator('[data-testid="map-first-layout"]');

    // Wait for at least one layout to be available
    await page.waitForSelector(
        '[data-testid="list-first-layout"], [data-testid="map-first-layout"]',
        { timeout: 10000 }
    );

    // Verify at least one layout is visible
    const listVisible = await listFirstLayout.isVisible().catch(() => false);
    const mapVisible = await mapFirstLayout.isVisible().catch(() => false);

    expect(listVisible || mapVisible).toBe(true);
}

test.describe('Offline Data Flow Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure we start in online mode
        await setOfflineState(page, false);
    });

    test.afterEach(async ({ page }) => {
        // Reset to online mode after each test
        await setOfflineState(page, false);
    });

    test('should load dashboard successfully in online mode', async ({ page }) => {
        // Navigate to dashboard
        await navigateToDashboard(page, 'traditional');

        // Verify dashboard layout is visible
        await verifyDashboardLayoutVisible(page);

        // Verify offline banner is NOT visible when online
        await verifyOfflineBannerNotVisible(page);

        // Verify dashboard header is present
        await expect(page.locator('h1')).toContainText('Dashboard');

        // Take screenshot for visual verification
        await takeScreenshot(page, 'offline-test-online-mode');
    });

    test('should show offline banner when going offline', async ({ page }) => {
        // Navigate to dashboard in online mode
        await navigateToDashboard(page, 'traditional');
        await verifyDashboardLayoutVisible(page);

        // Verify initially online (no offline banner)
        await verifyOfflineBannerNotVisible(page);

        // Take screenshot before going offline
        await takeScreenshot(page, 'offline-test-before-offline');

        // Go offline
        await setOfflineState(page, true);

        // Verify offline banner appears
        await verifyOfflineBannerVisible(page);

        // Take screenshot showing offline state
        await takeScreenshot(page, 'offline-test-after-offline');
    });

    test('should still show cached data when offline', async ({ page }) => {
        // Navigate to dashboard in online mode
        await navigateToDashboard(page, 'traditional');

        // Verify dashboard layout is visible
        await verifyDashboardLayoutVisible(page);

        // Go offline
        await setOfflineState(page, true);

        // Verify offline banner appears
        await verifyOfflineBannerVisible(page);

        // Verify the dashboard layout is STILL visible (cached data)
        await verifyDashboardLayoutVisible(page);

        // Verify dashboard header is still present
        await expect(page.locator('h1')).toContainText('Dashboard');

        // Take screenshot showing cached data is visible while offline
        await takeScreenshot(page, 'offline-test-cached-data-visible');
    });

    test('should hide offline banner when going back online', async ({ page }) => {
        // Navigate to dashboard
        await navigateToDashboard(page, 'traditional');
        await verifyDashboardLayoutVisible(page);

        // Go offline first
        await setOfflineState(page, true);
        await verifyOfflineBannerVisible(page);

        // Take screenshot while offline
        await takeScreenshot(page, 'offline-test-reconnection-offline');

        // Go back online
        await setOfflineState(page, false);

        // Verify offline banner disappears
        await verifyOfflineBannerNotVisible(page);

        // Take screenshot after reconnection
        await takeScreenshot(page, 'offline-test-reconnection-online');
    });

    test('should handle full offline to online cycle correctly', async ({ page }) => {
        // Step 1: Start online
        await navigateToDashboard(page, 'traditional');
        await verifyDashboardLayoutVisible(page);
        await verifyOfflineBannerNotVisible(page);
        await takeScreenshot(page, 'offline-cycle-1-online');

        // Step 2: Go offline
        await setOfflineState(page, true);
        await verifyOfflineBannerVisible(page);
        await verifyDashboardLayoutVisible(page);
        await takeScreenshot(page, 'offline-cycle-2-offline');

        // Step 3: Go back online
        await setOfflineState(page, false);
        await verifyOfflineBannerNotVisible(page);
        await verifyDashboardLayoutVisible(page);
        await takeScreenshot(page, 'offline-cycle-3-back-online');

        // Step 4: Go offline again (verify state can toggle multiple times)
        await setOfflineState(page, true);
        await verifyOfflineBannerVisible(page);
        await takeScreenshot(page, 'offline-cycle-4-offline-again');

        // Step 5: Go online again
        await setOfflineState(page, false);
        await verifyOfflineBannerNotVisible(page);
        await takeScreenshot(page, 'offline-cycle-5-online-final');
    });

    test('should preserve offline state awareness after page reload', async ({ page }) => {
        // Navigate to dashboard
        await navigateToDashboard(page, 'traditional');
        await verifyDashboardLayoutVisible(page);

        // Go offline
        await setOfflineState(page, true);
        await verifyOfflineBannerVisible(page);

        // Take screenshot before reload
        await takeScreenshot(page, 'offline-reload-before');

        // Reload the page while offline
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Verify dashboard layout is still visible after reload
        await verifyDashboardLayoutVisible(page);

        // Verify offline banner is shown after reload (since we're still offline)
        await verifyOfflineBannerVisible(page);

        // Take screenshot after reload
        await takeScreenshot(page, 'offline-reload-after');

        // Go back online
        await setOfflineState(page, false);

        // Verify offline banner disappears
        await verifyOfflineBannerNotVisible(page);

        // Take screenshot in online state
        await takeScreenshot(page, 'offline-reload-online');
    });

    test('should detect network status changes correctly', async ({ page }) => {
        // Navigate to dashboard
        await navigateToDashboard(page, 'traditional');
        await verifyDashboardLayoutVisible(page);

        // Test rapid toggling of network state
        const offlineBanner = page.locator('[data-testid="offline-banner"]');

        // Initially online
        await expect(offlineBanner).not.toBeVisible();

        // Toggle 1: Online -> Offline
        await setOfflineState(page, true);
        await expect(offlineBanner).toBeVisible();

        // Toggle 2: Offline -> Online
        await setOfflineState(page, false);
        await expect(offlineBanner).not.toBeVisible();

        // Toggle 3: Online -> Offline
        await setOfflineState(page, true);
        await expect(offlineBanner).toBeVisible();

        // Verify the banner still shows the correct content
        await expect(offlineBanner).toContainText('OFFLINE MODE');
        await expect(offlineBanner).toContainText('Last sync');
        await expect(offlineBanner).toContainText('Data may be stale');

        // Final screenshot
        await takeScreenshot(page, 'offline-network-status-detection');
    });

    test('should work correctly in agentic mode', async ({ page }) => {
        // Navigate to dashboard in agentic mode
        await navigateToDashboard(page, 'agentic');

        // Wait for agentic layout to load
        await page.waitForSelector('[data-testid="map-first-layout"]', { timeout: 10000 });

        // Verify offline banner is NOT visible when online
        await verifyOfflineBannerNotVisible(page);

        // Take screenshot of agentic mode online
        await takeScreenshot(page, 'offline-agentic-mode-online');

        // Go offline
        await setOfflineState(page, true);

        // Verify offline banner appears in agentic mode
        await verifyOfflineBannerVisible(page);

        // Verify agentic layout is still visible
        const mapFirstLayout = page.locator('[data-testid="map-first-layout"]');
        await expect(mapFirstLayout).toBeVisible();

        // Take screenshot of agentic mode offline
        await takeScreenshot(page, 'offline-agentic-mode-offline');

        // Go back online
        await setOfflineState(page, false);
        await verifyOfflineBannerNotVisible(page);

        // Take final screenshot
        await takeScreenshot(page, 'offline-agentic-mode-reconnected');
    });
});
