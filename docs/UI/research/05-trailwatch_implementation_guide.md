# TrailWatch Agentic UI: Implementation Guide

**Purpose**: Code patterns, architecture diagrams, and concrete examples  
**Audience**: Frontend engineers (React/TypeScript)  
**Status**: Research-backed, not production-ready code

---

## ARCHITECTURE OVERVIEW

### System Diagram: Full Stack

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React + TypeScript)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────────────┐│
│  │ Map Component        │  │ Sidebar (AI Suggestions)     ││
│  │ ├─ Deck.gl          │  │ ├─ Top 3 insights           ││
│  │ ├─ Mapbox basemap   │  │ ├─ Spatial clustering       ││
│  │ ├─ Real-time points │  │ ├─ Trend analysis           ││
│  │ └─ Click-to-zoom    │  │ └─ [Confidence badges]      ││
│  │                      │  │                              ││
│  │ Event stream update  │  │ Stream listener             ││
│  │ when reports added   │  │ (via AG-UI/Vercel AI SDK)  ││
│  └──────────────────────┘  └──────────────────────────────┘│
│         ▲                                ▲                   │
│         │                                │                   │
│         └────────────────┬────────────────┘                  │
│                          │ SSE Stream                         │
│                  useChat / useEffect                          │
│                          │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (GCP Cloud Run)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  POST /api/extract                                           │
│  ├─ Receive: Photo + GPS + text                            │
│  ├─ Call: Vertex AI Gemini (via agent)                     │
│  └─ Stream: SSE events back to client                       │
│       ├─ TEXT_MESSAGE_CONTENT (streaming tokens)           │
│       ├─ TOOL_USE (GPS validation, TRACS mapping)          │
│       ├─ THINKING_STEP (AI reasoning traces)               │
│       └─ FINAL_OUTPUT (structured hazard data)             │
│                                                              │
│  POST /api/suggest/batch                                    │
│  ├─ Receive: 15 reports to assign                          │
│  ├─ Call: Vertex AI (crew optimization agent)              │
│  └─ Return: Batch assignment suggestions                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
           ▲                              ▲
           │                              │
           ├──────────────┬───────────────┘
           │              │
           ▼              ▼
    ┌─────────────┐  ┌────────────────┐
    │Vertex AI    │  │Cloud SQL        │
    │ Gemini      │  │+ PostGIS        │
    │ (ADK Agent) │  │(Trail geometry) │
    └─────────────┘  └────────────────┘
           ▲
           │
           ▼
    ┌─────────────────┐
    │Cloud Storage    │
    │(Photos, cache)  │
    └─────────────────┘
```

### Data Flow: Citizen Report → Ranger Approval

```
1. CITIZEN SUBMISSION (Mobile App)
   ├─ Takes photo + GPS + text
   ├─ Works offline
   └─ Queues in SQLite

2. SUBMISSION SYNC (When connected)
   ├─ Mobile sends to Cloud Storage
   ├─ Triggers Cloud Function (or async API)
   └─ Queues extraction task

3. BACKEND EXTRACTION
   ├─ Cloud Run receives: {photo, gps, text}
   ├─ Calls Vertex AI ADK Agent:
   │  ├─ Extract hazard type (vision + NLP)
   │  ├─ Map to TRACS code (knowledge)
   │  ├─ Validate GPS against trail geometry (PostGIS)
   │  └─ Generate urgency score
   ├─ Streams results via SSE
   └─ Saves to Cloud SQL

4. RANGER DASHBOARD RECEIVES
   ├─ SSE stream updates map in real-time
   ├─ Shows:
   │  ├─ Extraction (as it streams in)
   │  ├─ Confidence + why
   │  └─ Suggested crew assignment
   └─ Ranger reviews + approves/rejects

5. DECISION LOGGED
   ├─ Ranger approval (or rejection) saved
   ├─ Audit trail: Timestamp, ranger, confidence, reasoning
   ├─ Alert crew if approved
   └─ Archive for USFS reporting

6. CREW EXECUTION (Mobile App)
   ├─ Mobile notified: "New assignment"
   ├─ Shows location + hazard details
   ├─ Real-time updates from ranger if conditions change
   └─ On-site photo/report feeds back to ranger dashboard
```

---

## CODE EXAMPLES

### Example 1: SSE Stream Listener (React Hook)

```typescript
// hooks/useExtractionStream.ts
import { useEffect, useState } from 'react';

interface ExtractionEvent {
  type: 'TEXT_MESSAGE_CONTENT' | 'TOOL_USE' | 'THINKING_STEP' | 'FINAL_OUTPUT';
  content?: string;
  toolName?: string;
  reasoning?: string;
  extraction?: {
    hazardType: string;
    tracsCode: string;
    confidence: number;
    location: { lat: number; lng: number };
  };
}

export function useExtractionStream(reportId: string) {
  const [extraction, setExtraction] = useState<ExtractionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startExtraction = async (file: File, gps: GeoJSON.Point, text: string) => {
    setIsLoading(true);
    setError(null);
    setExtraction([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('gps', JSON.stringify(gps));
    formData.append('text', text);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      // Response is an SSE stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6)) as ExtractionEvent;
            setExtraction((prev) => [...prev, data]);
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  };

  return {
    extraction,
    isLoading,
    error,
    startExtraction,
  };
}
```

### Example 2: Confidence Indicator Component

```typescript
// components/ConfidenceIndicator.tsx
import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number; // 0-1
  explanation?: string;
  factors?: string[];
  onExplain?: () => void;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  explanation,
  factors,
  onExplain,
}) => {
  const percentage = Math.round(confidence * 100);
  const level = 
    confidence >= 0.9 ? 'very-high' :
    confidence >= 0.7 ? 'high' :
    confidence >= 0.5 ? 'medium' :
    'low';

  const colors = {
    'very-high': 'bg-green-600',
    'high': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'low': 'bg-red-500',
  };

  const labels = {
    'very-high': 'Very High Confidence',
    'high': 'High Confidence',
    'medium': 'Medium Confidence',
    'low': 'Low Confidence',
  };

  return (
    <div className="confidence-indicator space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className={`${colors[level]} h-2 rounded-full transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>

      <div className="text-sm font-medium text-gray-700">
        {labels[level]}
      </div>

      {explanation && (
        <p className="text-sm text-gray-600 italic">{explanation}</p>
      )}

      {(factors || onExplain) && (
        <button
          onClick={onExplain}
          className="text-xs text-blue-600 hover:underline"
        >
          Why this confidence? →
        </button>
      )}

      {factors && factors.length > 0 && (
        <details className="text-xs text-gray-600">
          <summary>Factors</summary>
          <ul className="list-disc list-inside mt-1">
            {factors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};
```

### Example 3: Cloud Run Backend (Python)

```python
# main.py (Cloud Run)
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import json
import asyncio
from google.cloud import vertexai
import base64

app = FastAPI()

vertexai.init(project="your-project", location="us-central1")

@app.post("/api/extract")
async def extract_hazard(
    file: UploadFile = File(...),
    gps: str = Form(...),
    text: str = Form(...)
):
    """
    Stream hazard extraction from citizen report
    Returns SSE events
    """

    # Read image
    image_bytes = await file.read()
    
    async def event_generator():
        try:
            # Upload photo to Cloud Storage
            image_base64 = base64.b64encode(image_bytes).decode()
            
            prompt = f"""
You are a trail hazard analysis expert for the US Forest Service.
Analyze this trail photo and report and extract hazard information.

GPS Coordinates: {gps}
Text Description: {text}

Extract:
1. Hazard type (rock fall, drainage issue, erosion, etc.)
2. TRACS code (Forest Service taxonomy)
3. Confidence (0-1)
4. Urgency (low/medium/high)
5. Recommended action

Output JSON format:
{{
  "hazard_type": "...",
  "tracs_code": "...",
  "confidence": 0.0,
  "urgency": "...",
  "action": "..."
}}
"""

            # Call Vertex AI Gemini with streaming
            from vertexai.generative_models import GenerativeModel, Part

            model = GenerativeModel("gemini-1.5-pro-vision")
            
            image_part = Part.from_data(image_bytes, mime_type="image/jpeg")
            
            response = model.generate_content(
                [image_part, prompt],
                stream=True
            )

            extraction_text = ""
            for chunk in response:
                if chunk.text:
                    extraction_text += chunk.text
                    yield f"data: {json.dumps({'type': 'TEXT_MESSAGE_CONTENT', 'content': chunk.text})}\n\n"

            # Parse final JSON
            import re
            
            json_match = re.search(r'\{.*\}', extraction_text, re.DOTALL)
            if json_match:
                extracted = json.loads(json_match.group())
                yield f"data: {json.dumps({'type': 'FINAL_OUTPUT', 'extraction': extracted})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'ERROR', 'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

### Example 4: Map Component (Deck.gl + Mapbox)

```typescript
// components/TrailMap.tsx
import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import mapboxgl from 'mapbox-gl';

interface ReportPoint {
  position: [number, number];
  hazardType: string;
  confidence: number;
  id: string;
}

interface TrailMapProps {
  reports: ReportPoint[];
  onReportClick: (id: string) => void;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  reports,
  onReportClick,
}) => {
  const [viewState, setViewState] = useState({
    longitude: -120.5,
    latitude: 38.5,
    zoom: 8,
  });

  const getColor = (hazardType: string) => {
    switch (hazardType) {
      case 'rock_fall': return [255, 0, 0];
      case 'drainage': return [0, 0, 255];
      case 'erosion': return [255, 165, 0];
      default: return [100, 100, 100];
    }
  };

  const scatterplotLayer = new ScatterplotLayer({
    id: 'reports-scatter',
    data: reports,
    pickable: true,
    radiusScale: 6,
    getPosition: (d: ReportPoint) => d.position,
    getRadius: (d: ReportPoint) => d.confidence * 10,
    getColor: (d: ReportPoint) => getColor(d.hazardType),
    onClick: (info) => {
      if (info.object) {
        onReportClick(info.object.id);
      }
    },
  });

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={[scatterplotLayer]}
      >
        <mapboxgl.Map
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        />
      </DeckGL>
    </div>
  );
};
```

---

## DEPLOYMENT

### Docker Container

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Cloud Run Deployment

```bash
gcloud builds submit --tag gcr.io/your-project/trailwatch-backend
gcloud run deploy trailwatch-backend \
  --image gcr.io/your-project/trailwatch-backend \
  --platform managed \
  --region us-central1 \
  --memory 4Gi \
  --timeout 300
```

---

## COST ESTIMATES (Annual)

Assuming 1,000 reports/day:

| Service | Cost |
|---------|------|
| Cloud Run | $1,200 |
| Vertex AI API | $2,000 |
| Cloud Storage | $500 |
| Cloud SQL | $3,000 |
| BigQuery | $2,000 |
| **Total** | **~$9,000-10,000** |

---

## PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Extraction latency (first token) | < 2 seconds |
| Complete extraction | < 8 seconds |
| Map render | < 1 second |
| Ranger decision time (batch of 15) | < 5 minutes |
| Undo latency | < 500ms |

---

## SECURITY CHECKLIST

- [ ] API endpoints require authentication
- [ ] Photos encrypted in transit (HTTPS)
- [ ] Database queries parameterized
- [ ] Ranger identity logged in audit trail
- [ ] FedRAMP-compliant region used
- [ ] No third-party SaaS without FedRAMP validation
- [ ] Rate limiting on extraction API
- [ ] XSS protection verified

---

*Implementation guide prepared January 2026.*
