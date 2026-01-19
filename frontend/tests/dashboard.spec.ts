import { test, expect } from '@playwright/test';
import {
    navigateToDashboard,
    switchDisplayMode,
    verifyLayoutForMode,
    getCurrentMode,
    takeScreenshot,
} from './utils/test-helpers';

test.describe('Dashboard UI Mode Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure screenshots directory exists
        await page.context().browser()?.newContext();
    });

    test('should navigate to dashboard and screenshot Traditional view', async ({ page }) => {
        // Navigate to dashboard in Traditional mode (default)
        await navigateToDashboard(page, 'traditional');

        // Verify we're in traditional mode with list-first layout
        await verifyLayoutForMode(page, 'traditional');

        // Take screenshot of Traditional view
        await takeScreenshot(page, 'dashboard-traditional-view');

        // Verify dashboard header is present
        await expect(page.locator('h1')).toContainText('Dashboard');
    });

    test('should switch Traditional → Moderate with layout unchanged', async ({ page }) => {
        // Start in Traditional mode
        await navigateToDashboard(page, 'traditional');
        await verifyLayoutForMode(page, 'traditional');

        // Take screenshot before switch
        await takeScreenshot(page, 'before-traditional-to-moderate');

        // Switch to Moderate mode
        await switchDisplayMode(page, 'moderate');

        // Verify mode changed
        const currentMode = await getCurrentMode(page);
        expect(currentMode).toBe('moderate');

        // Verify layout is still list-first (Traditional and Moderate share same layout)
        await verifyLayoutForMode(page, 'moderate');

        // Take screenshot after switch
        await takeScreenshot(page, 'after-traditional-to-moderate');

        // Both modes should use list-first-layout
        await expect(page.locator('[data-testid="list-first-layout"]')).toBeVisible();
    });

    test('should switch Moderate → Agentic with layout changed to map-first', async ({ page }) => {
        // Start in Moderate mode
        await navigateToDashboard(page, 'moderate');
        await verifyLayoutForMode(page, 'moderate');

        // Take screenshot before switch
        await takeScreenshot(page, 'before-moderate-to-agentic');

        // Verify list-first layout is present
        await expect(page.locator('[data-testid="list-first-layout"]')).toBeVisible();
        await expect(page.locator('[data-testid="map-first-layout"]')).not.toBeVisible();

        // Switch to Agentic mode
        await switchDisplayMode(page, 'agentic');

        // Verify mode changed
        const currentMode = await getCurrentMode(page);
        expect(currentMode).toBe('agentic');

        // Verify layout changed to map-first
        await verifyLayoutForMode(page, 'agentic');

        // Take screenshot after switch
        await takeScreenshot(page, 'after-moderate-to-agentic');

        // Agentic mode should use map-first-layout
        await expect(page.locator('[data-testid="map-first-layout"]')).toBeVisible();
        await expect(page.locator('[data-testid="list-first-layout"]')).not.toBeVisible();
    });

    test('should preserve state when cycling through all modes and returning to Traditional', async ({ page }) => {
        // Start in Traditional mode
        await navigateToDashboard(page, 'traditional');
        await verifyLayoutForMode(page, 'traditional');
        await takeScreenshot(page, 'cycle-1-traditional');

        // Cycle to Moderate
        await switchDisplayMode(page, 'moderate');
        await verifyLayoutForMode(page, 'moderate');
        await takeScreenshot(page, 'cycle-2-moderate');

        // Verify mode is correct
        let currentMode = await getCurrentMode(page);
        expect(currentMode).toBe('moderate');

        // Cycle to Agentic
        await switchDisplayMode(page, 'agentic');
        await verifyLayoutForMode(page, 'agentic');
        await takeScreenshot(page, 'cycle-3-agentic');

        // Verify mode and layout changed
        currentMode = await getCurrentMode(page);
        expect(currentMode).toBe('agentic');
        await expect(page.locator('[data-testid="map-first-layout"]')).toBeVisible();

        // Return to Traditional
        await switchDisplayMode(page, 'traditional');
        await verifyLayoutForMode(page, 'traditional');
        await takeScreenshot(page, 'cycle-4-back-to-traditional');

        // Verify we're back to Traditional with list-first layout
        currentMode = await getCurrentMode(page);
        expect(currentMode).toBe('traditional');
        await expect(page.locator('[data-testid="list-first-layout"]')).toBeVisible();
        await expect(page.locator('[data-testid="map-first-layout"]')).not.toBeVisible();
    });
});
