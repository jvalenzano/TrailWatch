# TechTrend GCP Naming Conventions
## Standardized Resource Naming Schema

**Version:** 1.0  
**Source:** ARB Presentation (January 12, 2026)  
**Status:** Active Standard

---

## 🎯 Purpose

Consistent naming conventions enable:
- Easy resource identification
- Cost tracking and attribution
- Automated tooling and scripts
- Clear ownership and responsibility
- Compliance and audit trails

---

## 📋 Project Naming Pattern

### Format
```
{org}-{env}-{workload}-{qualifier}
```

### Components

| Component | Description | Examples |
|-----------|-------------|----------|
| **org** | Organization identifier | `tt` (TechTrend), `fg` (FedGovAI) |
| **env** | Environment type | `dev`, `demo`, `prototype`, `sandbox`, `ref` |
| **workload** | Application/project name | `skyguard`, `nexus`, `chatbot` |
| **qualifier** | Optional differentiator | `v2`, `east`, `backup` |

### Examples

```
tt-demo-skyguard          # TechTrend demo for SkyGuard
tt-dev-nexus              # TechTrend development for NEXUS
tt-prototype-chatbot      # TechTrend prototype chatbot
tt-rd-vector-search       # TechTrend R&D vector search experiment
fg-ref-nexus              # FedGovAI reference implementation of NEXUS
```

### Project ID Constraints
- Must be globally unique across all of GCP
- 6-30 characters
- Lowercase letters, numbers, hyphens only
- Must start with a letter
- Cannot end with a hyphen

---

## 🏷️ Required Labels

All projects MUST have these labels:

| Label Key | Purpose | Valid Values |
|-----------|---------|--------------|
| `environment` | Deployment environment | `dev`, `demo`, `prototype`, `sandbox`, `reference`, `prod` |
| `engagement` | Client/project name | `uafa-2025`, `usfs-2024`, `internal`, `rd` |
| `owner` | Primary contact | `jvalenzano`, `dbolanos`, `aquadry` |
| `cost-center` | Billing attribution | `sales`, `delivery`, `rd`, `internal` |
| `status` | Project lifecycle | `active`, `deprecated`, `archive`, `temporary` |

### Example Label Set
```yaml
environment: demo
engagement: uafa-2025
owner: jvalenzano
cost-center: sales
status: active
```

### Setting Labels
```bash
# At project creation
gcloud projects create tt-demo-skyguard \
  --labels=environment=demo,engagement=uafa-2025,owner=jvalenzano,cost-center=sales,status=active

# Update existing project
gcloud projects update tt-demo-skyguard \
  --update-labels=status=deprecated
```

---

## 📁 Folder Naming Pattern (Phase 1)

### Format
```
fldr-{purpose}-{qualifier}
```

### Examples
```
fldr-engagements          # Top-level engagements folder
fldr-uafa                 # UAFA engagement folder
fldr-internal             # Internal projects folder
fldr-rd                   # R&D projects folder
fldr-demos                # Demo projects folder
```

---

## 🏷️ Resource-Level Labels (All Services)

All GCP resources (Cloud Run, BigQuery, Cloud Storage, etc.) MUST have these labels for cost tracking and management:

| Label Key | Purpose | Valid Values |
|-----------|---------|--------------|
| `application` | Application name | `trailwatch`, `skyguard`, `nexus`, etc. |
| `component` | Application component | `intake-agent`, `dashboard`, `api`, `hazard-classifier`, `triage-engine` |
| `environment` | Deployment environment | `dev`, `staging`, `prod` |
| `data-classification` | Data sensitivity | `public`, `internal`, `confidential` |
| `managed-by` | Management method | `terraform`, `manual`, `conductor` |

### Example Resource Labels

```yaml
# Cloud Run service
application: trailwatch
component: intake-agent
environment: dev
data-classification: internal
managed-by: conductor

# BigQuery dataset
application: trailwatch
component: analytics
environment: prod
data-classification: internal
managed-by: terraform

# Cloud Storage bucket
application: trailwatch
component: photo-storage
environment: prod
data-classification: public
managed-by: terraform
```

### Setting Resource Labels

**Cloud Run:**
```bash
gcloud run deploy trailwatch-intake-agent \
  --labels=application=trailwatch,component=intake-agent,environment=dev,managed-by=conductor
```

**BigQuery Dataset:**
```bash
bq update --set_label application:trailwatch \
  --set_label component:analytics \
  --set_label environment:dev \
  trailwatch_dataset
```

**Cloud Storage Bucket:**
```bash
gsutil label set labels.json gs://trailwatch-photos-us
# Where labels.json contains:
# {"application": "trailwatch", "component": "photo-storage", "environment": "prod"}
```

### Cost Tracking with Resource Labels

**Query costs by application:**
```sql
-- In BigQuery billing export
SELECT 
  SUM(cost) as total_cost,
  labels.value AS application
FROM `billing_export.gcp_billing_export_v1_XXXXXX`
WHERE labels.key = 'application'
  AND labels.value = 'trailwatch'
GROUP BY application
```

**Budget alert filter:**
```
labels.application:"trailwatch" AND labels.environment:"prod"
```

### Label Enforcement

- All resources created after January 20, 2026 MUST have required labels
- Unlabeled resources will be flagged in monthly audits
- Use Terraform/IaC to ensure consistent labeling
- Conductor extension will auto-apply labels when configured

---

## 🔧 Service Account Naming

### Format
```
{project}-{purpose}-sa
```

### Examples
```
skyguard-analytics-sa     # SkyGuard analytics service account
skyguard-cicd-sa          # SkyGuard CI/CD service account
nexus-router-sa           # NEXUS router service account
chatbot-api-sa            # Chatbot API service account
```

### Constraints
- Must be unique within project
- 6-30 characters
- Lowercase letters, numbers, hyphens only
- Must end with `-sa` for easy identification

---

## 🗄️ BigQuery Naming

### Dataset Format
```
{project}_dataset
{project}_{purpose}_dataset
```

### Examples
```
skyguard_dataset          # Main SkyGuard dataset
skyguard_analytics_dataset # Analytics dataset
nexus_comments_dataset    # NEXUS comments dataset
```

### Table Format
```
{entity}_{type}
```

### Examples
```
bases                     # Aerial bases table
fires_2024                # 2024 fires table
user_sessions             # User sessions table
ml_predictions            # ML predictions table
```

---

## 🪣 Cloud Storage Bucket Naming

### Format
```
{project}-{purpose}-{region}
```

### Examples
```
skyguard-models-us        # ML models bucket (US region)
skyguard-data-us-central1 # Data bucket (specific region)
nexus-uploads-us          # Upload bucket
chatbot-assets-global     # Global assets bucket
```

### Constraints
- Must be globally unique
- 3-63 characters
- Lowercase letters, numbers, hyphens, underscores
- No dots in name (for SSL compatibility)
- Cannot start with "goog" or contain "google"

---

## ☁️ Cloud Run Service Naming

### Format
```
{project}-{component}
```

### Examples
```
skyguard-api              # SkyGuard API service
skyguard-frontend         # SkyGuard frontend service
nexus-router              # NEXUS router service
chatbot-backend           # Chatbot backend service
```

---

## 🤖 Vertex AI Resource Naming

### Model Format
```
{project}_{model_type}_{version}
```

### Examples
```
skyguard_fire_risk_v1     # Fire risk model v1
nexus_classifier_v2       # Comment classifier v2
chatbot_embeddings_v1     # Embeddings model v1
```

### Endpoint Format
```
{project}-{model}-endpoint
```

### Examples
```
skyguard-fire-risk-endpoint
nexus-classifier-endpoint
```

---

## 🔑 Secret Manager Naming

### Format
```
{project}-{purpose}-{env}
```

### Examples
```
skyguard-api-key-demo     # API key for demo environment
skyguard-db-password-prod # Database password for production
nexus-gemini-key-dev      # Gemini API key for development
```

---

## 🌐 Cloud Run Domain Mapping

### Format
```
{env}.{project}.{domain}
```

### Examples
```
demo.skyguard.techtrend.us
dev.nexus.techtrend.us
api.chatbot.techtrend.us
```

---

## 📊 Environment Definitions

| Environment | Purpose | Typical Use | Lifecycle |
|-------------|---------|-------------|-----------|
| **dev** | Active development | Daily development work | Long-lived |
| **demo** | Client demonstrations | Sales demos, presentations | Medium-lived |
| **prototype** | Quick prototypes | POCs, experiments | Short-lived |
| **sandbox** | Experimentation | R&D, testing new services | Variable |
| **reference** | Reference implementations | Best practices, templates | Long-lived |
| **prod** | Production | Live customer deployments | Long-lived |

---

## 🏢 Organization Structure

### Two-Org Topology

**techtrend.us (BUILD)**
- Purpose: Client work, prototypes, demos
- Projects: `tt-*`
- Billing: TechTrend billing account
- Access: TechTrend team members

**fedgovai.com (REFERENCE)**
- Purpose: Reference implementations, best practices
- Projects: `fg-*`
- Billing: Separate billing account
- Access: Limited to reference architecture team

---

## 📝 Naming Convention Quick Reference

```bash
# Project
tt-demo-skyguard

# Service Account
skyguard-analytics-sa@tt-demo-skyguard.iam.gserviceaccount.com

# BigQuery Dataset
skyguard_dataset

# BigQuery Table
bases, fires_2024, user_sessions

# Cloud Storage Bucket
tt-demo-skyguard-models-us

# Cloud Run Service
skyguard-api

# Vertex AI Model
skyguard_fire_risk_v1

# Secret
skyguard-api-key-demo

# Domain
demo.skyguard.techtrend.us
```

---

## ✅ Validation Checklist

Before creating resources, verify:

- [ ] Name follows format pattern
- [ ] All required labels are set
- [ ] Name is unique (for globally unique resources)
- [ ] Name meets length constraints
- [ ] Name uses only allowed characters
- [ ] Environment is clearly identified
- [ ] Owner is specified
- [ ] Cost center is assigned

---

## 🔄 Migration from Old Naming

If you have resources with old naming:

1. **Don't rename immediately** - GCP resources can't always be renamed
2. **Apply labels** - Add required labels to existing resources
3. **Document exceptions** - Keep a list of legacy resources
4. **New resources only** - Apply new naming to all new resources
5. **Gradual migration** - Rename during major updates or recreations

---

## 📞 Questions or Exceptions?

**For naming convention questions:**
- Tech Lead: Jason Valenzano
- Platform Admin: Awaes Quadry

**For exceptions or special cases:**
- Document the reason
- Get Tech Lead approval
- Add to exceptions list
- Update this document if pattern emerges

---

**Version:** 1.0  
**Last Updated:** January 14, 2026  
**Next Review:** April 14, 2026  
**Source:** ARB Presentation, Leadership Proposal (January 12, 2026)
