# Implementation Plan: Intake Agent

## Phase 1: API Endpoint and Basic Data Ingestion

- [x] **Task: Create FastAPI application structure** b37bdf9
    - [x] Create `main.py`
    - [x] Create `core` directory for settings
    - [x] Create `api` directory for routes
- [x] **Task: Define Pydantic models for report submission** 6e2d5f3
    - [x] Write tests for Pydantic models
    - [x] Implement Pydantic models for `ReportIn` and `ReportOut`
- [x] **Task: Create API endpoint for report submission** 6c2cbfb
    - [x] Write tests for `POST /api/v1/reports` endpoint
    - [x] Implement `POST /api/v1/reports` endpoint
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: API Endpoint and Basic Data Ingestion' (Protocol in workflow.md)**

## Phase 2: Database Integration

- [ ] **Task: Set up database connection**
    - [ ] Write tests for database connection
    - [ ] Implement database connection using SQLAlchemy
- [ ] **Task: Create SQLAlchemy models for reports**
    - [ ] Write tests for SQLAlchemy models
    - [ ] Implement SQLAlchemy models for `HazardReport`
- [ ] **Task: Save submitted reports to the database**
    - [ ] Write tests for saving reports
    - [ ] Implement logic to save reports to the database in the API endpoint
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Database Integration' (Protocol in workflow.md)**

## Phase 3: TRACS-compliant Data Extraction and Confidence Scoring

- [ ] **Task: Implement logic to extract TRACS category from report description**
    - [ ] Write tests for TRACS category extraction
    - [ ] Implement TRACS category extraction logic (e.g., using a local LLM or keyword matching)
- [ ] **Task: Implement confidence scoring**
    - [ ] Write tests for confidence scoring
    - [ ] Implement confidence scoring logic based on `CONFIDENCE_WEIGHTS`
- [ ] **Task: Store TRACS category and confidence score in the database**
    - [ ] Write tests for storing TRACS data
    - [ ] Update database saving logic to include TRACS category and confidence score
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: TRACS-compliant Data Extraction and Confidence Scoring' (Protocol in workflow.md)**
