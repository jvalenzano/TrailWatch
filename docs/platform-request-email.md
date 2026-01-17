# Platform Team: TrailWatch Project Setup Request

---

**To:** Awaes Quadry (awaes.quadry@techtrend.us)  
**From:** Jason Valenzano (jvalenzano@techtrend.us)  
**Subject:** New GCP Project Request: TrailWatch Development Environment  
**Priority:** Normal

---

## Request Summary

**Project Type:** Development Environment  
**Engagement:** USFS Trail Management  
**Requestor:** Jason Valenzano  
**Expected Start Date:** ASAP

---

## Project Details

### Project Configuration

```yaml
Project ID: tt-dev-trailwatch
Project Name: TrailWatch Development
Organization: techtrend.us
```

### Required Labels

```yaml
environment: dev
engagement: usfs-2026
owner: jvalenzano
cost-center: rd
status: active
```

### Billing

- **Billing Account:** TechTrend standard billing account
- **Expected Monthly Cost:** < $100 (development phase)
- **Budget Alert:** Set at $150/month

---

## Required Services

### Core Services (Required)
- `run.googleapis.com` - Cloud Run (API backend)
- `storage.googleapis.com` - Cloud Storage (photos, exports)
- `logging.googleapis.com` - Cloud Logging

### AI/ML Stack (Required)
- `bigquery.googleapis.com` - BigQuery (analytics, trail data)
- `bigquerystorage.googleapis.com` - BigQuery Storage API
- `aiplatform.googleapis.com` - Vertex AI (Gemini for triage)

### Additional Services (Required)
- `sqladmin.googleapis.com` - Cloud SQL PostgreSQL + PostGIS
- `compute.googleapis.com` - Compute Engine (if needed for PostGIS)

---

## Team Access

### Tech Lead - Jason Valenzano (jvalenzano@techtrend.us)
**Roles:**
- `roles/editor`
- `roles/run.admin`
- `roles/resourcemanager.projectIamAdmin`
- `roles/bigquery.admin`
- `roles/storage.admin`
- `roles/aiplatform.admin`

### Senior Developer - Dennis Bolanos (dbolanos@techtrend.us)
**Roles:**
- `roles/editor`
- `roles/run.admin`
- `roles/bigquery.admin`
- `roles/storage.admin`
- `roles/aiplatform.admin`

---

## BigQuery Setup

```yaml
Dataset ID: trailwatch_dataset
Location: US
Description: Main dataset for TrailWatch development
Labels:
  environment: dev
  application: trailwatch
```

---

## Post-Setup Requirements

After project creation, please:
- [ ] Confirm billing is linked
- [ ] Verify all services are enabled
- [ ] Confirm team member access
- [ ] Provide project number for documentation

---

## Project Background

**TrailWatch** is a citizen crowdsourcing platform for US Forest Service trail condition reporting with AI-powered triage. This development project will build:

1. **Intake Agent** - Process citizen reports, map to USFS TRACS categories
2. **Hazard Classifier** - AI photo analysis for hazard validation
3. **Dashboard** - Map visualization for rangers and coordinators
4. **Triage Engine** - Priority ranking and automated routing

**Tech Stack:** FastAPI, React, Google ADK (Gemini agents), PostGIS

---

## Timeline

**Requested Setup Date:** Within 24-48 hours  
**Development Start:** Immediately after setup  
**First Demo:** February 2026

---

## Questions?

Please reach out if you need any additional information or clarification on this request.

**Contact:**  
Jason Valenzano  
jvalenzano@techtrend.us

---

**Reference Documents:**
- Project Charter: `/Documents/10-TrailWatch/Project-Charter.md`
- Tech Spec: `/Documents/10-TrailWatch/GEMINI.md`
- Naming Conventions: `/Documents/10-TrailWatch/docs/NAMING_CONVENTIONS.md`
