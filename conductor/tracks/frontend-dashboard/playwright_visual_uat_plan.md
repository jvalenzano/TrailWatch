# Phase 6 Streaming Extraction - Visual Playwright UAT Plan

**Date:** 2026-01-19
**Purpose:** Manual UAT with visible browser for Phase 6 Streaming Extraction verification
**Tester:** Human observer with Claude Code + Playwright MCP

---

## The Challenge: Headless vs Headed Mode

The Docker Desktop MCP Toolkit runs Playwright in a **headless Docker container** - you cannot see the browser window on your monitor. This is by design for automation but not ideal when you want to visually observe tests.

### Solutions for Visual Testing

#### Option A: Use Claude-in-Chrome (Recommended for Visual Observation)

The **Claude-in-Chrome** extension controls YOUR actual Chrome browser, making it fully visible:

1. Keep Chrome open on your monitor
2. Install/enable the Claude-in-Chrome extension
3. Use `mcp__claude-in-chrome__*` tools instead of `mcp__MCP_DOCKER__browser_*`
4. Watch the browser as Claude navigates and clicks

**Pros:** No setup, already installed, full visibility
**Cons:** Uses your personal browser session

#### Option B: Local Playwright with Headed Mode

Install Playwright locally (not via Docker) with `headless: false`:

```bash
# Install Playwright globally
npm install -g playwright
npx playwright install chromium

# Or in the project
cd frontend
npm install -D @playwright/test
npx playwright install chromium
```

Then run tests with:
```bash
npx playwright test --headed --project=chromium
```

**Pros:** Full control, visible browser
**Cons:** Requires local Playwright setup, separate test file

#### Option C: Docker with X11 Forwarding (macOS)

Enable X11 display forwarding from Docker to your Mac:

1. Install XQuartz: `brew install --cask xquartz`
2. Open XQuartz, go to Preferences > Security, enable "Allow connections from network clients"
3. Restart XQuartz
4. Run: `xhost +localhost`
5. Configure Docker to use display: `DISPLAY=host.docker.internal:0`

**Pros:** Works with existing Docker setup
**Cons:** Complex setup, can be flaky on macOS

---

## Recommended Approach: Claude-in-Chrome for Visual UAT

Since you already have Claude-in-Chrome installed and it provides full browser visibility, use it for visual UAT.

### Pre-UAT Checklist

- [ ] Close all browser windows
- [ ] Close any running dev servers (`Ctrl+C` in terminals)
- [ ] Open a fresh Chrome window
- [ ] Ensure Claude-in-Chrome extension is active (icon visible in Chrome toolbar)
- [ ] Open Claude Code in a fresh terminal

### Start Dev Servers

```bash
# Terminal 1: Backend (from repo root)
cd /Users/jvalenzano/Documents/10-TrailWatch
python -m uvicorn src.trailwatch.main:app --reload --port 8000

# Terminal 2: Frontend (from frontend directory)
cd /Users/jvalenzano/Documents/10-TrailWatch/frontend
npm run dev
# Note the port - likely 5173 or 5178
```

Wait for both servers to be ready before proceeding.

---

## UAT Test Scenarios

### TEST 1: Environment Validation

**Objective:** Verify dev environment is running correctly

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Open Chrome manually | Fresh browser window visible |
| 1.2 | Navigate to `http://localhost:5173/?mode=agentic` | TrailWatch dashboard loads |
| 1.3 | Check console (F12) | No red errors |
| 1.4 | Verify map loads | MapLibre map visible with trail markers |

### TEST 2: Streaming Extraction UI (Critical)

**Objective:** Verify streaming extraction is visible and functional in agentic mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | On dashboard, click any report card | Report Details panel opens on right |
| 2.2 | Look for "Start AI Extraction" button | Button visible (green/primary color) |
| 2.3 | Click "Start AI Extraction" | UI shows streaming state with spinner |
| 2.4 | Observe streaming progress | Progress bar animates, fields appear |
| 2.5 | Wait for completion OR error | Either success (green) or error (red) state |
| 2.6 | If error, verify "Try Again" button | Retry button visible and clickable |

**Note:** If backend extraction fails with 404, that's expected - the mock IDs don't exist in the real database. The test passes if the **UI correctly shows the error state**.

### TEST 3: Feature Gate Verification

**Objective:** Confirm streaming extraction only appears in agentic mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.1 | Navigate to `http://localhost:5173/?mode=traditional` | Dashboard in traditional mode |
| 3.2 | Click a report card | Report Details opens |
| 3.3 | Look for "Start AI Extraction" | Button should NOT be visible |
| 3.4 | Navigate to `http://localhost:5173/?mode=moderate` | Dashboard in moderate mode |
| 3.5 | Click a report card | Report Details opens |
| 3.6 | Look for "Start AI Extraction" | Button should NOT be visible |
| 3.7 | Navigate to `http://localhost:5173/?mode=agentic` | Dashboard in agentic mode |
| 3.8 | Click a report card | "Start AI Extraction" button IS visible |

### TEST 4: Responsive Breakpoints

**Objective:** Verify layout adapts correctly at different screen sizes

| Breakpoint | Width | Expected Layout |
|------------|-------|-----------------|
| Mobile | 375px | Tabbed navigation (Map/Insights/Reports tabs) |
| Tablet | 768px | Two-column: Insights + Reports below map |
| Desktop | 1400px | Three-column: Map + Insights + Reports side-by-side |

**Steps:**
1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Set responsive width to each breakpoint
4. Verify layout matches expected

### TEST 5: MarkerCluster Cleanup (Regression)

**Objective:** Verify no crashes during rapid layout changes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1 | Open dashboard at desktop width | Map with markers visible |
| 5.2 | Rapidly resize browser (drag edge) | No console errors, no crashes |
| 5.3 | Switch between breakpoints quickly | Layout adapts smoothly |
| 5.4 | Check console | Warning acceptable, no red errors |

---

## Claude Code Commands for Visual UAT

When ready to run the visual UAT with Claude, use these prompts:

```
# Get browser context
Use tabs_context_mcp to see available Chrome tabs

# Navigate to app
Navigate to http://localhost:5173/?mode=agentic

# Take screenshot
Take a screenshot of the current page

# Find elements
Find the "Start AI Extraction" button

# Click element
Click the Start AI Extraction button

# Read page state
Read the current page accessibility tree
```

---

## Expected Results Summary

| Test | Critical | Pass Criteria |
|------|----------|---------------|
| TEST 1 | Yes | Dashboard loads, no console errors |
| TEST 2 | Yes | Streaming UI visible, handles errors gracefully |
| TEST 3 | Yes | Button only in agentic mode |
| TEST 4 | No | Layouts match breakpoints |
| TEST 5 | No | No crashes during resize |

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>

# Find and kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Chrome Extension Not Responding
1. Close Chrome completely
2. Reopen Chrome
3. Navigate to `chrome://extensions`
4. Disable and re-enable Claude-in-Chrome
5. Restart Claude Code

### Backend 404 on Extraction
This is expected! Mock report IDs from the frontend don't exist in the backend database. The test passes if the UI shows an error state with "Try Again" button.

### Vite Blocked Host
If accessing from Docker, ensure `vite.config.ts` has:
```typescript
server: {
  allowedHosts: ['host.docker.internal', 'localhost'],
}
```

---

## Post-UAT Report

After completing visual UAT, document results in:
`conductor/tracks/frontend-dashboard/phase6_streaming_UAT.md`

Update the "Browser UAT Verification" section with:
- Screenshots captured
- Pass/fail for each test
- Any issues discovered
- Timestamp and tester notes
