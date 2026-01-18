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
- [x] **Task: Conductor - User Manual Verification 'Phase 1: API Endpoint and Basic Data Ingestion' (Protocol in workflow.md)** [checkpoint: 0719ee0]

## Phase 2: Database Integration

- [x] **Task: Set up database connection** 5d96d4b
    - [x] Write tests for database connection
    - [x] Implement database connection using SQLAlchemy
- [x] **Task: Create SQLAlchemy models for reports** ce8a717
    - [x] Write tests for SQLAlchemy models
    - [x] Implement SQLAlchemy models for `HazardReport`
- [x] **Task: Save submitted reports to the database** f43aa71
    - [x] Write tests for saving reports
    - [x] Implement logic to save reports to the database in the API endpoint
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Database Integration' (Protocol in workflow.md)** [checkpoint: 4f58e0c]

## Phase 3: TRACS-compliant Data Extraction and Confidence Scoring

- [x] **Task: Implement logic to extract TRACS category from report description**
    - [x] Write tests for TRACS category extraction
    - [x] Implement TRACS category extraction logic (e.g., using a local LLM or keyword matching)
- [x] **Task: Implement confidence scoring**
    - [x] Write tests for confidence scoring
    - [x] Implement confidence scoring logic based on `CONFIDENCE_WEIGHTS`
- [x] **Task: Store TRACS category and confidence score in the database**
    - [x] Write tests for storing TRACS data
    - [x] Update database saving logic to include TRACS category and confidence score
- [x] **Task: Implement GPS boundary validation (ADR-001)**
    - [x] Create `src/trailwatch/validators.py` with USFS region bounding boxes  
    - [x] Add validation call to `reports.py` (return 400 for invalid coords)
    - [x] Write tests in `tests/test_validators.py` (valid/invalid cases)
- [x] **Task: Conductor - User Manual Verification 'Phase 3: TRACS-compliant Data Extraction and Confidence Scoring' (Protocol in workflow.md)** [checkpoint: 3eb7f41dff292791b974e5e5c4a9d25e54a4fe29]
