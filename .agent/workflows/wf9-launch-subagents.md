# WF9 Offline Mode - Launch Parallel Subagents

**Status:** 3 of 11 tasks complete (27%)  
**Next Action:** Launch 5 subagents in parallel to complete remaining tasks  
**Time Savings:** ~3-5 hours (50-60% reduction vs sequential)

---

## 🚀 Launch Instructions for Claude Code

**CRITICAL: Use subagents for parallel execution. Do NOT execute these tasks sequentially.**

Launch **5 subagents simultaneously** to work on independent tasks in parallel. Each subagent operates in its own sandbox with no file conflicts.

---

## Subagents to Launch

### **Subagent 1: StalenessWarning Component**
**Task:** A.3.4 - Create StalenessWarning component (P0, S)  
**File:** `frontend/src/components/offline/StalenessWarning.tsx` + test  
**Dependencies:** None  
**Estimated Time:** 15-20 minutes

**Instructions:**
```
Create StalenessWarning component:
- Yellow warning with "[OFFLINE - STALE]" text
- Explains data may not be current
- Accessible (aria-label, role="alert")
- Write unit tests (jest-axe)
- Follow TDD: Red → Green → Refactor
- Reference: docs/UI/wireframes/wf9_offline_mode.png
- Similar pattern to CachedBadge (just completed)
```

---

### **Subagent 2: OfflineMapOverlay Component**
**Task:** A.3.5 - Create OfflineMapOverlay component (P0, S)  
**File:** `frontend/src/components/offline/OfflineMapOverlay.tsx` + test  
**Dependencies:** None  
**Estimated Time:** 15-20 minutes

**Instructions:**
```
Create OfflineMapOverlay component:
- Display "Live crew locations unavailable offline" message
- Tablet-optimized layout
- Accessible
- Write unit tests
- Follow TDD: Red → Green → Refactor
- Reference: docs/UI/wireframes/wf9_offline_mode.png
```

---

### **Subagent 3: Mock Offline Sync Queue API**
**Task:** A.3.8 - Mock offline sync queue API (P0, S)  
**Files:** `frontend/src/mocks/handlers.ts` (add endpoints), `frontend/src/mocks/syncQueue.json`  
**Dependencies:** None  
**Estimated Time:** 10-15 minutes

**Instructions:**
```
Add mock offline sync queue API endpoints to MSW handlers:
- GET /api/sync/queue - Get pending sync items
- POST /api/sync/queue - Add item to sync queue
- POST /api/sync/execute - Execute sync
- GET /api/sync/status - Get sync status
- Create frontend/src/mocks/syncQueue.json with sample data
- Document API contract for backend team
- Follow existing MSW handler patterns
```

---

### **Subagent 4: Service Worker Implementation**
**Task:** A.3.6 - Implement service worker for offline caching (P0, L)  
**Files:** `frontend/vite.config.ts`, service worker config  
**Dependencies:** None (infrastructure)  
**Estimated Time:** 45-60 minutes

**Instructions:**
```
Implement service worker for offline caching:
1. Install vite-plugin-pwa: npm install vite-plugin-pwa --save-dev
2. Configure in vite.config.ts:
   - Cache app shell (CacheFirst strategy)
   - Cache API responses (StaleWhileRevalidate strategy)
   - Cache map tiles (CacheFirst strategy)
3. Set up cache invalidation on version update
4. Add manual cache clear option (dev tools)
5. Test service worker registration
6. Reference: docs/UI/wireframes/wf9_offline_mode.png
7. Follow Vite PWA plugin documentation
```

---

### **Subagent 5: IndexedDB Persistence Layer**
**Task:** A.3.7 - Implement IndexedDB persistence layer (P0, L)  
**Files:** `frontend/src/db/indexedDB.ts`, `frontend/src/db/schema.ts`, `frontend/src/hooks/useIndexedDB.ts`  
**Dependencies:** None (infrastructure)  
**Estimated Time:** 60-75 minutes

**Instructions:**
```
Implement IndexedDB persistence layer:
1. Install Dexie.js: npm install dexie --save
2. Create frontend/src/db/indexedDB.ts:
   - Set up Dexie database
   - Define schema: reports, insights, syncQueue tables
3. Create frontend/src/db/schema.ts:
   - TypeScript interfaces for database schema
   - Migration strategy for schema changes
4. Create frontend/src/hooks/useIndexedDB.ts:
   - React hooks for IndexedDB operations
   - Integrate with React Query persistence
5. Handle storage quota limits gracefully
6. Write unit tests
7. Reference: docs/UI/wireframes/wf9_offline_mode.png
```

---

## Execution Steps

### Step 1: Launch All 5 Subagents Simultaneously
```
Launch subagents 1-5 in parallel. Each subagent:
- Works in its own sandbox
- Has no file conflicts with others
- Can commit independently
- Must pass all tests before completion
```

### Step 2: Monitor Progress
- Each subagent should update `plan.md` when complete: `[x] Task: ... — <commit-sha>`
- Verify all tests passing after each subagent completes
- Check for any merge conflicts (unlikely - separate files)

### Step 3: After All 5 Complete
- Run full test suite: `npm run test:unit`
- Verify >80% coverage maintained
- Verify zero accessibility violations
- Proceed to SyncQueue component (A.3.3) - uses `useOfflineStatus` hook

### Step 4: Final E2E Testing
- After SyncQueue complete, run E2E offline tests (A.3.9)
- Test all offline features end-to-end

---

## Quality Gates (Each Subagent Must Meet)

- ✅ All tests passing (>80% coverage)
- ✅ Zero accessibility violations (jest-axe)
- ✅ TypeScript compilation passes (`npx tsc --noEmit`)
- ✅ Linting passes (`npm run lint`)
- ✅ Follows TDD: Red → Green → Refactor
- ✅ Updates `plan.md` with completion status and commit SHA

---

## File Ownership (No Conflicts)

| Subagent | Files | Conflict Risk |
|----------|-------|---------------|
| 1. StalenessWarning | `StalenessWarning.tsx`, `StalenessWarning.test.tsx` | None |
| 2. OfflineMapOverlay | `OfflineMapOverlay.tsx`, `OfflineMapOverlay.test.tsx` | None |
| 3. Mock API | `handlers.ts` (add endpoints), `syncQueue.json` | Low (adds to existing file) |
| 4. Service Worker | `vite.config.ts` (modify), service worker files | Low (config changes) |
| 5. IndexedDB | `db/` directory (new), `hooks/useIndexedDB.ts` | None |

**Note:** Subagent 3 modifies `handlers.ts` - coordinate if needed, but MSW handlers are additive (low conflict risk).

---

## Success Criteria

**Phase 1 Complete (All 5 Subagents):**
- ✅ StalenessWarning component created and tested
- ✅ OfflineMapOverlay component created and tested
- ✅ Mock API endpoints added
- ✅ Service worker implemented and tested
- ✅ IndexedDB layer implemented and tested
- ✅ All tests passing (695+ tests)
- ✅ >80% coverage maintained
- ✅ Zero accessibility violations

**Then Proceed To:**
- SyncQueue component (A.3.3) - sequential
- E2E offline testing (A.3.9) - final

---

## Quick Reference

**Plan Document:** `.agent/workflows/wf9-parallel-execution-plan.md` (detailed)  
**Current Progress:** 3/11 tasks complete (27%)  
**Remaining:** 8 tasks (5 can parallelize, 2 sequential, 1 final)  
**Estimated Total Time:** ~3 hours (parallel) vs ~6-8 hours (sequential)

---

**🚀 READY TO LAUNCH: Use subagents to execute tasks 1-5 in parallel.**
