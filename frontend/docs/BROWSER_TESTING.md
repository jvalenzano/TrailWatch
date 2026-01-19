# Browser Testing with Playwright

This guide explains how to run and debug E2E (end-to-end) browser tests for the TrailWatch frontend using Playwright.

## What is Playwright?

Playwright is a modern end-to-end testing framework developed by Microsoft. It allows you to:

- Automate browser interactions (clicking, typing, navigation)
- Test across multiple browsers (Chromium, Firefox, WebKit/Safari)
- Take screenshots and record videos of test runs
- Debug tests with step-by-step execution

TrailWatch uses Playwright to verify that the dashboard UI modes (Traditional, Moderate, Agentic) work correctly across different layouts.

## Headless vs Headed Mode

### Headless Mode (Default)

In headless mode, tests run without a visible browser window. This is:
- **Faster** - No rendering overhead
- **CI-friendly** - Works in environments without displays
- **Less resource-intensive** - Good for running many tests

```bash
npm test  # Runs in headless mode
```

### Headed Mode

In headed mode, you can **watch the browser** as tests execute. This is useful for:
- **Debugging** - See exactly what the test is doing
- **Development** - Verify visual behavior
- **Demos** - Show test execution to stakeholders

```bash
npm run test:ui  # Runs with visible browser window
```

## Running Tests

### Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:ui` | Run tests with visible browser |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run test:watch` | Interactive UI mode for development |

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test tests/dashboard.spec.ts

# Run tests matching a pattern
npx playwright test -g "Traditional"

# Run a single test by name
npx playwright test -g "should navigate to dashboard"
```

### Running with Different Browsers

By default, TrailWatch runs tests on WebKit (Safari) for Apple Silicon optimization. To run on other browsers:

```bash
# Run on Chromium
npx playwright test --project=chromium

# Run on Firefox
npx playwright test --project=firefox
```

## Debugging Tests

### Using Playwright Inspector

The Playwright Inspector provides step-by-step debugging:

```bash
npm run test:debug
```

This opens:
1. A browser window showing the test
2. The Inspector panel with:
   - Play/Pause controls
   - Step-through execution
   - Element selector tools
   - Action log

### Debug a Specific Test

```bash
npx playwright test --debug -g "should switch Moderate"
```

### Using the UI Mode

Playwright's UI mode provides an interactive development experience:

```bash
npm run test:watch
```

Features:
- Watch mode that re-runs on file changes
- Time-travel debugging
- DOM snapshots at each step
- Network request inspection

### Adding Debug Breakpoints

In your test code, use `page.pause()`:

```typescript
test('debug example', async ({ page }) => {
    await page.goto('/');
    await page.pause();  // Opens Inspector here
    await page.click('button');
});
```

## Understanding Test Output

### Screenshots

Screenshots are saved on test failure to:
```
frontend/test-results/screenshots/
```

Manual screenshots taken with `takeScreenshot()` are also saved here.

### Videos

Videos are recorded on first retry of failed tests:
```
frontend/test-results/
```

### HTML Report

After running tests, view the detailed HTML report:

```bash
npx playwright show-report
```

This opens a browser with:
- Test results summary
- Individual test details
- Screenshots and videos
- Trace viewer for failed tests

## Troubleshooting

### "Browser not installed"

Install the required browser:

```bash
npx playwright install webkit
```

Or install all browsers:

```bash
npx playwright install
```

### Tests timing out

1. **Increase timeout** in `playwright.config.ts`:
   ```typescript
   timeout: 60000,  // 60 seconds
   ```

2. **Check if dev server is running**:
   ```bash
   npm run dev  # In another terminal
   npm test
   ```

3. **Add explicit waits**:
   ```typescript
   await page.waitForSelector('[data-testid="element"]');
   ```

### Element not found

1. **Check the selector**:
   ```bash
   npx playwright codegen http://localhost:3000
   ```
   This opens a browser and generates selectors as you click.

2. **Wait for the element**:
   ```typescript
   await page.waitForSelector('[data-testid="element"]', {
       state: 'visible',
       timeout: 10000
   });
   ```

3. **Use the Inspector** to explore the DOM:
   ```bash
   npm run test:debug
   ```

### Flaky tests

1. **Add explicit waits** instead of relying on automatic waits
2. **Use `networkidle`** for pages with async data:
   ```typescript
   await page.goto('/', { waitUntil: 'networkidle' });
   ```
3. **Retry mechanism** is configured in `playwright.config.ts`

### Port already in use

If port 3000 is busy:

```bash
# Find the process
lsof -i :3000

# Kill it
kill -9 <PID>
```

Or change the port in `vite.config.ts` and `playwright.config.ts`.

## Test Structure

TrailWatch E2E tests are organized as:

```
frontend/
├── tests/
│   ├── dashboard.spec.ts     # Dashboard UI mode tests
│   └── utils/
│       └── test-helpers.ts   # Reusable test utilities
├── playwright.config.ts      # Playwright configuration
└── test-results/             # Test artifacts (gitignored)
```

### Test Helpers

Common operations are in `tests/utils/test-helpers.ts`:

```typescript
import {
    navigateToDashboard,
    switchDisplayMode,
    verifyLayoutForMode,
    getCurrentMode,
    takeScreenshot,
} from './utils/test-helpers';
```

## CI Integration

Tests run automatically in GitHub Actions on:
- Push to `main` or `develop`
- Pull requests

The CI workflow:
1. Installs dependencies
2. Runs Vitest unit tests
3. Runs Playwright E2E tests
4. Uploads test reports as artifacts

## Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Keep tests independent** - each test should work in isolation
3. **Use descriptive test names** that explain what's being tested
4. **Take screenshots** at key verification points
5. **Use the Page Object pattern** for complex pages (if needed)
6. **Run tests locally before pushing** to catch issues early
