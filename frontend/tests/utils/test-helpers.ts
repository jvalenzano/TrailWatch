import { Page, expect } from '@playwright/test';

/** UI mode names supported by TrailWatch */
export type UIModeName = 'traditional' | 'moderate' | 'agentic';

/** Layout types corresponding to UI modes */
export type LayoutType = 'list-first' | 'map-first';

/**
 * Navigate to the dashboard page with an optional UI mode.
 *
 * @param page - Playwright page object
 * @param mode - Optional UI mode to set via URL parameter
 * @returns Promise that resolves when navigation is complete
 *
 * @example
 * ```ts
 * await navigateToDashboard(page); // Default mode
 * await navigateToDashboard(page, 'agentic'); // Agentic mode
 * ```
 */
export async function navigateToDashboard(page: Page, mode?: UIModeName): Promise<void> {
    const url = mode ? `/?mode=${mode}` : '/';
    await page.goto(url);
    await page.waitForLoadState('networkidle');
}

/**
 * Switch the UI display mode by updating the URL parameter.
 *
 * @param page - Playwright page object
 * @param mode - Target UI mode to switch to
 * @returns Promise that resolves when mode switch is complete
 *
 * @example
 * ```ts
 * await switchDisplayMode(page, 'moderate');
 * ```
 */
export async function switchDisplayMode(page: Page, mode: UIModeName): Promise<void> {
    const currentUrl = new URL(page.url());
    currentUrl.searchParams.set('mode', mode);
    await page.goto(currentUrl.toString());
    await waitForLayoutChange(page, mode);
}

/**
 * Wait for the layout to transition to the expected state for a given mode.
 *
 * @param page - Playwright page object
 * @param mode - The UI mode that determines expected layout
 * @returns Promise that resolves when layout transition is complete
 *
 * @example
 * ```ts
 * await waitForLayoutChange(page, 'agentic'); // Waits for map-first layout
 * ```
 */
export async function waitForLayoutChange(page: Page, mode: UIModeName): Promise<void> {
    const expectedLayout = getLayoutForMode(mode);

    if (expectedLayout === 'map-first') {
        await page.waitForSelector('[data-testid="map-first-layout"]', { timeout: 10000 });
    } else {
        await page.waitForSelector('[data-testid="list-first-layout"]', { timeout: 10000 });
    }
}

/**
 * Get the current UI mode from the URL parameters.
 *
 * @param page - Playwright page object
 * @returns The current UI mode name, defaults to 'traditional' if not set
 *
 * @example
 * ```ts
 * const mode = await getCurrentMode(page);
 * console.log(mode); // 'traditional' | 'moderate' | 'agentic'
 * ```
 */
export async function getCurrentMode(page: Page): Promise<UIModeName> {
    const currentUrl = new URL(page.url());
    const mode = currentUrl.searchParams.get('mode');
    return (mode as UIModeName) ?? 'traditional';
}

/**
 * Verify that the current layout matches the expected layout for a given mode.
 *
 * @param page - Playwright page object
 * @param mode - The UI mode to verify layout against
 * @returns Promise that resolves if layout is correct, throws if not
 *
 * @example
 * ```ts
 * await verifyLayoutForMode(page, 'agentic');
 * // Asserts that map-first-layout is visible
 * ```
 */
export async function verifyLayoutForMode(page: Page, mode: UIModeName): Promise<void> {
    const expectedLayout = getLayoutForMode(mode);

    if (expectedLayout === 'map-first') {
        await expect(page.locator('[data-testid="map-first-layout"]')).toBeVisible();
        await expect(page.locator('[data-testid="list-first-layout"]')).not.toBeVisible();
    } else {
        await expect(page.locator('[data-testid="list-first-layout"]')).toBeVisible();
        await expect(page.locator('[data-testid="map-first-layout"]')).not.toBeVisible();
    }
}

/**
 * Get the expected layout type for a given UI mode.
 *
 * @param mode - The UI mode name
 * @returns The layout type ('list-first' or 'map-first')
 *
 * @remarks
 * - Traditional and Moderate modes use list-first layout
 * - Agentic mode uses map-first layout
 */
function getLayoutForMode(mode: UIModeName): LayoutType {
    return mode === 'agentic' ? 'map-first' : 'list-first';
}

/**
 * Take a screenshot with a descriptive name.
 *
 * @param page - Playwright page object
 * @param name - Screenshot name (without extension)
 * @returns Promise that resolves when screenshot is saved
 *
 * @example
 * ```ts
 * await takeScreenshot(page, 'dashboard-traditional-view');
 * ```
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({
        path: `test-results/screenshots/${name}.png`,
        fullPage: true,
    });
}
