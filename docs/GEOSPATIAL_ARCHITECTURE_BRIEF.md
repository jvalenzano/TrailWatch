# Geospatial & Offline Architecture Brief

**Version:** 1.0  
**Date:** January 16, 2026  
**Status:** APPROVED STRATEGY

## 1. Core Philosophy: "FOSS-First"
We will use Open Source software for 100% of the core mapping stack to eliminate per-user licensing fees and ensure offline dominance.

## 2. Mapping Stack Strategy

### 2.1 Basemap & Offline (MapLibre + Protomaps)
**Goal:** Unified online/offline vector map with zero commercial "tile tax."
*   **Engine:** **MapLibre GL JS** (Industry standard FOSS fork of Mapbox).
*   **Data Source:** **Protomaps (PMTiles)**. A single file containing the entire area of interest (e.g., "california.pmtiles").
*   **Hosting:**
    *   *Online:* Functionless delivery from Cloud Storage (HTTP Range Requests).
    *   *Offline:* The `.pmtiles` file is downloaded to the device and read locally by MapLibre Native.
*   **Cost:** Storage + Bandwidth only. No API keys.

### 2.2 The "Wow" Map (3D Ranger View)
**Goal:** Risk-free 3D visualization without Google 3D Tiles fees.
*   **Source:** **"Contour" Engine** (Adapted from `sk-ruban/contour`).
*   **Tech:** Three.js + AWS Terrain Tiles (Free).
*   **Integration:** Can overlay vector data from the same PMTiles source.

## 3. Offline-First Data Architecture ("The Backpack")

### 3.1 The Problem
Hikers have zero signal. "Caching" is not enough; we need a true database on the phone.

### 3.2 The Solution: SQLite + Sync
We reject PouchDB (bloat issues) in favor of the modern standard:
1.  **On-Device:** **SQLite** (via `op-sqlite` or `expo-sqlite`).
    *   Stores: User profile, active trail section (downloaded vector tiles), draft reports.
2.  **Sync Protocol:** "Delta Sync"
    *   App logs every change (INSERT report, ADD photo) to a local `mutation_queue`.
    *   When online, App pushes queue to Server.
    *   Server acknowledges.
    *   App deletes synced mutations.
3.  **Images:** Stored as files on device. Uploaded separately to Cloud Storage (GCS) with a reference ID in the database.

## 4. Data Integrity: "Snap-to-Trail"
GPS is messy. A hiker stands 10 meters off-trail to take a photo. We must mathematically "snap" them to the official trail line.

*   **Tool:** **PostGIS** (The gold standard FOSS geospatial database).
*   **Algorithm:**
    1.  **Buffer:** Find all trail segments within 50m of GPS point.
    2.  **Heading Match:** Prefer segments where trail bearing matches user's movement history (prevents snapping to the wrong switchback).
    3.  **Linear Referencing:** Calculate "Mile Marker" (e.g., `PCT_SECTION_J + 14.502km`).
    4.  **Storage:** Store *both* Raw GPS (truth) and Snapped Location (logic).

## 5. Implementation Checklist

### Phase 1: Foundation
*   [ ] Deploy **PostGIS** on Cloud SQL.
*   [ ] detailed **Schema Migration** (Trails, Segments, Reports).
*   [ ] Set up **Protomaps** tile hosting bucket.

### Phase 2: "Contour" Integration
*   [ ] Fork `sk-ruban/contour` frontend logic.
*   [ ] Adapt `terrain.py` to serve USFS GeoTIFFs if available, or fall back to AWS Tiles.
*   [ ] Connect Gemini Live API for "Ranger Voice."

### Phase 3: Offline Sync
*   [ ] Build SQLite schema for Mobile App.
*   [ ] Write `MutationSync` API endpoint (Python/FastAPI).
