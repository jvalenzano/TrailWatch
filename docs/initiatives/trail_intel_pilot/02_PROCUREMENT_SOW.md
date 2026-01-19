# TrailWatch Phase 2: Statement of Work

**Document ID:** TW-2026-SOW-P2  
**Date:** January 19, 2026  
**Client:** United States Forest Service (USFS)  
**Contractor:** Aries Digital  
**Project:** TrailWatch — Agentic Trail Intelligence System, Phase 2 Implementation

---

## 1. Executive Summary

This Statement of Work (SOW) defines the scope, deliverables, timeline, budget, and success criteria for Phase 2 of the TrailWatch agentic trail intelligence system. Phase 2 expands the Phase 1 government-data-only pilot (single region, 5-10 rangers) into a production-scale multi-region system with social media integration (3-5 USFS regions, 50+ daily reports).

**Phase 2 Scope:** 6-week implementation cycle, post-Phase-1 validation gate.

**Phase 2 Budget:** $60,000-$82,000 (fixed-price plus contingency).

**Key Deliverables:**
1. Enhanced multi-agent orchestration (Supervisor + Social Media Research Agent)
2. Confidence scoring algorithm with FedRAMP 20x compliance
3. Ranger verification portal (enhanced UX for social media claims)
4. Multi-region Cloud Run infrastructure (3-5 USFS regions)
5. Security audit and FedRAMP compliance documentation
6. Ranger training materials and soft launch support

**Success Criteria:** All metrics from Section 4 achieved at gate review (Week 8).

---

## 2. Background & Phase 1 Reference

### Phase 1 Pilot (Completed/In-Progress)

Phase 1 established proof-of-concept using government data sources only (NOAA, NPS, USGS APIs). Key achievements:

- ✅ Deployed Claude 3.5 Sonnet + web search via Vertex AI (FedRAMP-authorized)
- ✅ Async research architecture with <5 min latency target
- ✅ Citation-first output with 3-tier confidence scoring (HIGH/MEDIUM/LOW)
- ✅ Mandatory ranger verification gate before trail actions
- ✅ Audit logging for compliance (7-year federal retention)
- ✅ Pilot: 5-10 rangers in single region (Phase 1 pilot region TBD)

**Phase 1 Timeline:** 6-8 weeks (Week 0-8)  
**Phase 1 Budget:** $18,000-$26,000 (completed separate from Phase 2)  
**Phase 1 Gate Criteria:** 70%+ relevance, <5 min latency, <3% error, 15%+ time savings

### Phase 2 Start Condition

Phase 2 procurement and development only proceed **if Phase 1 success metrics are met** (Section 2, Phase 1 Gate Criteria above). This SOW assumes Phase 1 gate has been passed or is near completion.

---

## 3. Scope of Work

### 3.1 In-Scope Deliverables

#### Week 1: Architecture Finalization & Compliance Prep

| Deliverable | Description | Owner | Effort | Success Criteria |
|---|---|---|---|---|
| **Architecture Decision** | Recommend Pattern A (Supervisor + Subagents) vs. Patterns B/C/D; secure USFS approval | Aries Tech Lead | 1-2 days | Decision documented, USFS sign-off |
| **FedRAMP 20x Pre-Assessment** | Brief USFS legal/security on Vertex AI compliance wrapper; identify any additional authorization needed | Aries Security + Legal | 2-3 days | Pre-assessment report, zero new authorization requirements identified |
| **Regional Expansion Plan** | Identify 3-5 USFS regions for Phase 2 rollout; document ranger count, API requirements per region | Aries PM + USFS stakeholder | 1-2 days | Regional plan document, USFS regional manager buy-in |
| **Perplexity Enterprise Negotiation** | Initiate contract discussion for Perplexity Pro for Government (optional Phase 2 integration) | Aries Procurement | 3-5 days | Contract draft or opt-out decision documented |
| **GitHub Setup** | Initialize Phase 2 codebase repository, branch from Phase 1, establish CI/CD pipeline | Aries DevOps | 1 day | Repository live, initial commit, access provisioned |

**Week 1 Effort:** 2-3 engineers (part-time)  
**Week 1 Cost:** $3,000-$5,000

---

#### Week 2: Social Media Integration & API Configuration

| Deliverable | Description | Owner | Effort | Success Criteria |
|---|---|---|---|---|
| **Perplexity Sonar Integration** | Integrate Perplexity API (or fallback to Claude web search via Vertex AI) for social media queries | Engineer A | 2-3 days | API key working, test queries return results, cost tracking verified |
| **Instagram/Facebook/Reddit Search Nodes** | Configure n8n or custom search nodes for public Instagram posts, Facebook hiking groups, Reddit r/hiking | Engineer B | 2-3 days | Each platform searchable via agent query, sample results verified |
| **ToS Risk Documentation** | Prepare legal memo on Instagram/Facebook/Reddit ToS compliance; obtain USFS general counsel approval | Legal Counsel | 2-3 days | Legal memo signed off, explicit ToS risk acceptance from USFS |
| **Audit Trail Logging** | Implement FedRAMP-compliant logging for all social media queries (who searched, when, what, results) | Engineer C | 1-2 days | Firestore logging schema live, sample queries logged and retrievable |
| **Source Credibility Configuration** | Create configurable JSON file defining platform weights (gov=1.0, news=0.7, Instagram=0.3, etc.) | Engineer A | 1 day | Configuration file deployed, weights documented, modifiable by USFS |

**Week 2 Effort:** 3 engineers (full-time)  
**Week 2 Cost:** $8,000-$10,000

---

#### Week 3: Enhanced Trust & Safety Implementation

| Deliverable | Description | Owner | Effort | Success Criteria |
|---|---|---|---|---|
| **Confidence Scoring Algorithm** | Implement multi-source confidence aggregation (source weighting + recency decay + corroboration bonus) | Engineer C | 2-3 days | Algorithm deployed in Firestore Cloud Function, test cases pass, output matches specification |
| **Ranger Verification Portal Enhancements** | Upgrade Phase 1 portal: display per-claim confidence scores, source breakdown, "consult supervisor" workflow | Engineer B | 2-3 days | Portal enhancements live, UX tested with sample rangers, confidence tiers visually distinct |
| **Auto-Escalation Rules** | Implement red flag detection: injury/rescue claims, contradictions with official status, single-source HIGH confidence, extreme language, location ambiguity | Engineer A | 1-2 days | Rules deployed, test cases pass, escalation e-mails working |
| **Hallucination Monitoring Dashboard** | Build Data Studio/Looker dashboard: false positive rate, source accuracy, confidence calibration, weekly trend visualization | Engineer C | 2 days | Dashboard live, metrics auto-updating weekly, accessible to USFS ops team |

**Week 3 Effort:** 2-3 engineers (full-time)  
**Week 3 Cost:** $8,000-$10,000

---

#### Week 4: Multi-Region Architecture & Scaling

| Deliverable | Description | Owner | Effort | Success Criteria |
|---|---|---|---|---|
| **Multi-Region Cloud Run Deployment** | Deploy agent infrastructure to 3-5 additional USFS regions; configure regional load balancing, failover | DevOps Engineer | 2-3 days | All regions live, health checks passing, latency <5 min per region |
| **Cross-Region Firestore Replication** | Set up Firestore replication for audit logs (redundancy, 7-year retention compliance) | DevOps Engineer | 1-2 days | Replication active, test failover successful, audit logs replicated within 5 minutes |
| **Regional Fallback Configuration** | If one region's API fails, auto-route to backup region; document retry logic | Engineer A | 1 day | Failover tested, latency acceptable during backup mode |
| **Load Testing: 50+ Reports/Day** | Execute load test simulating 50+ concurrent reports/day; verify latency SLA <5 min p95 | Engineer C | 1-2 days | Load test report generated, SLA met, infrastructure scaling behavior documented |
| **Monitoring & Alerting Setup** | Configure PagerDuty + Cloud Monitoring; establish on-call rotation for Phase 2 launch | DevOps Engineer | 1 day | PagerDuty integration live, alerts tested, on-call schedule finalized |

**Week 4 Effort:** 2-3 engineers (full-time)  
**Week 4 Cost:** $8,000-$10,000

---

#### Week 5: Ranger Training & UX Polish

| Deliverable | Description | Owner | Effort | Success Criteria |
|---|---|---|---|---|
| **Training Video: Confidence Scores** | 30-min instructional video: how to interpret HIGH/MEDIUM/LOW confidence, when to trust agent output | UX Designer | 1 day | Video produced, published on internal USFS portal, 3+ rangers watch and provide feedback |
| **Escalation Guidelines Document** | 1-page guide with examples: when to consult supervisor, when to investigate further | USFS Stakeholder + Aries PM | 0.5 days | Document approved by USFS district supervisors, distributed to all pilot rangers |
| **Troubleshooting Guide** | Common false positives, sarcasm examples, location ambiguity scenarios, how to report issues | UX Designer | 0.5 days | Guide available in portal, referenced in training video |
| **UX Polish** | Simplify dashboard (remove non-essential fields), dark mode, mobile-responsive design, "Mark Incorrect" feedback button | Engineer B | 1-2 days | UX changes live, tested on Rangers' devices, feedback collected |
| **Soft Launch: 5-10 Rangers, 1 Region** | Deploy Phase 2 system to 5-10 rangers in single region; conduct daily feedback calls during Week 5 | Aries PM + Engineer | Full week | Daily standups completed, 3+ design iterations completed, ranger feedback documented |

**Week 5 Effort:** 1-2 designers + 1-2 engineers (full-time)  
**Week 5 Cost:** $6,000-$8,000

---

#### Week 6: Hardening & Launch

| Deliverable | Description | Owner | Effort | Success Criteria |
|---|---|---|---|---|
| **Third-Party Security Audit** | Engage external security firm for penetration test, code review, FedRAMP compliance verification | External Firm | 2-3 days | Audit report delivered, no critical findings, all medium findings remediated |
| **FedRAMP Compliance Hardening** | Address audit findings, verify encryption at rest/in transit, audit trail completeness | Engineer A | 1-2 days | All audit recommendations implemented, FedRAMP checklist signed off |
| **Incident Response Runbook** | Document procedures for: agent hallucination detected, wrong trail closure, data breach, service outage | Aries PM + Security | 1 day | Runbook approved by USFS ops team, on-call engineer trained |
| **Phase 2 Go/No-Go Gate Review** | Comprehensive review of all success metrics (Section 4); USFS steering committee decision | Aries Lead + USFS Leadership | 1 day | Gate review completed, decision documented, approval signed |
| **Full Regional Rollout** | If gate passes, deploy to all 3-5 planned regions; on-call support begins | DevOps + Aries Team | 1-2 days | All regions live, initial incident response plan active, daily USFS sync begins |
| **Post-Launch Support** | Establish 2-week post-launch SLA: 1-hour response time for critical issues, daily status calls | Aries Lead | Ongoing | Support rotation established, critical issues tracked, daily updates provided |

**Week 6 Effort:** 2-3 engineers (full-time) + external security audit ($5-8K)  
**Week 6 Cost:** $10,000-$12,000 (+ $5-8K audit)

---

### 3.2 Out-of-Scope (Explicitly Excluded)

The following are **NOT** included in Phase 2 SOW:

- ❌ **Phase 1 pilot execution** (assumed complete before Phase 2 start)
- ❌ **AllTrails direct review scraping** (ToS violation risk, legal complexity)
- ❌ **Twitter/X integration** (explicit scraping ban as of Jan 15, 2026)
- ❌ **Multimodal ML** (photo analysis of trail damage via Vertex AI Vision API) — reserved for Phase 3
- ❌ **Advanced analytics** (trend prediction, seasonal hazard forecasting) — Phase 3
- ❌ **Automated trail closures** (all closures require ranger approval; system provides decision support only)
- ❌ **Mobile app development** (Web UI only; mobile access via responsive design)
- ❌ **Data migration from legacy systems** (assumes Phase 1 database clean)
- ❌ **USFS personnel training** (only materials/videos provided; USFS conducts training)
- ❌ **Ongoing 24/7 operational support** (2-week post-launch SLA only; long-term support in Phase 3 or separate contract)

---

## 4. Success Criteria & Acceptance

### Phase 2 Success Metrics (Go/No-Go Gate, Week 8)

All metrics must be achieved **or documented waiver obtained** from USFS steering committee.

| Metric | Target | Measurement Method | Acceptance Criteria |
|--------|--------|-------------------|-------------------|
| **Contextual Relevance** | ≥70% | % of reports with ≥2 relevant sources found | Manual review sample (20% of phase 2 reports) |
| **Latency SLA** | <5 min avg, <8 min p95 | End-to-end research time (report to briefing) | Cloud Logging metrics, no region exceeds SLA |
| **Hallucination Rate** | <5% | False claims per 100 briefings | Weekly ranger manual verification sample |
| **Ranger Time Savings** | ≥25% vs. manual | Time for manual research vs. agent-assisted | Ranger time logs + post-launch surveys |
| **Confidence Calibration Error** | <0.15 | Predicted confidence vs. actual accuracy | Correlation analysis, weekly reporting |
| **FedRAMP Compliance** | 100% | Audit trail completeness, no data loss | Security audit sign-off, USFS verification |
| **Ranger Satisfaction (NPS)** | ≥7/10 | Post-Phase-2 survey (usability, trust, value) | Survey administered Week 7-8 |
| **Zero Critical Incidents** | 0 | Wrong closures, breaches, outages >30 min | Incident log review, post-incident reports |

### Acceptance Sign-Off

Phase 2 is considered **complete and accepted** when:

1. All deliverables from Weeks 1-6 are delivered and documented
2. Go/No-Go gate review confirms metrics above achieved (or waivered)
3. USFS Regional Supervisor signs Phase 2 Completion & Acceptance Form
4. All findings from security audit are remediated or documented risk-accepted

**Expected Sign-Off Date:** Week 8 of Phase 2 (approximately **April 30, 2026**, assuming Phase 1 completes by early April).

---

## 5. Budget & Cost Breakdown

### Phase 2 Fixed-Price Budget: $60,000-$82,000

| Category | Cost (Low) | Cost (High) | Notes |
|----------|-----------|-----------|-------|
| **Engineering Labor (6 weeks, 3 FTE)** | $36,000 | $45,000 | At $80K-$100K/eng/year loaded rates; lead + 2 engineers |
| **API Costs (Claude/Perplexity)** | $3,000 | $6,000 | 50+ reports/day × 6 weeks; assume $0.03-0.10 per report |
| **Infrastructure (Cloud Run, Firestore, Pub/Sub)** | $2,000 | $4,000 | Vertical scaling, multi-region deployment, egress costs |
| **Security Audit (third-party)** | $5,000 | $8,000 | External penetration test + FedRAMP compliance review |
| **Training & UX (designer, eng time)** | $6,000 | $8,000 | Training materials, soft launch support, UX polish |
| **Perplexity Enterprise Negotiation** | $2,000 | $3,000 | Contract legal review, integration testing |
| **Contingency (10% of subtotal)** | $6,000 | $8,000 | Buffer for scope creep, integration issues, unexpected delays |
| **TOTAL** | **$60,000** | **$82,000** | — |

### Cost Allocation by Week

| Week | Phase | Cost Range | Notes |
|------|-------|-----------|-------|
| Week 1 | Architecture + Compliance | $3-5K | Light engineering, mostly planning/legal |
| Week 2 | Integration | $8-10K | Heavy engineering (3 FTE) |
| Week 3 | Trust & Safety | $8-10K | Heavy engineering (2-3 FTE) |
| Week 4 | Scaling | $8-10K | Heavy engineering + infrastructure |
| Week 5 | Training + UX | $6-8K | Designer + engineer |
| Week 6 | Hardening + Launch | $10-12K | Security audit ($5-8K) + final engineering |
| Week 6 (Post-Launch) | Support (2 weeks) | Included in Week 6 | Daily sync, critical bug fixes |
| **TOTAL** | — | **$60-82K** | — |

### Cost Control & Variance Management

- **Budget authority:** USFS Regional Supervisor for expenses >$5K
- **Change request process:** Any scope change increasing cost >10% requires written change order
- **Weekly burn-down tracking:** Aries PM reports actuals vs. budget every Friday
- **Contingency drawdown:** Contingency released only with USFS steering committee approval

---

## 6. Schedule & Timeline

### Phase 2 Timeline: 6 Weeks (Weeks 1-6, Post-Phase-1 Gate)

```
Phase 1 Gate (End of Week 8, Phase 1)
    ↓
[DECISION: Proceed to Phase 2?]
    ↓
Phase 2 Week 1: Architecture + Compliance (Jan 27 - Feb 2)
Phase 2 Week 2: Social Media Integration (Feb 3 - Feb 9)
Phase 2 Week 3: Trust & Safety (Feb 10 - Feb 16)
Phase 2 Week 4: Multi-Region Scaling (Feb 17 - Feb 23)
Phase 2 Week 5: Training + UX Polish (Feb 24 - Mar 2)
Phase 2 Week 6: Hardening + Launch (Mar 3 - Mar 9)
    ↓
Phase 2 Go/No-Go Gate (Week 8 review, Week 9-10 approval/ramp)
    ↓
Phase 2 Complete + Launch (April 1-7, 2026)
```

**Actual dates contingent on Phase 1 gate completion date.**

### Critical Path & Dependencies

**Critical dependency:** Phase 2 start requires Phase 1 success gate approval.

**Week 1 blockers:**
- USFS steering committee approval of Phase 2 budget
- Identification of 3-5 USFS regional coordinators

**Week 2 blockers:**
- USFS legal counsel sign-off on social media ToS risk acceptance
- Perplexity contract negotiation (or explicit opt-out decision)

**Week 4 blockers:**
- Regional infrastructure approval (no additional budget holds)
- PagerDuty/monitoring tool access provisioned

**Week 6 blockers:**
- Security audit completion (must be scheduled by Week 1)
- USFS steering committee availability for Phase 2 gate review

---

## 7. Assumptions & Constraints

### Assumptions

1. **Phase 1 success gate is met** by end of Phase 1 Week 8; Phase 2 starts no later than Phase 1 Week 10.
2. **USFS provides dedicated regional coordinators** (1 per region, 25% time during Phase 2).
3. **USFS steering committee meets weekly** (30 min sync) to unblock decisions.
4. **Rangers available for soft launch Week 5** (5-10 rangers, 1 region).
5. **No major USFS procurement policy changes** during Phase 2 (budget authority stable).
6. **Perplexity Enterprise Pro for Government** available by Week 2; if unavailable, Phase 2 proceeds with Claude via Vertex AI only.
7. **FedRAMP 20x Low authorization remains unchanged** (Vertex AI, GCP services).
8. **Third-party security audit firm availability** scheduled by Week 1.

### Constraints

1. **Budget cap:** $82,000 (hard cap; additional scope requires change order).
2. **Timeline:** 6 weeks fixed; any delay beyond Week 6 may require Phase 2 extension or scope reduction.
3. **Platforms:** Instagram/Facebook/Reddit agent search only; no direct API scraping.
4. **Data:** All data processed via Vertex AI (FedRAMP 20x compliance); no direct third-party AI service calls.
5. **Audit retention:** All queries/decisions logged 7 years minimum (federal records retention law).
6. **Ranger authority:** Rangers retain final decision authority; system provides decision support only.

---

## 8. Roles & Responsibilities

### Aries Digital Team

| Role | Responsibility | Time Commitment |
|------|-----------------|-----------------|
| **Project Lead (PM)** | SOW execution, weekly USFS sync, change management, budget tracking | 100% |
| **Tech Lead** | Architecture decisions, FedRAMP compliance strategy, code review | 80% |
| **Engineer A** | Social media integration, confidence scoring algorithm | 100% |
| **Engineer B** | Ranger portal enhancements, UX, soft launch support | 100% |
| **Engineer C** | Multi-region infrastructure, load testing, monitoring | 100% |
| **DevOps Engineer** | Cloud Run deployment, Firestore replication, failover testing | 80% |
| **Security Lead** | Security audit coordination, FedRAMP hardening | 40% |
| **UX Designer** | Training materials, portal design, soft launch feedback | 60% |

### USFS Team

| Role | Responsibility | Time Commitment |
|------|-----------------|-----------------|
| **Regional Supervisor (Decision Authority)** | Budget approval, go/no-go gate decisions, escalation authority | 20% |
| **GIS/IT Manager (Technical Authority)** | Infrastructure planning, security approval, deployment coordination | 30% |
| **Regional Coordinators (per region)** | Liaison with regional ranger staff, soft launch recruitment, feedback | 25% each |
| **Legal Counsel** | ToS risk acceptance, FedRAMP compliance review, liability assessment | 20% |
| **One Ranger (End-User Rep)** | Soft launch participation, UX feedback, training material input | 100% (Week 5 only) |

---

## 9. Communication & Escalation

### Weekly Status Syncs

**Time:** Every Friday, 2:00 PM PST  
**Duration:** 30 minutes  
**Attendees:**
- Aries Project Lead
- USFS Regional Supervisor (or delegate)
- USFS GIS/IT Manager
- Aries Tech Lead

**Agenda:**
1. Deliverables completed (5 min)
2. Blockers & risks (10 min)
3. Budget/timeline variance (5 min)
4. Decisions needed (10 min)

### Escalation Path

| Issue | Authority | Escalation Time |
|-------|-----------|------------------|
| Technical blockers | USFS GIS/IT Manager → USFS Regional Supervisor | 2 business days |
| Budget variance >10% | USFS Regional Supervisor | 1 business day |
| Timeline slip >1 week | USFS Regional Supervisor → USFS Regional Forester | 1 business day |
| FedRAMP/legal blockers | USFS Legal Counsel → USFS Regional Supervisor | 2 business days |
| Critical incident (wrong closure, data breach) | Aries Lead + USFS IT | 1 hour |

---

## 10. Deliverables & Sign-Off

### Phase 2 Deliverables Checklist

**Week 1 Deliverables:**
- [ ] Architecture recommendation document (Pattern A approved)
- [ ] FedRAMP 20x pre-assessment memo
- [ ] Regional expansion plan (3-5 regions identified)
- [ ] GitHub repository initialized

**Week 2 Deliverables:**
- [ ] Perplexity API integration (working demo)
- [ ] Instagram/Facebook/Reddit search nodes (working)
- [ ] ToS risk acceptance memo (USFS legal signed)
- [ ] Audit trail logging schema (Firestore live)

**Week 3 Deliverables:**
- [ ] Confidence scoring algorithm (deployed, tested)
- [ ] Ranger portal enhancements (live in staging)
- [ ] Auto-escalation rules (working)
- [ ] Hallucination monitoring dashboard (live)

**Week 4 Deliverables:**
- [ ] Multi-region Cloud Run deployment (all regions live)
- [ ] Firestore replication (cross-region active)
- [ ] Load test report (50+ reports/day, SLA met)
- [ ] Monitoring + PagerDuty integration (live)

**Week 5 Deliverables:**
- [ ] Training video (published)
- [ ] Escalation guidelines (approved by supervisors)
- [ ] Troubleshooting guide (published)
- [ ] UX polish (dark mode, mobile responsive, "Mark Incorrect" button)
- [ ] Soft launch completed (5-10 rangers, 1 week feedback)

**Week 6 Deliverables:**
- [ ] Security audit report (completed, findings remediated)
- [ ] FedRAMP compliance hardening (completed)
- [ ] Incident response runbook (approved by ops team)
- [ ] Phase 2 go/no-go gate review document
- [ ] Full regional rollout (if gate passes)
- [ ] 2-week post-launch support begins

### Sign-Off Authority

**Deliverable acceptance:**
- **Technical deliverables:** USFS GIS/IT Manager + Aries Tech Lead sign off
- **Compliance deliverables:** USFS Legal Counsel sign off
- **UX/training deliverables:** USFS Regional Supervisor (on behalf of ranger staff) sign off
- **Phase 2 completion:** USFS Regional Supervisor signature required

**Sign-Off Form:** "TrailWatch Phase 2 Completion & Acceptance" (template provided separately)

---

## 11. Terms & Conditions

### Payment Terms

- **Invoicing:** Weekly progress invoicing (based on deliverables completed)
- **Payment due:** Net 30 days from invoice
- **Holdback:** 10% contingency ($6-8K) held until final Phase 2 gate approval

### Change Management

Any change to scope, budget, or timeline requires:
1. Written change request from USFS or Aries
2. Impact assessment (cost + schedule impact)
3. Steering committee approval (if cost >$5K or timeline impact >3 days)
4. Signed change order amendment to SOW

### Liability & Insurance

- **Aries Digital carries** professional liability insurance ($2M minimum)
- **Liability cap:** Limited to total Phase 2 contract value ($82K max)
- **Indemnification:** Aries indemnifies USFS for third-party IP claims (Perplexity API usage, etc.)

### Intellectual Property

- **USFS ownership:** All work product (code, documentation, training materials) is owned by USFS upon completion
- **Aries retains:** Right to use architectural patterns/frameworks for internal process improvement (non-USFS-specific)

### Confidentiality

- All Phase 2 work is subject to USFS confidentiality requirements
- Security audit findings are confidential between Aries and USFS only

---

## 12. Attachments

The following attachments are incorporated by reference:

- **Attachment A:** Phase 2 Implementation Roadmap (detailed 6-week schedule)
- **Attachment B:** Architecture Decision Matrix (Pattern A/B/C/D comparison)
- **Attachment C:** FedRAMP 20x Compliance Pathway (Vertex AI strategy)
- **Attachment D:** Confidence Scoring Algorithm (specification)
- **Attachment E:** Regional Rollout Plan (3-5 USFS regions identified)
- **Attachment F:** Risk Register (Phase 2 risks + mitigation strategies)

---

## 13. Approval & Signature

**This SOW is approved and agreed upon by:**

| Party | Representative | Title | Date | Signature |
|-------|-----------------|-------|------|-----------|
| **USFS** | [Name] | Regional Supervisor | _______ | ______________ |
| **Aries Digital** | [Name] | Vice President, Delivery | _______ | ______________ |

**Effective Date:** [Date of final signature]

**Phase 2 Start Date:** [Week 1 start, conditional on Phase 1 gate approval]

---

## 14. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 19, 2026 | Aries AI Architect | Initial draft |
| 1.1 | [Date] | [Author] | [Changes from review] |

**Next Review Date:** [Date before Phase 2 start]
