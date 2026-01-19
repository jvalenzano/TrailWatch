# RISK ACCEPTANCE FORM: Social Media Terms of Service Compliance

**Document ID:** TW-2026-RAF-SOCIAL-MEDIA  
**Date:** January 19, 2026  
**Project:** TrailWatch — Agentic Trail Intelligence System, Phase 2  
**Form Version:** 1.0 (Phase 2 Social Media Integration)

---

## SECTION 1: EXECUTIVE SUMMARY

This Risk Acceptance Form (RAF) documents USFS's **explicit acceptance of risks** associated with integrating public social media data sources (Instagram, Facebook, Reddit) into the TrailWatch Phase 2 system.

**Key Points:**
- Social media integration improves trail hazard intelligence (faster identification, citizen crowdsourcing)
- Social media sources carry legal/compliance risks (Terms of Service violations, hallucination, misinformation)
- Risks are **manageable** with proper verification gates and audit logging
- TrailWatch mitigates risks through: confidence scoring, ranger verification, audit trails, incident response

**Risk Decision:** ✅ **ACCEPT** social media integration in Phase 2, contingent on mitigation controls below.

---

## SECTION 2: RISK IDENTIFICATION

### Risk 2.1: Instagram/Facebook Terms of Service Violation

**Description:**
Instagram and Facebook Terms of Service prohibit automated collection of data. TrailWatch uses **agent web search** (not direct API scraping), which searches public Instagram/Facebook posts without native API access. However, any automated data collection technically violates ToS, regardless of method.

**Legal Precedent:**
- **hiQ v. LinkedIn (2022, 9th Circuit):** Scraping publicly available data is legal under US law; ToS violations are civil (account suspension), not criminal
- **Implication:** USFS faces account risk, not legal prosecution; public web search reduces technical ToS violation risk

**Specific Risks:**
1. **Instagram account suspension:** If TrailWatch agent conducts too many queries from single IP/account, Instagram may ban account
2. **Facebook account suspension:** Similar risk if TrailWatch queries Facebook public hiking groups too frequently
3. **Reputational risk:** Public disclosure that USFS uses social media data could trigger platform response or media scrutiny

**Probability:** Low (15-20% risk of account suspension in Phase 2 if 50+ reports/day include social search)  
**Impact:** Medium (loss of social media source, not critical since government data is primary source)

---

### Risk 2.2: Reddit API Restrictions

**Description:**
Reddit eliminated self-service API access in November 2025. New API token requests require manual Reddit approval, which can take weeks. TrailWatch can still search Reddit via agent web search (public posts are scrapable), but direct API access (faster, more reliable) is restricted.

**Specific Risks:**
1. **Slower Reddit research:** Agent web search slower than direct Reddit API (5-10 min vs. 2-3 min latency)
2. **Rate limits:** Reddit actively discourages scraping via HTML parsing; may block high-volume requests
3. **Approval delays:** If Reddit approval becomes mandatory, 4-6 week delays possible

**Probability:** Medium (30-40% if Reddit enforcement tightens during Phase 2)  
**Impact:** Low (Reddit data non-critical; fallback is NPS/news/Instagram sources)

---

### Risk 2.3: AllTrails Review Scraping (Out of Scope, but Documented)

**Description:**
AllTrails user reviews contain valuable real-time trail condition data. However, AllTrails explicitly prohibits automated review scraping (no public API available). Direct scraping would constitute clear ToS violation.

**USFS Decision:** **EXPLICITLY NOT PURSUING AllTrails scraping in Phase 2.** Risks too high (no legal precedent protection, clear ToS violation, potential litigation). Instead, TrailWatch searches public AllTrails data indirectly via Google News/blog indexing.

**Probability:** Not applicable (AllTrails scraping explicitly out of scope)  
**Impact:** Not applicable

---

### Risk 2.4: Hallucination from Social Media Sources (Not ToS, but Trust/Safety)

**Description:**
Agent research on social media introduces hallucination risk (8-12% baseline for unverified user posts). Example false claims:

- Instagram hiker posts "Eagle Creek Trail is completely closed" (sarcasm, not literal)
- Reddit user reports "bridge washed out" (actually referring to different trail)
- Facebook group member describes "deadly rockslide" (exaggerated danger, trail actually passable)

**Specific Risks:**
1. **Wrong trail closure:** Agent misinterprets social media claim → ranger closes wrong trail
2. **Unnecessary closure:** Unverified social media report causes ranger to close trail → economic impact to tourism/recreation
3. **Liability:** USFS faces lawsuit if wrong closure causes injury or financial loss

**Probability:** Medium (40% risk that 2-5% of Phase 2 reports contain misinterpreted social media claims)  
**Impact:** High (legal liability, operational impact, ranger decision authority at risk)

**Mitigation:** Confidence scoring, mandatory ranger verification gate, audit logging, incident response runbook

---

### Risk 2.5: False Positives & Misinformation Amplification

**Description:**
Social media contains deliberate misinformation (false claims to drive traffic, hoaxes, vandalism reports). Agent may amplify misinformation if not carefully filtered.

**Example Scenarios:**
- TikTok user falsely claims "Eagle Creek Trail bridge destroyed" (actually undamaged) → viral post
- Bad-faith actor posts fake trail closure to discourage competitors' hiking guides
- Satirical Instagram post interpreted literally by agent → false closure recommendation

**Probability:** Low (10-15% if 50+ daily reports, 1-2 false misinformation cases expected per month)  
**Impact:** Medium (wrong closure, reputational harm, rangers lose trust in system)

**Mitigation:** Multi-source requirement (don't act on single unverified post), confidence scoring (HIGH tier requires 8+ sources), ranger verification gate (final decision authority)

---

### Risk 2.6: Data Privacy & FERPA Concerns

**Description:**
Some trail reports may inadvertently include personally identifiable information (PII) — hiker names, locations, photos with faces. Collecting and logging this data in Firestore may create privacy compliance issues.

**Specific Risks:**
1. **PII Exposure:** Audit logs contain unredacted Instagram posts with hiker names/photos
2. **FERPA Violation:** If students/minors post photos, government collection may violate FERPA
3. **GDPR Exposure:** If non-US citizens' photos appear, GDPR compliance issues

**Probability:** Low (15% — most posts don't contain PII)  
**Impact:** Medium (FERPA fines $1K-$10K, privacy complaints, reputational harm)

**Mitigation:** Redact PII from audit logs, filter out photos with faces (Phase 3 multimodal analysis optional), implement data minimization policy

---

## SECTION 3: MITIGATION STRATEGY

### Mitigation 3.1: Confidence Scoring Algorithm (Primary Risk Reduction)

**Mechanism:**
Assign confidence score (0-1.0) to each claim based on:
- Source credibility (gov=1.0, Instagram=0.3, Reddit=0.4)
- Recency decay (last 6 hours=1.0x, 7+ days=0.3x)
- Corroboration bonus (8+ sources=1.3x, 1 source=1.0x)

**Formula:**
```
ConfidenceScore = Σ(source_weight × recency_decay × corroboration_bonus)

HIGH Tier (>0.85): ≥8 sources, recent, mixed credibility
MEDIUM Tier (0.5-0.85): 3-7 sources, mixed recency
LOW Tier (<0.5): 1-2 sources, old, unverified
```

**Ranger Workflow:**
- HIGH confidence claims → ranger can approve closure directly
- MEDIUM confidence claims → ranger consults supervisor
- LOW confidence claims → ranger investigates further (manual research)

**Risk Reduction:** Reduces hallucination impact by requiring multi-source corroboration. Single unverified social media post cannot trigger trail closure.

---

### Mitigation 3.2: Mandatory Ranger Verification Gate

**Mechanism:**
All agent research outputs require ranger approval before trail action. Agent briefing labeled "DRAFT - REQUIRES VERIFICATION" until ranger sign-off.

**Ranger Authority:**
- Rangers retain 100% decision authority
- Agent is decision support tool only, not decision-maker
- Ranger can override agent recommendation for any reason
- Ranger approves or rejects proposed trail closure

**Verification Portal:**
- Display per-claim confidence scores with source citations
- Show all sources (Instagram URL, Reddit thread link, news article, official NPS statement)
- Ranger can click through to verify sources independently
- Ranger notes (optional) logged in audit trail

**Risk Reduction:** Final human verification removes hallucination from decision chain. Even if agent misinterprets social media, ranger catches error before trail closure.

---

### Mitigation 3.3: Audit Trail Logging (FedRAMP + Accountability)

**Mechanism:**
All agent queries, sources retrieved, decisions made logged immutably in Firestore:

```json
{
  "reportId": "report_xyz",
  "timestamp": "2026-02-15T10:30:00Z",
  "agentAction": "research_initiated",
  "socialMediaQueries": [
    {
      "platform": "Instagram",
      "query": "Eagle Creek Trail flooding",
      "resultsCount": 12,
      "postsRetrieved": [
        {
          "url": "instagram.com/p/abc123",
          "account": "hiker_jane_doe",
          "verificationStatus": "unverified_account",
          "timestamp": "2026-02-14T18:45:00Z"
        }
      ]
    }
  ],
  "confidenceScore": 0.72,
  "rangerDecision": "approved",
  "rangerUserId": "ranger_john_smith",
  "trailAction": "temporary_closure_4_hours",
  "retentionYears": 7
}
```

**Risk Reduction:** Complete audit trail enables post-incident forensics. If wrong closure occurs, USFS can identify exactly which social media posts triggered decision, whether they were credible, whether ranger verified correctly. Defensible liability position.

---

### Mitigation 3.4: Red Flag Escalation (High-Risk Claims)

**Mechanism:**
Certain claim types auto-escalate to district supervisor, bypassing ranger-level approval:

**Red Flag Triggers:**
1. **Injury/Rescue Claims:** Any mention of rescue, evacuation, injury → automatic legal review
2. **Contradictions with Official Status:** Briefing contradicts NPS official statement + HIGH confidence → manager investigation
3. **Single-Source HIGH Confidence:** Only 1 social media source but algorithm tagged HIGH → potential hallucination flag
4. **Extreme Language:** Keywords like "death," "fatal," "dangerous" (sarcasm detection risk)
5. **Location Ambiguity:** Multiple trail name variations mentioned (GPS drift risk)

**Escalation Path:**
```
Agent Briefing
    ↓
Ranger Verification Portal
    ↓
[Red Flag Trigger Detected]
    ↓
Auto-Escalate to District Supervisor
    ↓
Supervisor Manual Review + Legal Consultation
    ↓
Decision (approve closure, reject, investigate further)
```

**Risk Reduction:** High-liability claims (injury, death) never auto-close based on social media alone. Ensures legal review before risky decisions.

---

### Mitigation 3.5: Hallucination Monitoring Dashboard

**Mechanism:**
Weekly automated monitoring dashboard tracks:
- False positive rate (% of reports where agent found sources but ranger later determined accuracy <50%)
- Source hallucination rate (agent misrepresented what source said)
- Confidence calibration error (predicted confidence ≠ actual accuracy)
- Wrongly closed trails (post-incident validation: was closure justified?)

**Metrics:**
```
Target: <5% combined error rate with mitigation controls
Alarm threshold: 7% error (triggers investigation, possible scaling back)
Critical threshold: 10% error (auto-revert to gov-sources-only until fixed)
```

**Weekly Review:**
- Aries + USFS analyze monitoring dashboard Friday morning
- If error rate rising, discuss mitigation adjustments
- If error rate >10%, escalate to steering committee for Phase 2 decision

**Risk Reduction:** Real-time detection enables rapid response if hallucination problems emerge. Provides evidence for course correction before widespread impact.

---

### Mitigation 3.6: Incident Response Runbook

**Mechanism:**
Documented procedures for when agent causes wrong trail closure or misinformation is amplified:

**Scenarios Covered:**
1. **Wrong Trail Closure:** Agent briefing led to closure of Trail A when hazard actually on Trail B
2. **Unnecessary Closure:** Social media false alarm triggered closure; trail is actually safe
3. **Delayed Discovery:** Agent missed critical hazard on social media; hikers were injured
4. **Data Breach:** Audit logs exposed on internet; hiker PII compromised

**Response Steps (Example: Wrong Trail Closure):**
```
1. Ranger discovers closure was incorrect
2. Ranger marks briefing as "ERROR" in portal
3. System auto-alerts Aries PM + USFS regional supervisor
4. Within 1 hour: re-open trail, notify public
5. Within 24 hours: root cause analysis (which social posts caused error?)
6. Within 1 week: implement control (e.g., require 3x more sources for that trail)
7. Incident logged for 7-year audit trail + legal hold
```

**Risk Reduction:** Rapid response minimizes impact of errors. Legal documentation supports "good faith effort" defense if lawsuit occurs.

---

## SECTION 4: RESIDUAL RISK ACCEPTANCE

After implementing mitigations above, the following **residual risks remain acceptable** to USFS:

| Risk | Residual Probability | Residual Impact | Acceptance Rationale |
|------|---------------------|-----------------|----------------------|
| **Instagram/Facebook account suspension** | Low (10-15%) | Medium | Agent web search reduces ToS violation severity; fallback sources available |
| **Reddit access restrictions** | Medium (25%) | Low | Reddit non-critical; NPS/news/Instagram sufficient |
| **Hallucination causes unnecessary closure** | Low (2-3%) | Medium | Ranger verification gate catches errors; audit trail defensible |
| **Misinformation viral post amplifies impact** | Low (5%) | Medium | Confidence scoring requires 8+ sources; single post cannot trigger closure |
| **PII exposure in audit logs** | Low (5%) | Medium | Redaction policy + data minimization reduces exposure; FERPA compliance plan documented |
| **Legal liability (wrong closure causes injury)** | Very Low (1%) | Critical | Audit trail + ranger verification gate + incident response defensible in court |

**Overall Phase 2 Risk Profile:** LOW-MEDIUM (manageable with proper controls, acceptable for government operation)

---

## SECTION 5: TERMS & CONDITIONS

### 5.1 Approval Scope

By signing this RAF, USFS **explicitly accepts:**

✅ Integration of Instagram, Facebook, Reddit public posts into Phase 2 research agent  
✅ Agent web search (not direct API scraping) for social media sources  
✅ Confidence scoring algorithm with source weighting  
✅ Ranger verification gate as final decision authority  
✅ Audit logging of all queries/decisions (7-year retention)  
✅ Hallucination monitoring + incident response procedures  

USFS does **NOT** accept:
❌ AllTrails review scraping (explicitly excluded)  
❌ Twitter/X data (banned platform, skip entirely)  
❌ Automated trail closures without ranger approval  
❌ PII collection without redaction policy  

---

### 5.2 Conditions for Continued Authorization

Phase 2 social media integration is **authorized contingent on:**

1. ✅ Confidence scoring algorithm deployed and operational (Week 3)
2. ✅ Ranger verification portal live with confidence score display (Week 3)
3. ✅ Red flag escalation rules active (Week 3)
4. ✅ Hallucination monitoring dashboard live and reporting weekly (Week 3)
5. ✅ Security audit completed with no critical findings (Week 6)
6. ✅ Hallucination rate <5% maintained (ongoing, Week 6+ monitoring)

**If any condition breached:** USFS can pause social media integration and revert to government-data-only Phase 1 SOP until issue resolved.

---

### 5.3 Change Management

Any change to social media data sources (e.g., "add TikTok in Phase 2b") requires:
1. New risk assessment
2. Updated RAF
3. USFS legal + regional supervisor re-approval

---

## SECTION 6: LEGAL & LIABILITY

### 6.1 Indemnification

Aries Digital indemnifies USFS for:
- Third-party IP claims related to Perplexity API usage
- Data breach caused by Aries infrastructure failure
- Unauthorized access to audit logs due to Aries security misconfiguration

Aries Digital does **NOT** indemnify USFS for:
- Legal liability from wrong trail closures (ranger decision authority retained by USFS)
- Operational impact from social media ToS violations (USFS accepted this risk in this RAF)
- Ranger misinterpretation of agent briefing (ranger judgment retained by USFS)

---

### 6.2 Insurance

Aries Digital maintains:
- Professional liability insurance: $2M minimum
- Cyber liability insurance: $1M minimum
- These policies cover TrailWatch Phase 2 services

---

### 6.3 Liability Cap

Aries liability limited to Phase 2 contract value ($82K maximum). USFS liability for ranger decisions remains with USFS (non-delegable federal authority).

---

## SECTION 7: USFS ACCEPTANCE & SIGN-OFF

**By signing below, USFS explicitly accepts the risks documented in this RAF and authorizes Phase 2 social media integration contingent on mitigation controls.**

### Required Signatories

| Title | Name | Date | Signature |
|-------|------|------|-----------|
| **Regional Supervisor** | _________________ | _______ | _________________ |
| **GIS/IT Manager** | _________________ | _______ | _________________ |
| **Legal Counsel** | _________________ | _______ | _________________ |

---

## SECTION 8: REVIEW & UPDATE SCHEDULE

This RAF is effective for **Phase 2 duration (6 weeks)**. 

**Post-Phase-2 Update Required If:**
- Hallucination rate exceeds 5% for 2+ consecutive weeks
- Social media platform API/ToS changes significantly
- New data sources added (e.g., TikTok, Nextdoor)
- Legal precedent changes (e.g., new court ruling on web scraping)

**Next Scheduled Review:** End of Phase 2 (Week 8, April 2026)

---

## SECTION 9: APPENDICES

**Appendix A:** Confidence Scoring Algorithm (detailed specification)  
**Appendix B:** Red Flag Detection Rules (full list of triggers)  
**Appendix C:** Incident Response Runbook (procedures for each scenario)  
**Appendix D:** Hallucination Monitoring Dashboard (metrics + thresholds)  

---

## DOCUMENT CONTROL

| Version | Date | Author | Approvals | Notes |
|---------|------|--------|-----------|-------|
| 1.0 | Jan 19, 2026 | Aries AI Architect | Pending | Initial draft for Phase 2 |
| 1.1 | [Date] | [Author] | [Pending] | USFS legal review edits |

---

**Document ID:** TW-2026-RAF-SOCIAL-MEDIA  
**Classification:** For Official Use Only (FOUO)  
**Retention:** 7 years (federal records)  
**Next Review Date:** April 2026 (post-Phase-2)
