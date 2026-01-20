# WF9 Offline Mode - Parallel Execution Plan Using Subagents

**Status:** 3 of 12 tasks complete (25%)  
**Remaining:** 9 tasks  
**Strategy:** Parallel execution using subagents where no dependencies exist

---

## Dependency Analysis

### ✅ Completed (No dependencies on these)
- **OfflineBanner** - Uses `useOfflineStatus` hook
- **useOfflineStatus** - Provides: `isOffline`, `lastSyncTime`, `pendingSyncCount`, `triggerSync`, `addPendingItem`
- **CachedBadge** - Simple display component

### 🔄 Remaining Tasks & Dependencies

| Task | Complexity | Dependencies | Can Parallelize? |
|------|-----------|--------------|------------------|
| StalenessWarning | S | None (just displays warning) | ✅ Yes |
| OfflineMapOverlay | S | None (just displays message) | ✅ Yes |
| Mock API | S | None (just MSW handlers) | ✅ Yes |
| Service Worker | L | None (infrastructure) | ✅ Yes |
| IndexedDB | L | None (infrastructure) | ✅ Yes |
| SyncQueue | M | `useOfflineStatus` (done) | ✅ Yes* |
| E2E Testing | L | Everything | ❌ No (final) |

*SyncQueue can use in-memory queue initially, IndexedDB integration can happen later

---

## Parallel Execution Groups

### **Group 1: Simple UI Components** (Parallel - 3 subagents)
**No dependencies, can run simultaneously**

#### Subagent 1A: StalenessWarning Component
- **Task:** A.3.4 - Create StalenessWarning component (P0, S)
- **Files:** `frontend/src/components/offline/StalenessWarning.tsx` + test
- **Dependencies:** None
- **Estimated Time:** 15-20 minutes
- **Sandbox:** ✅ Safe (isolated component)

#### Subagent 1B: OfflineMapOverlay Component  
- **Task:** A.3.5 - Create OfflineMapOverlay component (P0, S)
- **Files:** `frontend/src/components/offline/OfflineMapOverlay.tsx` + test
- **Dependencies:** None
- **Estimated Time:** 15-20 minutes
- **Sandbox:** ✅ Safe (isolated component)

#### Subagent 1C: Mock Offline Sync Queue API
- **Task:** A.3.8 - Mock offline sync queue API (P0, S)
- **Files:** `frontend/src/mocks/handlers.ts` (add endpoints), `frontend/src/mocks/syncQueue.json`
- **Dependencies:** None
- **Estimated Time:** 10-15 minutes
- **Sandbox:** ✅ Safe (mock data only)

**Group 1 Total Estimated Time:** 20 minutes (parallel execution)

---

### **Group 2: Infrastructure Layer** (Parallel - 2 subagents)
**No dependencies, can run simultaneously**

#### Subagent 2A: Service Worker Implementation
- **Task:** A.3.6 - Implement service worker for offline caching (P0, L)
- **Files:** 
  - `frontend/vite.config.ts` (Workbox plugin config)
  - `frontend/src/service-worker.ts` (or auto-generated)
  - `frontend/public/sw.js` (if manual)
- **Dependencies:** None (infrastructure)
- **Estimated Time:** 45-60 minutes
- **Sandbox:** ✅ Safe (separate infrastructure layer)
- **Notes:** 
  - Set up `vite-plugin-pwa` or Workbox
  - Cache app shell, API responses, map tiles
  - Cache invalidation strategy

#### Subagent 2B: IndexedDB Persistence Layer
- **Task:** A.3.7 - Implement IndexedDB persistence layer (P0, L)
- **Files:**
  - `frontend/src/db/indexedDB.ts` (Dexie.js setup)
  - `frontend/src/db/schema.ts` (database schema)
  - `frontend/src/db/migrations.ts` (migration strategy)
  - `frontend/src/hooks/useIndexedDB.ts` (React integration)
- **Dependencies:** None (infrastructure)
- **Estimated Time:** 60-75 minutes
- **Sandbox:** ✅ Safe (separate persistence layer)
- **Notes:**
  - Use Dexie.js or native IndexedDB
  - Store: reports, spatial insights, pending actions
  - Integrate with React Query persistence
  - Handle storage quota limits

**Group 2 Total Estimated Time:** 75 minutes (parallel execution)

---

### **Group 3: SyncQueue Component** (Sequential after Group 1)
**Uses useOfflineStatus (already done), can use in-memory queue initially**

#### Subagent 3: SyncQueue Component
- **Task:** A.3.3 - Create SyncQueue component (P0, M)
- **Files:** `frontend/src/components/offline/SyncQueue.tsx` + test
- **Dependencies:** `useOfflineStatus` hook (✅ done)
- **Estimated Time:** 30-40 minutes
- **Sandbox:** ✅ Safe (uses existing hook)
- **Notes:**
  - Can use in-memory queue from `useOfflineStatus` initially
  - IndexedDB integration can be added later (from Group 2B)
  - Displays pending items, "Queue for Sync" button, progress indicator

**Group 3 Estimated Time:** 40 minutes (after Group 1 completes)

---

### **Group 4: E2E Testing** (Sequential - Final)
**Depends on all previous groups**

#### Subagent 4: E2E Offline Testing
- **Task:** A.3.9 - E2E offline testing (P0, L)
- **Files:** `frontend/tests/e2e/offline.test.ts` (Playwright)
- **Dependencies:** All previous tasks
- **Estimated Time:** 45-60 minutes
- **Sandbox:** ❌ Cannot parallelize (needs everything)
- **Notes:**
  - Test offline banner display
  - Test cached data display
  - Test staleness warnings
  - Test sync queue functionality
  - Test service worker caching
  - Test IndexedDB persistence
  - Test reconnection and sync

**Group 4 Estimated Time:** 60 minutes (final step)

---

## Execution Timeline

### Phase 1: Parallel Groups 1 & 2 (Start simultaneously)
```
Time 0:00
├─ Subagent 1A: StalenessWarning (20 min)
├─ Subagent 1B: OfflineMapOverlay (20 min)
├─ Subagent 1C: Mock API (15 min)
├─ Subagent 2A: Service Worker (60 min)
└─ Subagent 2B: IndexedDB (75 min)

Completion: ~75 minutes (longest task: IndexedDB)
```

### Phase 2: SyncQueue (After Phase 1)
```
Time 1:15
└─ Subagent 3: SyncQueue (40 min)

Completion: ~1:55 total
```

### Phase 3: E2E Testing (Final)
```
Time 1:55
└─ Subagent 4: E2E Testing (60 min)

Completion: ~2:55 total
```

**Total Estimated Time:** ~3 hours (vs ~6-8 hours sequential)

---

## Subagent Instructions

### For Subagent 1A (StalenessWarning)
```
Create StalenessWarning component:
- File: frontend/src/components/offline/StalenessWarning.tsx
- Yellow warning with "[OFFLINE - STALE]" text
- Explains data may not be current
- Accessible (aria-label, role="alert")
- Write unit tests (jest-axe)
- Follow TDD: Red → Green → Refactor
- Reference: docs/UI/wireframes/wf9_offline_mode.png
```

### For Subagent 1B (OfflineMapOverlay)
```
Create OfflineMapOverlay component:
- File: frontend/src/components/offline/OfflineMapOverlay.tsx
- Display "Live crew locations unavailable offline" message
- Tablet-optimized layout
- Accessible
- Write unit tests
- Follow TDD: Red → Green → Refactor
- Reference: docs/UI/wireframes/wf9_offline_mode.png
```

### For Subagent 1C (Mock API)
```
Add mock offline sync queue API endpoints:
- File: frontend/src/mocks/handlers.ts
- Endpoints:
  - GET /api/sync/queue - Get pending sync items
  - POST /api/sync/queue - Add item to sync queue
  - POST /api/sync/execute - Execute sync
  - GET /api/sync/status - Get sync status
- Create frontend/src/mocks/syncQueue.json with sample data
- Document API contract for backend team
```

### For Subagent 2A (Service Worker)
```
Implement service worker for offline caching:
- Install: vite-plugin-pwa or workbox-webpack-plugin
- Configure in vite.config.ts
- Cache strategy:
  - App shell: CacheFirst
  - API responses: StaleWhileRevalidate
  - Map tiles: CacheFirst
- Cache invalidation on version update
- Add manual cache clear option (dev tools)
- Test service worker registration
- Reference: docs/UI/wireframes/wf9_offline_mode.png
```

### For Subagent 2B (IndexedDB)
```
Implement IndexedDB persistence layer:
- Install Dexie.js (or use native IndexedDB)
- Create frontend/src/db/indexedDB.ts
- Schema:
  - reports (id, data, timestamp)
  - insights (id, data, timestamp)
  - syncQueue (id, type, data, timestamp)
- Migration strategy for schema changes
- Integrate with React Query persistence
- Handle storage quota limits
- Write unit tests
- Reference: docs/UI/wireframes/wf9_offline_mode.png
```

### For Subagent 3 (SyncQueue)
```
Create SyncQueue component:
- File: frontend/src/components/offline/SyncQueue.tsx
- Uses useOfflineStatus hook (already exists)
- List pending actions with descriptions
- Show "Queue for Sync" button
- Progress indicator during sync (use isSyncing from hook)
- Handle sync failures gracefully
- Can use in-memory queue initially (from useOfflineStatus)
- IndexedDB integration optional (can add later)
- Write unit tests
- Follow TDD: Red → Green → Refactor
- Reference: docs/UI/wireframes/wf9_offline_mode.png
```

### For Subagent 4 (E2E Testing)
```
Create E2E offline testing suite:
- File: frontend/tests/e2e/offline.test.ts (Playwright)
- Tests:
  - Offline banner displays when offline
  - Cached data displays correctly
  - Staleness warnings appear
  - Sync queue functionality works
  - Service worker caches resources
  - IndexedDB persists data
  - Reconnection triggers auto-sync
- Use Playwright's offline mode
- Test all offline features end-to-end
```

---

## Risk Mitigation

### Potential Conflicts
1. **File Overlaps:** None - each subagent works in separate files/directories
2. **Import Conflicts:** None - components are independent
3. **Test Conflicts:** None - each has separate test files
4. **Build Conflicts:** Service worker and IndexedDB are infrastructure (separate concerns)

### Merge Strategy
- All subagents commit to same branch: `feature/dashboard-phase-4-agentic`
- Merge order doesn't matter (no dependencies between parallel groups)
- If conflicts occur: Resolve by file (each subagent owns specific files)

### Quality Gates
- Each subagent must: >80% coverage, zero accessibility violations, all tests passing
- Run full test suite after each group completes
- Verify no regressions before moving to next phase

---

## Success Criteria

**Phase 1 Complete:**
- ✅ StalenessWarning component created and tested
- ✅ OfflineMapOverlay component created and tested
- ✅ Mock API endpoints added
- ✅ Service worker implemented and tested
- ✅ IndexedDB layer implemented and tested
- ✅ All tests passing (>80% coverage)

**Phase 2 Complete:**
- ✅ SyncQueue component created and tested
- ✅ Integration with useOfflineStatus verified
- ✅ All tests passing

**Phase 3 Complete:**
- ✅ E2E offline tests passing
- ✅ All offline features verified end-to-end
- ✅ WF9 Offline Mode 100% complete

---

## Estimated Time Savings

**Sequential Execution:** ~6-8 hours  
**Parallel Execution:** ~3 hours  
**Time Saved:** ~3-5 hours (50-60% reduction)

---

**Ready to execute?** Assign subagents to Groups 1 & 2 simultaneously, then proceed sequentially through Groups 3 & 4.
