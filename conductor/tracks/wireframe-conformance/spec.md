# Specification: Wireframe Conformance & Feature Completion

**Track ID:** `wireframe-conformance`  
**Type:** Feature Track  
**Status:** Planned  
**Dependencies:** `agentic-mode` (foundation)

---

## 1. Goal

Bring the TrailWatch Agentic UI from **~35% wireframe conformance to 100%** by:
1. Implementing 3 major unimplemented features (Batch Assignment WF6, Offline Mode WF9, Feature Admin WF10)
2. Enhancing 7 partially-implemented wireframes to full conformance
3. Achieving production-ready quality (accessibility, performance, testing)

---

## 2. Context

### Current State
- **Phase 4 Agentic Mode** has foundational structure (layout, insights, clustering)
- **52 gaps** identified across 10 wireframes
- **0 wireframes fully conformant**, 7 partially implemented, 3 not implemented
- **Reference:** [WIREFRAME_CONFORMANCE_AUDIT.md](../../../docs/UI/WIREFRAME_CONFORMANCE_AUDIT.md)

### Wireframe Status
| Wireframe | Conformance | Status |
|-----------|-------------|--------|
| WF1: Spatial Baseline | 55% | Partial |
| WF2: Cluster Alert | 40% | Partial |
| WF3: Report Detail | 50% | Partial |
| WF4: AI Reasoning | 60% | Partial |
| WF5: Duplicate Detection | 35% | Partial |
| WF6: Batch Assignment | 0% | **Not Implemented** |
| WF7: High-Risk Decision | 65% | Partial |
| WF8: Consistency Check | 40% | Partial |
| WF9: Offline Mode | 0% | **Not Implemented** |
| WF10: Feature Admin | 0% | **Not Implemented** |

---

## 3. Functional Requirements

### Phase 4.2: Core Feature Implementation

#### FR-001: Batch Assignment (WF6)
**Priority:** P0 (Critical)

**Requirements:**
- Modal workflow for assigning multiple reports to a crew
- District selector with "Suggested: Most common district" hint
- Crew selector that populates based on district
- Crew context card showing:
  - Recent performance indicator (excellent/good/fair/poor)
  - Last assignment date
  - Current capacity percentage
- Route summary displaying:
  - Total distance (miles)
  - Estimated travel time (hours)
  - Estimated work time (hours)
- Report checklist with selected reports
- Cancel and Assign action buttons
- Integration with route optimization API (backend)

**Acceptance Criteria:**
- [ ] Modal opens with list of selected reports
- [ ] District dropdown shows suggestion based on most common district
- [ ] Crew dropdown populates based on selected district
- [ ] Route summary updates when crew is selected
- [ ] Crew context card shows performance metrics
- [ ] Assign button disabled until district and crew selected
- [ ] Cancel button closes modal without changes
- [ ] Loading state shown during API call
- [ ] >80% test coverage
- [ ] Accessible (keyboard navigation, ARIA labels)

**Wireframe Reference:** `docs/UI/wireframes/wf6_batch_assignment.png`

#### FR-002: Offline Mode (WF9)
**Priority:** P0 (Critical)

**Requirements:**
- Orange "OFFLINE MODE" banner at top with satellite icon
- Sync timestamp display ("Last sync: 2 hours ago. Data may be stale.")
- Yellow "[CACHED]" badges on reports
- Yellow "[OFFLINE - STALE]" warnings on AI suggestions
- "Queue for Sync" button for queuing actions
- Map overlay message ("Live crew locations unavailable offline")
- Tablet-optimized layout
- Service worker for offline caching
- IndexedDB persistence layer
- Sync queue API integration (backend)

**Acceptance Criteria:**
- [ ] Banner visible when offline, hidden when online
- [ ] Shows relative time since last sync
- [ ] Cached badges appear on cached data
- [ ] Staleness warnings on AI suggestions
- [ ] Sync queue UI functional
- [ ] Service worker caches app shell and API responses
- [ ] IndexedDB stores reports, insights, and pending actions
- [ ] Smooth show/hide animations
- [ ] Tablet-responsive layout
- [ ] >80% test coverage
- [ ] E2E offline testing passes

**Wireframe Reference:** `docs/UI/wireframes/wf9_offline_mode.png`

#### FR-003: Feature Admin Panel (WF10)
**Priority:** P0 (Critical)

**Requirements:**
- Header: "Trust Calibration & Feature Management"
- Feature cards in horizontal layout showing:
  - Feature name
  - Status badge (Enabled/Beta/Alpha/Disabled)
  - Metric (Adoption Rate, Acceptance Rate, Active Pilot Users)
  - Action buttons (Enable for All, Disable, Promote to Beta)
- Confirmation dialogs for destructive actions
- Feature flag API integration (backend)
- Role-based access control (admin only)
- Route: `/admin/features`

**Acceptance Criteria:**
- [ ] Admin panel accessible at `/admin/features`
- [ ] Only admin users can access (RBAC)
- [ ] Feature cards display all required information
- [ ] Status badges with correct colors (green/amber/red/gray)
- [ ] Action buttons functional with confirmations
- [ ] Loading states during API calls
- [ ] >80% test coverage
- [ ] Accessible (keyboard navigation, ARIA labels)

**Wireframe Reference:** `docs/UI/wireframes/wf10_feature_flag_admin.png`

### Phase 4.3: Component Enhancements

#### FR-004: Dashboard Enhancements (WF1, WF2, WF3)
**Priority:** P0 (Critical)

**Requirements:**
- **WF1:** Report multi-select checkboxes, "Assign Crew" and "Extract Info" buttons, trend level indicators (Low/Medium/High), report count in header
- **WF2:** Critical alert card with red border, "Show AI Reasoning" expandable link, pulsing cluster radius with label, cluster-filtered report list, "Assign Cluster" button, spatial insights menu items, warning triangle icons in markers
- **WF3:** Numbered section headers (1. PHOTO, 2. AI CLASSIFICATION, etc.), classification timestamp, assignment reasoning text, left navigation menu, location highlight with blue radius, trail overlay

**Acceptance Criteria:**
- [ ] All WF1 enhancements implemented and tested
- [ ] All WF2 enhancements implemented and tested
- [ ] All WF3 enhancements implemented and tested
- [ ] >80% test coverage maintained
- [ ] Visual QA matches wireframes

#### FR-005: Duplicate Detection Enhancement (WF5)
**Priority:** P0 (Critical)

**Requirements:**
- Yellow "POSSIBLE DUPLICATE" header with warning icon
- Side-by-side photo comparison (thumbnails)
- GPS coordinates for both reports
- Description preview for both reports
- Status badges (NEW, ASSIGNED, etc.)
- Distance visualization between reports
- Map visualization with connected markers
- Action buttons: "Mark as Duplicate", "Keep Separate", "View Both on Map"

**Acceptance Criteria:**
- [ ] Full side-by-side comparison card implemented
- [ ] All visual elements match wireframe
- [ ] Action buttons functional
- [ ] Map integration working
- [ ] >80% test coverage
- [ ] Accessible

**Wireframe Reference:** `docs/UI/wireframes/wf5_duplicate_detection.png`

#### FR-006: Consistency Check Enhancement (WF8)
**Priority:** P0 (Critical)

**Requirements:**
- Yellow "CONSISTENCY CHECK" card with warning icon
- Statistics display ("In last 60 days, 18 assignments to District 3, 0 to District 4.")
- Horizontal bar chart showing distribution
- Explanations list (possible causes)
- "View Coverage Map" button
- "Acknowledge" and "Dismiss" buttons
- District boundary map overlay

**Acceptance Criteria:**
- [ ] Bar chart component implemented
- [ ] Explanations displayed
- [ ] Action buttons functional
- [ ] District boundary layer on map
- [ ] Yellow alert styling matches wireframe
- [ ] >80% test coverage

**Wireframe Reference:** `docs/UI/wireframes/wf8_consistency_check.png`

#### FR-007: High-Risk Enhancement (WF7)
**Priority:** P0 (Critical)

**Requirements:**
- 4th checklist item ("Severity appropriate")
- Mandatory justification textarea (min 50 characters)
- Character counter display
- Button disabled until checklist + justification complete
- Pulsing red hazard radius on map
- Hazard icon markers (bridge, etc.)

**Acceptance Criteria:**
- [ ] All 4 checklist items present
- [ ] Justification field with validation
- [ ] Character counter functional
- [ ] Button state logic correct
- [ ] Hazard radius overlay on map
- [ ] >80% test coverage

**Wireframe Reference:** `docs/UI/wireframes/wf7_high_risk_decision.png`

#### FR-008: AI Reasoning Enhancement (WF4)
**Priority:** P1 (High)

**Requirements:**
- Step numbering (Step 1:, Step 2:, etc.)
- Tool name display in steps (e.g., "Tool: vision-api-gemini-2.0")
- Alternative classifications with confidence percentages
- "View Full Audit Log" link
- 2-column report detail layout (optional, P2)

**Acceptance Criteria:**
- [ ] Steps numbered in UI
- [ ] Tool names displayed
- [ ] Alternative classifications shown
- [ ] Audit log link functional
- [ ] >80% test coverage

**Wireframe Reference:** `docs/UI/wireframes/wf4_report_detail_reasoning.png`

### Phase 4.4: Polish & Integration

#### FR-009: Visual QA & Conformance
**Priority:** P0 (Critical)

**Requirements:**
- Visual QA against all 10 wireframes
- 100% conformance verified
- Screenshots captured for documentation
- Deviations documented with rationale

**Acceptance Criteria:**
- [ ] All wireframes visually verified
- [ ] 100% conformance achieved
- [ ] Documentation updated

#### FR-010: Accessibility Compliance
**Priority:** P0 (Critical)

**Requirements:**
- WCAG 2.1 AA compliance
- Zero accessibility violations
- Keyboard navigation for all interactive elements
- Screen reader compatibility
- Focus indicators visible

**Acceptance Criteria:**
- [ ] jest-axe tests pass (zero violations)
- [ ] Manual keyboard navigation verified
- [ ] Screen reader testing complete
- [ ] Focus indicators visible

#### FR-011: Performance Targets
**Priority:** P1 (High)

**Requirements:**
- Initial load < 3 seconds
- Interaction response < 100ms
- Map rendering optimized
- Service worker caching effective

**Acceptance Criteria:**
- [ ] Performance profiling complete
- [ ] Targets met or documented deviations
- [ ] Lighthouse scores > 90

#### FR-012: Documentation
**Priority:** P1 (High)

**Requirements:**
- Component documentation updated
- WIREFRAME_CATALOG.md updated with implementation status
- API integration docs updated
- Onboarding guide updated

**Acceptance Criteria:**
- [ ] All documentation current
- [ ] New team can onboard successfully

---

## 4. Non-Functional Requirements

### NFR-001: Test Coverage
- **Requirement:** >80% code coverage for all new code
- **Verification:** `npm run coverage` or `pytest --cov`

### NFR-002: Type Safety
- **Requirement:** Zero TypeScript errors
- **Verification:** `npx tsc --noEmit`

### NFR-003: Linting
- **Requirement:** Zero linting errors
- **Verification:** `npm run lint` or `ruff check`

### NFR-004: Accessibility
- **Requirement:** WCAG 2.1 AA compliance
- **Verification:** `npm run test:a11y` (jest-axe)

### NFR-005: Browser Support
- **Requirement:** Chrome, Firefox, Safari (latest 2 versions)
- **Requirement:** Mobile Safari (iOS 14+)
- **Verification:** Manual testing

### NFR-006: Performance
- **Requirement:** Initial load < 3s
- **Requirement:** Interaction response < 100ms
- **Verification:** Lighthouse, Chrome DevTools

### NFR-007: Responsive Design
- **Requirement:** Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Verification:** Manual testing, responsive design tools

---

## 5. Technical Constraints

### Frontend Stack
- React 18+
- TypeScript (strict mode)
- Vite
- Tailwind CSS
- MapLibre GL JS
- TanStack Query

### Backend Dependencies
- Route optimization API (WF6)
- Feature flag API (WF10)
- Crew performance API (WF6)
- Offline sync queue API (WF9)

### Forbidden Technologies
- OpenAI, LangChain
- SQLite
- Flask
- `requests` library
- `var` in JavaScript
- Default exports
- `any` type in TypeScript

---

## 6. Data Requirements

### Mock Data
- Use `synthetic_day_in_life.json` for development
- Enhanced data from Synthetic Data Quality track (when available)

### API Contracts
- Coordinate with backend team on API contracts
- Mock APIs initially, integrate when backend ready

---

## 7. Success Criteria

### Phase 4.2 (Core Features)
- [ ] Batch Assignment modal fully functional
- [ ] Offline Mode with service worker and IndexedDB
- [ ] Feature Admin panel with flag management
- [ ] All three features have >80% test coverage
- [ ] All three features accessible (WCAG 2.1 AA)

### Phase 4.3 (Enhancements)
- [ ] All 7 partially-implemented wireframes reach >90% conformance
- [ ] All missing UI components implemented
- [ ] All missing visualizations implemented
- [ ] All action buttons functional
- [ ] >80% test coverage maintained

### Phase 4.4 (Polish)
- [ ] 100% wireframe conformance (visual QA)
- [ ] Zero accessibility violations
- [ ] Performance targets met (<3s initial load, <100ms interactions)
- [ ] Documentation complete
- [ ] Ready for production deployment

---

## 8. Dependencies

### Internal
- **agentic-mode** - Foundation (layout, insights, clustering)
- **synthetic-data-quality** - Enhanced demo data (nice-to-have)

### External
- **Backend APIs:**
  - Route optimization API (WF6)
  - Feature flag API (WF10)
  - Crew performance API (WF6)
  - Offline sync queue API (WF9)

### Coordination
- Backend team for API contracts and timelines
- Design team for wireframe clarifications (if needed)
- QA team for visual QA and accessibility testing

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backend API delays | Medium | High | Mock APIs initially, integrate when ready |
| Service worker complexity | High | Medium | Use Workbox, start early, test frequently |
| Map performance issues | Medium | Medium | Profile early, optimize clustering |
| Timeline compression | Medium | High | Prioritize core features (WF6, WF9, WF10) |
| State management complexity | Medium | Medium | Use React Query, clear boundaries |

---

## 10. References

- [WIREFRAME_CONFORMANCE_AUDIT.md](../../../docs/UI/WIREFRAME_CONFORMANCE_AUDIT.md) - Complete gap analysis
- [AGENTIC_UI_ENGINEERING_GUIDE.md](../../../docs/UI/AGENTIC_UI_ENGINEERING_GUIDE.md) - Onboarding guide
- [IMPLEMENTATION_TICKETS.md](../../../docs/UI/IMPLEMENTATION_TICKETS.md) - 27 ready-to-create tickets
- [WIREFRAME_CATALOG.md](../../../docs/UI/WIREFRAME_CATALOG.md) - All 10 wireframes
- [STRATEGIC_PLAN.md](./STRATEGIC_PLAN.md) - Strategic analysis
- [Phase 4 Track](../agentic-mode/) - Foundation track

---

## 11. Out of Scope

- Backend API implementation (separate track)
- Design changes to wireframes (use approved wireframes as-is)
- New features not in wireframes
- Performance optimizations beyond targets (unless critical)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-20  
**Author:** Strategic Planning (Claude Code)
