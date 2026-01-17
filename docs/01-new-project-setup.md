# SOP: New GCP Project Setup
## Standard Operating Procedure for Creating New Projects

**Version:** 1.0  
**Last Updated:** 2026-01-14  
**Owner:** Platform Team  
**Frequency:** As needed

---

## 🎯 Purpose

This SOP defines the standard process for creating new GCP projects for TechTrend's AI prototyping team.

---

## 👥 Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| **Platform Admin (Awaes)** | Create project, link billing |
| **Tech Lead (Jason)** | Configure services, grant team access |
| **Requestor** | Provide project requirements |

---

## 📋 Prerequisites

- [ ] Project requirements documented
- [ ] Budget approved
- [ ] Team members identified
- [ ] Services needed identified
- [ ] GCP billing account available

---

## 🚀 Process

### Option A: Interactive Script (Recommended)

**Who:** Platform Admin or Tech Lead  
**Time:** 5-10 minutes

```bash
cd ~/Documents/TechTrend/platform-tools/project-templates/scripts
./create-project.sh
```

Follow the interactive prompts to:
1. Select project type
2. Enter project details
3. Choose services
4. Select team members
5. Review and confirm

The script will:
- Create the project
- Enable services
- Set up BigQuery (if selected)
- Grant IAM permissions
- Generate documentation

### Option B: Manual Process

**Who:** Platform Admin  
**Time:** 15-20 minutes

#### Step 1: Create Project

```bash
# Set variables
PROJECT_ID="tt-demo-projectname"
PROJECT_NAME="Project Display Name"
ENV="demo"  # or dev, prototype, rd
ENGAGEMENT="client-2025"  # or internal
OWNER="jvalenzano"
COST_CENTER="sales"  # or delivery, rd, internal

# Create project
gcloud projects create "$PROJECT_ID" \
  --name="$PROJECT_NAME" \
  --labels=environment="$ENV",engagement="$ENGAGEMENT",owner="$OWNER",cost-center="$COST_CENTER",status=active
```

#### Step 2: Link Billing

```bash
# Get billing account ID
gcloud billing accounts list

# Link billing
gcloud billing projects link "$PROJECT_ID" \
  --billing-account=BILLING_ACCOUNT_ID
```

#### Step 3: Enable Services

**Core Services (Always):**
```bash
gcloud services enable \
  run.googleapis.com \
  storage.googleapis.com \
  logging.googleapis.com \
  --project="$PROJECT_ID"
```

**AI/ML Stack:**
```bash
gcloud services enable \
  bigquery.googleapis.com \
  bigquerystorage.googleapis.com \
  aiplatform.googleapis.com \
  --project="$PROJECT_ID"
```

**Additional Services (As Needed):**
```bash
# Cloud Functions
gcloud services enable cloudfunctions.googleapis.com cloudbuild.googleapis.com --project="$PROJECT_ID"

# Cloud SQL
gcloud services enable sqladmin.googleapis.com --project="$PROJECT_ID"

# Pub/Sub
gcloud services enable pubsub.googleapis.com --project="$PROJECT_ID"
```

#### Step 4: Setup BigQuery

```bash
# Create dataset
DATASET_ID="${PROJECT_NAME}_dataset"
bq mk --dataset \
  --location=US \
  --description="Main dataset for $PROJECT_NAME" \
  --label=environment:"$ENV" \
  "$PROJECT_ID:$DATASET_ID"
```

#### Step 5: Grant Team Access

**Tech Lead (Jason):**
```bash
EMAIL="jvalenzano@techtrend.us"

gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/editor"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/run.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/resourcemanager.projectIamAdmin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/bigquery.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/aiplatform.admin"
```

**Senior Developer (Dennis):**
```bash
EMAIL="dbolanos@techtrend.us"

gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/editor"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/run.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/bigquery.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$EMAIL" --role="roles/aiplatform.admin"
```

---

## ✅ Verification

After setup, verify:

```bash
# Check project exists
gcloud projects describe "$PROJECT_ID"

# Check billing is linked
gcloud billing projects describe "$PROJECT_ID"

# Check services are enabled
gcloud services list --enabled --project="$PROJECT_ID"

# Check IAM permissions
gcloud projects get-iam-policy "$PROJECT_ID" \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:*@techtrend.us"

# Check BigQuery dataset
bq ls "$PROJECT_ID:"
```

---

## 📝 Documentation

After project creation:

1. **Create project documentation:**
   - Location: `~/Documents/TechTrend/platform-tools/projects/{PROJECT_ID}.md`
   - Include: Team members, services, purpose, links

2. **Update team wiki** (if applicable)

3. **Notify team members:**
   - Send project details
   - Share console link
   - Provide getting started guide

---

## 🆘 Troubleshooting

### "Project ID already exists"
**Solution:** Choose a different project ID (must be globally unique)

### "Billing account required"
**Solution:** Contact Awaes to link billing account

### "Permission denied" when enabling services
**Solution:** Ensure billing is linked first

### "API not enabled"
**Solution:** Enable required APIs with `gcloud services enable`

---

## 📊 Post-Setup Tasks

- [ ] Set up budget alerts
- [ ] Configure monitoring
- [ ] Create service accounts (if needed)
- [ ] Deploy initial services
- [ ] Test team member access
- [ ] Document project in wiki

---

## 📞 Support

**For project creation issues:**
- Platform Admin: Awaes Quadry (awaes.quadry@techtrend.us)

**For IAM/access issues:**
- Tech Lead: Jason Valenzano (jvalenzano@techtrend.us)

---

## 🔄 Related SOPs

- [02-developer-onboarding.md](./02-developer-onboarding.md) - Add developers to existing project
- [04-enable-gcp-service.md](./04-enable-gcp-service.md) - Enable additional services
- [06-project-naming.md](./06-project-naming.md) - Naming conventions

---

**Version History:**
- v1.0 (2026-01-14): Initial version
