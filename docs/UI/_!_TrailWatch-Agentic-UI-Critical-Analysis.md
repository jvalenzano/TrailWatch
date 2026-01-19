Based on my research and critical analysis, here's a comprehensive AI-friendly implementation guide for TrailWatch's agentic UI. This document is designed to be consumed by AI code generation systems (like Cursor, Claude, or your development agents) to build production-ready features.

***

# TrailWatch Agentic UI: Implementation Specification for AI Development

**Version:** 2.0  
**Date:** January 19, 2026  
**Target:** AI-assisted code generation systems  
**Context:** Forest Service rangers triaging 20-50 crowdsourced trail hazard reports daily  
**Tech Stack:** React/TypeScript, Google Vertex AI ADK, PostGIS, Cloud Run, MapLibre GL

***

## CRITICAL DESIGN PRINCIPLES

### 1. Agentic ≠ Conversational
**DO NOT BUILD:** Chat interfaces, natural language queries, conversational sidebars  
**BUILD INSTEAD:** Proactive insight cards, contextual suggestions, structured reasoning displays  
**WHY:** Rangers think spatially (maps, clusters, geography), not conversationally

### 2. Transparency > Accuracy
**REQUIREMENT:** Every AI decision must show:
- What data was analyzed
- What reasoning was applied
- Why this recommendation emerged
- How ranger can verify/override

**IMPLEMENTATION:** Expandable reasoning panels, tool invocation logs, confidence indicators

### 3. Attention Management, Not Information Display
**ANTI-PATTERN:** Show all insights; let ranger filter noise  
**CORRECT PATTERN:** Surface only contextually relevant insights; allow one-click dismiss; track dismissals to adapt future suggestions

### 4. Safety Circuit-Breakers for High-Risk Decisions
**REQUIREMENT:** Trail closure recommendations, emergency notices, impassable hazards MUST:
- Require explicit ranger approval (not passive acceptance)
- Cannot be batch-assigned
- Must feel "difficult" in UI (deliberate friction)
- Log reasoning + ranger decision for audits

### 5. Graceful Degradation
**OFFLINE MODE:** Pre-computed defaults only; clear staleness indicators; no live agentic suggestions  
**AI FAILURE:** Dashboard still functional; cached data displayed; manual classification available  
**RANGER DISTRUST:** Feature flags allow disabling agentic features without breaking core UI

***

## ARCHITECTURE: THREE-PANEL LAYOUT

```
┌─────────────────────────────────────────────────────────────────┐
│  [Left: Spatial Insights - 20%]  [Center: Map - 60%]  [Right: Reports/Actions - 20%]  │
└─────────────────────────────────────────────────────────────────┘
```

### Left Panel: Spatial Insights Sidebar (Agentic Intelligence)
**NOT:** Static list of all insights  
**IS:** Dynamic, context-aware cards showing patterns/alerts ranger wouldn't otherwise notice

**Component Structure:**
```tsx
<SpatialInsightsSidebar>
  <InsightCard type="cluster" priority="high" dismissible={true}>
    <CardHeader icon="📍" severity="high">SPATIAL ALERT</CardHeader>
    <CardBody>
      {/* AI-generated summary */}
      <ClusterSummary reports={4} radius="1mi" timeWindow="4hrs" />
      <WeatherCorrelation event="Wind gusts 0600-0800" />
      <HistoricalPattern match="8 reports last March, similar conditions" />
    </CardBody>
    <CardActions>
      <Button primary onClick={viewOnMap}>View Reports on Map</Button>
      <Button secondary onClick={issueCombinedNotice}>Issue Combined Notice</Button>
      <Button tertiary onClick={dismiss}>Dismiss</Button>
    </CardActions>
    <ReasoningPanel expandable={true}>
      {/* Tool invocation logs */}
      <ToolLog>✓ Queried PostGIS for spatial proximity</ToolLog>
      <ToolLog>✓ Analyzed weather data from NOAA API</ToolLog>
      <ToolLog>✓ Matched historical patterns (March 2025)</ToolLog>
    </ReasoningPanel>
  </InsightCard>
</SpatialInsightsSidebar>
```

**Insight Card Types (Prioritized):**

1. **CLUSTER ALERTS** (Pattern A: "You Missed Something Obvious")
   - Trigger: 3+ reports within 1mi, <6hrs, similar hazard type
   - Display: Map thumbnail, report count, recommended action
   - Action: "Issue Combined Notice" vs. "Keep Separate"

2. **CONSISTENCY CHECKS** (Pattern B: "Here's Your Blindspot")
   - Trigger: Assignment bias detected (e.g., District 3: 18 reports, District 4: 0 reports in 60 days)
   - Display: Data visualization, possible explanations, no accusatory tone
   - Action: "View Coverage Map" / "Acknowledge Bias" / "Dismiss"

3. **EXPERTISE VALIDATION** (Pattern C: "Confirming Your Expertise")
   - Trigger: New ranger OR ambiguous classification
   - Display: "Senior Ranger Martinez would classify as TRACS 242" + ranger's own history
   - Action: "Accept" / "Override & Explain"

4. **DUPLICATE DETECTION**
   - Trigger: Similarity score >90% to recent report
   - Display: Side-by-side photo comparison, GPS distance, time delta
   - Action: "Mark as Duplicate" / "Keep Separate"

**Dismissal Behavior:**
```tsx
const handleDismiss = (insightId: string) => {
  // Log dismissal for adaptation
  logUserAction({
    action: 'dismiss_insight',
    insightType: insight.type,
    insightId,
    timestamp: Date.now(),
    rangerId: currentUser.id
  });
  
  // Adaptive learning: if ranger dismisses same insight type 3x, reduce frequency
  const dismissalCount = getDismissalCount(insight.type, currentUser.id);
  if (dismissalCount >= 3) {
    updateInsightPriority(insight.type, 'reduce_frequency');
  }
  
  // Remove from view with animation
  removeInsight(insightId);
};
```

***

### Center Panel: Map (60% Width)

**DO NOT CHANGE:** Keep existing MapLibre implementation  
**ENHANCE:** Add interaction hooks for agentic features

**Agentic Enhancements:**

1. **Context-Aware Marker Clustering**
```tsx
// When ranger hovers on cluster for >2 seconds, proactively show insight card
<MapCluster 
  onHoverDuration={2000}
  onHoverEnd={() => {
    if (clusterMeetsPatternCriteria(cluster)) {
      showInsightCard({
        type: 'cluster',
        data: analyzeCluster(cluster),
        position: 'left-sidebar'
      });
    }
  }}
/>
```

2. **Visual Reasoning Trace**
```tsx
// When AI suggests combined notice, highlight affected reports on map
<MapMarker 
  id={report.id}
  highlight={report.id in suggestedCombinedNotice}
  pulseAnimation={true}
  tooltipContent={
    <div>
      <p>Part of suggested combined notice</p>
      <small>Click to view reasoning</small>
    </div>
  }
/>
```

3. **Historical Pattern Overlay (Optional)**
```tsx
// Show historical report heatmap when viewing seasonal trends
<MapLayer 
  id="historical-heatmap"
  type="heatmap"
  data={historicalReports}
  visible={showingSeasonalTrend}
  opacity={0.5}
/>
```

***

### Right Panel: Report Detail + Actions (20% Width)

**CRITICAL FIX:** Remove dual scrollbars, red divider line (current P0 bug) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/21316841/8d3d7866-0f01-4537-84a9-08664351c859/ui-screen-agentic.jpg)

**Unified Panel Structure:**
```tsx
<ReportPanel className="h-full overflow-hidden flex flex-col">
  {/* Header: Fixed, no scroll */}
  <PanelHeader className="p-4 border-b border-gray-800">
    <h3>Selected Report</h3>
    <Badge severity={report.severity}>{report.tracs_code}</Badge>
  </PanelHeader>
  
  {/* Scrollable content area: Single unified scroll */}
  <PanelContent className="flex-1 overflow-auto p-4 space-y-4">
    {/* Report metadata */}
    <ReportMetadata report={report} />
    
    {/* AI Extraction with structured reasoning */}
    <AIExtractionCard expandable={true}>
      <SummaryView>
        <div className="flex items-center justify-between">
          <span>TRACS 245 - Obstruction/Tree</span>
          <ConfidenceBadge value={0.89} />
        </div>
      </SummaryView>
      
      <ReasoningView expanded={reasoningExpanded}>
        <ReasoningStep>
          <Icon>✓</Icon>
          <Text>Citizen photo shows obstruction (tree trunk visible)</Text>
        </ReasoningStep>
        <ReasoningStep>
          <Icon>✓</Icon>
          <Text>GPS validated against Wonderland Trail #407 (0.3mi offset)</Text>
        </ReasoningStep>
        <ReasoningStep>
          <Icon>✓</Icon>
          <Text>Size estimate from photo: 3ft diameter → 2-3hrs to clear</Text>
        </ReasoningStep>
        <ReasoningStep>
          <Icon>⚠️</Icon>
          <Text>Confidence: 0.89 (High). Alternative: TRACS 242 (12% probability)</Text>
        </ReasoningStep>
      </ReasoningView>
    </AIExtractionCard>
    
    {/* Contextual defaults with explainability */}
    <AssignmentCard>
      <Label>Suggested Assignment</Label>
      <DefaultValue>
        <strong>District 7, Crew A</strong>
        <small className="text-gray-500">
          Based on: 4 similar reports routed to District 7 in last 30 days
        </small>
      </DefaultValue>
      <ActionButtons>
        <Button variant="accept" onClick={acceptDefault}>Keep</Button>
        <Button variant="change" onClick={openDistrictPicker}>Change</Button>
      </ActionButtons>
    </AssignmentCard>
    
    {/* Similar reports (duplicate detection) */}
    {similarReports.length > 0 && (
      <SimilarReportsCard>
        <CardHeader>🔗 Similar Reports</CardHeader>
        <ReportList>
          {similarReports.map(r => (
            <ReportLink 
              key={r.id} 
              report={r}
              similarity={r.similarity}
              onClick={() => viewReport(r.id)}
            />
          ))}
        </ReportList>
      </SimilarReportsCard>
    )}
    
    {/* Citizen submission original data */}
    <CitizenSubmissionCard>
      <Photo src={report.photo_url} />
      <Text>{report.description}</Text>
      <GPS lat={report.lat} lng={report.lng} />
    </CitizenSubmissionCard>
  </PanelContent>
  
  {/* Actions: Fixed footer, no scroll */}
  <PanelActions className="p-4 border-t border-gray-800 bg-gray-900">
    <Button 
      primary 
      onClick={approveReport}
      disabled={report.severity === 'critical' && !explicitReviewComplete}
    >
      Approve & Route
    </Button>
    <Button secondary onClick={editClassification}>
      Edit Classification
    </Button>
    <Button tertiary onClick={markAsInvalid}>
      Mark Invalid
    </Button>
  </PanelActions>
</ReportPanel>
```

***

## TIER 1 FEATURES (HIGH VALUE, LOW RISK)

### 1A. Structured Reasoning Display

**IMPLEMENTATION:**
```tsx
interface ReasoningStep {
  id: string;
  status: 'success' | 'warning' | 'error';
  icon: string;
  message: string;
  timestamp: number;
  toolUsed?: string;
  confidence?: number;
}

const AIReasoningPanel: React.FC<{
  report: Report;
  expanded: boolean;
}> = ({ report, expanded }) => {
  const reasoning = useAIReasoning(report.id);
  
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <ChevronIcon expanded={expanded} />
        <span className="font-medium">AI Reasoning</span>
        <ConfidenceBadge value={reasoning.confidence} />
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-2">
          {reasoning.steps.map(step => (
            <ReasoningStep key={step.id}>
              <StatusIcon status={step.status} />
              <StepMessage>{step.message}</StepMessage>
              {step.toolUsed && (
                <ToolBadge>{step.toolUsed}</ToolBadge>
              )}
            </ReasoningStep>
          ))}
          
          {/* Audit log link */}
          <button 
            onClick={() => viewFullAuditLog(report.id)}
            className="text-sm text-blue-400 hover:underline"
          >
            View full audit log →
          </button>
        </div>
      )}
    </div>
  );
};
```

**BACKEND API:**
```typescript
// POST /api/reports/:id/classify
interface ClassificationResponse {
  tracs_code: string;
  confidence: number;
  reasoning: ReasoningStep[];
  alternatives: Array<{
    tracs_code: string;
    probability: number;
    reasoning_summary: string;
  }>;
  tools_invoked: string[]; // ['postgis_validation', 'photo_analysis', 'historical_pattern_match']
}
```

**AUDIT LOGGING:**
```typescript
// Every AI decision logged BEFORE ranger sees it
const logAIDecision = async (report: Report, classification: ClassificationResponse) => {
  await db.aiDecisionLogs.create({
    report_id: report.id,
    timestamp: Date.now(),
    model_version: 'gemini-2.0-flash',
    classification: classification.tracs_code,
    confidence: classification.confidence,
    reasoning_steps: classification.reasoning,
    alternatives: classification.alternatives,
    ranger_id: null, // Not yet reviewed by ranger
    ranger_action: null // Will be populated when ranger approves/overrides
  });
};

// Log ranger's decision
const logRangerDecision = async (
  report: Report, 
  action: 'approve' | 'override', 
  finalClassification: string,
  explanation?: string
) => {
  await db.aiDecisionLogs.update({
    where: { report_id: report.id },
    data: {
      ranger_id: currentUser.id,
      ranger_action: action,
      final_classification: finalClassification,
      ranger_explanation: explanation,
      reviewed_at: Date.now()
    }
  });
};
```

***

### 1B. Batch Assignment Interface

**REQUIREMENTS:**
- Select multiple reports (checkbox UI)
- Show route summary (total mileage, estimated travel time)
- Display crew capacity context ("You last assigned Crew A on Jan 15; completed in 3 days")
- Single-action confirm

**IMPLEMENTATION:**
```tsx
const BatchAssignmentModal: React.FC<{
  selectedReports: Report[];
  onConfirm: (assignment: Assignment) => void;
  onCancel: () => void;
}> = ({ selectedReports, onConfirm, onCancel }) => {
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  const routeSummary = useRoutePlanning(selectedReports, selectedCrew);
  const crewHistory = useCrewHistory(selectedCrew);
  
  return (
    <Modal size="large">
      <ModalHeader>Assign {selectedReports.length} Reports</ModalHeader>
      
      <ModalBody>
        {/* District selector */}
        <FormGroup>
          <Label>District</Label>
          <DistrictPicker 
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            suggestedDefault={getMostCommonDistrict(selectedReports)}
            suggestionReason="Most common district for selected reports"
          />
        </FormGroup>
        
        {/* Crew selector */}
        <FormGroup>
          <Label>Crew</Label>
          <CrewPicker 
            value={selectedCrew}
            onChange={setSelectedCrew}
            district={selectedDistrict}
          />
        </FormGroup>
        
        {/* Route planning summary */}
        {selectedCrew && (
          <RouteSummary>
            <SummaryItem>
              <Icon>📍</Icon>
              <Text>Total Distance: {routeSummary.totalMiles} miles</Text>
            </SummaryItem>
            <SummaryItem>
              <Icon>⏱️</Icon>
              <Text>Estimated Travel: {routeSummary.travelTime} hours</Text>
            </SummaryItem>
            <SummaryItem>
              <Icon>🔧</Icon>
              <Text>Estimated Work: {routeSummary.workTime} hours</Text>
            </SummaryItem>
          </RouteSummary>
        )}
        
        {/* Crew history context */}
        {crewHistory && (
          <CrewHistoryCard>
            <CardHeader>Crew A Recent Performance</CardHeader>
            <HistoryItem>
              Last assignment: {crewHistory.lastAssignment.date}
            </HistoryItem>
            <HistoryItem>
              Completion time: {crewHistory.lastAssignment.completionDays} days
            </HistoryItem>
            <HistoryItem>
              Current capacity: {crewHistory.currentCapacity}% available
            </HistoryItem>
          </CrewHistoryCard>
        )}
        
        {/* Report list preview */}
        <ReportListPreview>
          <ListHeader>Reports to Assign</ListHeader>
          {selectedReports.map(r => (
            <ReportPreviewItem key={r.id}>
              <ReportIcon type={r.hazard_type} />
              <ReportSummary>
                {r.tracs_code} · {r.location_name}
              </ReportSummary>
              <SeverityBadge severity={r.severity} />
            </ReportPreviewItem>
          ))}
        </ReportListPreview>
      </ModalBody>
      
      <ModalFooter>
        <Button secondary onClick={onCancel}>Cancel</Button>
        <Button 
          primary 
          onClick={() => onConfirm({
            reports: selectedReports,
            crew: selectedCrew,
            district: selectedDistrict
          })}
          disabled={!selectedCrew || !selectedDistrict}
        >
          Assign to Crew
        </Button>
      </ModalFooter>
    </Modal>
  );
};
```

***

### 1C. Duplicate Detection

**TRIGGER:** On report detail view, check for >90% similarity to recent reports

**IMPLEMENTATION:**
```tsx
const DuplicateDetectionCard: React.FC<{
  report: Report;
  duplicates: Report[];
}> = ({ report, duplicates }) => {
  if (duplicates.length === 0) return null;
  
  return (
    <Card severity="warning" className="border-yellow-600">
      <CardHeader icon="⚠️">Possible Duplicate</CardHeader>
      <CardBody>
        <p className="text-sm mb-3">
          This report is {(duplicates[0].similarity * 100).toFixed(0)}% similar 
          to report #{duplicates[0].id} from {formatRelativeTime(duplicates[0].submitted_at)}.
        </p>
        
        {/* Side-by-side comparison */}
        <ComparisonGrid>
          <ComparisonColumn>
            <ColumnHeader>Current Report</ColumnHeader>
            <Photo src={report.photo_url} />
            <MetadataList>
              <MetadataItem>
                <Label>Location:</Label>
                <Value>{report.gps_coords}</Value>
              </MetadataItem>
              <MetadataItem>
                <Label>Description:</Label>
                <Value>{report.description}</Value>
              </MetadataItem>
            </MetadataList>
          </ComparisonColumn>
          
          <ComparisonColumn>
            <ColumnHeader>Report #{duplicates[0].id}</ColumnHeader>
            <Photo src={duplicates[0].photo_url} />
            <MetadataList>
              <MetadataItem>
                <Label>Location:</Label>
                <Value>{duplicates[0].gps_coords}</Value>
              </MetadataItem>
              <MetadataItem>
                <Label>Distance:</Label>
                <Value>{duplicates[0].distance_meters}m apart</Value>
              </MetadataItem>
            </MetadataList>
          </ComparisonColumn>
        </ComparisonGrid>
      </CardBody>
      
      <CardActions>
        <Button onClick={() => markAsDuplicate(report.id, duplicates[0].id)}>
          Mark as Duplicate
        </Button>
        <Button secondary onClick={() => keepSeparate(report.id)}>
          Keep Separate
        </Button>
        <Button tertiary onClick={() => viewBothOnMap([report, duplicates[0]])}>
          View Both on Map
        </Button>
      </CardActions>
    </Card>
  );
};
```

**BACKEND:**
```python
# Vector similarity search using embeddings
from google.cloud import aiplatform
from sklearn.metrics.pairwise import cosine_similarity

def find_duplicate_reports(new_report: Report, threshold: float = 0.90):
    """
    Find similar reports using text + image embeddings
    """
    # Generate embeddings for new report
    new_embedding = generate_multimodal_embedding(
        text=new_report.description,
        image_url=new_report.photo_url,
        gps_coords=(new_report.lat, new_report.lng)
    )
    
    # Query recent reports (last 30 days, within 5 miles)
    recent_reports = db.reports.query(
        submitted_after=datetime.now() - timedelta(days=30),
        within_distance=(new_report.lat, new_report.lng, 5.0)  # 5 mile radius
    )
    
    # Compute similarity scores
    similarities = []
    for report in recent_reports:
        similarity = cosine_similarity(
            new_embedding, 
            report.embedding
        )[0][0]
        
        if similarity >= threshold:
            similarities.append({
                'report': report,
                'similarity': similarity,
                'distance_meters': calculate_gps_distance(
                    (new_report.lat, new_report.lng),
                    (report.lat, report.lng)
                )
            })
    
    return sorted(similarities, key=lambda x: x['similarity'], reverse=True)
```

***

### 1D. Offline-Tolerant Defaults

**REQUIREMENT:** Field coordinators offline must still see suggested defaults, but with clear staleness indicators

**IMPLEMENTATION:**
```tsx
const OfflineIndicator: React.FC<{
  lastSyncTime: number;
  isOnline: boolean;
}> = ({ lastSyncTime, isOnline }) => {
  if (isOnline) return null;
  
  return (
    <Alert severity="warning" className="mb-4">
      <AlertIcon>📡</AlertIcon>
      <AlertMessage>
        <strong>OFFLINE MODE</strong>
        <br />
        Last data sync: {formatRelativeTime(lastSyncTime)}
        <br />
        Suggestions may be stale. Validate before submitting.
      </AlertMessage>
    </Alert>
  );
};

const OfflineTolerantDefaults: React.FC<{
  report: Report;
}> = ({ report }) => {
  const isOnline = useOnlineStatus();
  const defaults = useDefaultSuggestions(report, {
    preferCached: !isOnline
  });
  
  return (
    <div>
      {!isOnline && (
        <OfflineIndicator lastSyncTime={defaults.cachedAt} isOnline={isOnline} />
      )}
      
      <FormGroup>
        <Label>Suggested District</Label>
        <Select 
          value={defaults.district}
          onChange={handleDistrictChange}
        >
          {/* Options */}
        </Select>
        <HelpText>
          {isOnline 
            ? `Based on current crew locations and report patterns`
            : `[CACHED] Based on historical patterns (last updated ${formatRelativeTime(defaults.cachedAt)})`
          }
        </HelpText>
      </FormGroup>
    </div>
  );
};
```

**SERVICE WORKER (Offline Cache):**
```typescript
// Service worker caches recent data for offline access
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('trailwatch-v1').then((cache) => {
      return cache.addAll([
        '/api/districts',
        '/api/crews',
        '/api/tracs-codes',
        '/api/default-suggestions' // Pre-computed defaults
      ]);
    })
  );
});

// Serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

***

## TIER 2 FEATURES (MEDIUM VALUE, MEDIUM RISK)

### 2A. Spatial Pattern Detection (Cluster Alerts)

**TRIGGER CONDITIONS:**
- 3+ reports within 1 mile radius
- Submitted within 6-hour window
- Same/similar hazard type (TRACS category match)

**IMPLEMENTATION:**
```typescript
// Backend: Spatial clustering analysis
interface ClusterAnalysis {
  cluster_id: string;
  reports: Report[];
  center_point: [number, number]; // [lat, lng]
  radius_miles: number;
  time_window_hours: number;
  hazard_types: string[];
  weather_correlation?: WeatherEvent;
  historical_match?: HistoricalPattern;
  recommendation: 'combined_notice' | 'separate_work_orders';
}

const analyzeCluster = async (reports: Report[]): Promise<ClusterAnalysis> => {
  // PostGIS spatial clustering
  const clusters = await db.query(`
    SELECT 
      ST_ClusterDBSCAN(ST_MakePoint(lng, lat), eps := 0.016, minpoints := 3) OVER () AS cluster_id,
      report_id,
      submitted_at,
      tracs_code
    FROM reports
    WHERE submitted_at > NOW() - INTERVAL '6 hours'
    GROUP BY cluster_id
    HAVING COUNT(*) >= 3
  `);
  
  // Weather API correlation
  const weatherEvents = await fetchWeatherData({
    location: cluster.center_point,
    timeRange: [cluster.earliest_report, cluster.latest_report]
  });
  
  // Historical pattern matching
  const historicalMatches = await db.historicalPatterns.query({
    location: cluster.center_point,
    hazard_types: cluster.hazard_types,
    season: getCurrentSeason()
  });
  
  return {
    cluster_id: generateClusterId(),
    reports: cluster.reports,
    center_point: calculateCentroid(cluster.reports),
    radius_miles: calculateRadius(cluster.reports),
    time_window_hours: calculateTimeWindow(cluster.reports),
    hazard_types: extractHazardTypes(cluster.reports),
    weather_correlation: weatherEvents.find(e => e.severity === 'high'),
    historical_match: historicalMatches[0],
    recommendation: cluster.reports.length >= 4 ? 'combined_notice' : 'separate_work_orders'
  };
};
```

**FRONTEND CARD:**
```tsx
const ClusterAlertCard: React.FC<{
  cluster: ClusterAnalysis;
}> = ({ cluster }) => {
  return (
    <InsightCard severity="high" type="cluster">
      <CardHeader icon="📍">SPATIAL ALERT</CardHeader>
      
      <CardBody>
        <AlertSummary>
          <strong>Unusual cluster:</strong> {cluster.reports.length} '{cluster.hazard_types[0]}' reports 
          within {cluster.radius_miles.toFixed(1)} mile of each other, 
          all submitted in last {cluster.time_window_hours} hours.
        </AlertSummary>
        
        {cluster.weather_correlation && (
          <WeatherContext className="mt-2 p-2 bg-yellow-900/30 rounded">
            <WeatherIcon type={cluster.weather_correlation.type} />
            <WeatherText>
              <strong>Weather:</strong> {cluster.weather_correlation.description} 
              recorded {formatTimeRange(cluster.weather_correlation.start, cluster.weather_correlation.end)} 
              in this area.
            </WeatherText>
          </WeatherContext>
        )}
        
        {cluster.historical_match && (
          <HistoricalContext className="mt-2 p-2 bg-blue-900/30 rounded">
            <HistoricalText>
              Similar conditions led to {cluster.historical_match.report_count} reports 
              in {cluster.historical_match.month} {cluster.historical_match.year}.
            </HistoricalText>
          </HistoricalContext>
        )}
        
        <Recommendation className="mt-3 p-3 bg-gray-800 rounded">
          <RecommendationText>
            This might be <strong>ONE storm event</strong>, not {cluster.reports.length} independent issues.
            <br />
            Consider issuing single emergency notice vs. {cluster.reports.length} separate work orders.
          </RecommendationText>
        </Recommendation>
      </CardBody>
      
      <CardActions>
        <Button primary onClick={() => viewClusterOnMap(cluster)}>
          View Reports on Map
        </Button>
        <Button secondary onClick={() => issueCombinedNotice(cluster)}>
          Issue Combined Notice
        </Button>
        <Button tertiary onClick={() => dismissCluster(cluster.cluster_id)}>
          Keep Separate
        </Button>
      </CardActions>
      
      <ReasoningPanel expandable={true}>
        <ReasoningStep>
          ✓ Queried PostGIS for spatial proximity (DBSCAN clustering)
        </ReasoningStep>
        <ReasoningStep>
          ✓ Analyzed weather data from NOAA API (wind gusts 0600-0800)
        </ReasoningStep>
        <ReasoningStep>
          ✓ Matched historical patterns (March 2025, 8 similar reports)
        </ReasoningStep>
      </ReasoningPanel>
    </InsightCard>
  );
};
```

***

### 2B. Assignment Consistency Checks

**TRIGGER:** Weekly analysis of ranger assignment patterns; surface potential bias

**IMPLEMENTATION:**
```typescript
// Backend: Assignment pattern analysis
interface ConsistencyCheck {
  check_id: string;
  ranger_id: string;
  issue_type: 'territory_bias' | 'crew_preference' | 'time_bias';
  severity: 'low' | 'medium' | 'high';
  data: {
    district_a: { name: string; assignment_count: number };
    district_b: { name: string; assignment_count: number };
    time_period_days: number;
  };
  explanations: string[];
}

const detectAssignmentBias = async (ranger_id: string): Promise<ConsistencyCheck[]> => {
  const assignments = await db.assignments.query({
    ranger_id,
    created_after: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // Last 60 days
  });
  
  // Detect territory bias
  const districtCounts = countByDistrict(assignments);
  const biases = [];
  
  for (const [districtA, countA] of Object.entries(districtCounts)) {
    for (const [districtB, countB] of Object.entries(districtCounts)) {
      if (districtA === districtB) continue;
      
      // Check for significant imbalance (e.g., 18 vs 0)
      if (countA > 10 && countB === 0) {
        biases.push({
          check_id: generateCheckId(),
          ranger_id,
          issue_type: 'territory_bias',
          severity: 'medium',
          data: {
            district_a: { name: districtA, assignment_count: countA },
            district_b: { name: districtB, assignment_count: countB },
            time_period_days: 60
          },
          explanations: [
            `District ${districtB} terrain may be genuinely different`,
            `Reporting bias (fewer submissions from District ${districtB} area)`,
            `You may have unconscious territory bias in assignment patterns`
          ]
        });
      }
    }
  }
  
  return biases;
};
```

**FRONTEND CARD:**
```tsx
const ConsistencyCheckCard: React.FC<{
  check: ConsistencyCheck;
}> = ({ check }) => {
  return (
    <InsightCard severity="medium" type="consistency_check">
      <CardHeader icon="⚠️">CONSISTENCY CHECK</CardHeader>
      
      <CardBody>
        <CheckSummary>
          In the last {check.data.time_period_days} days, you've assigned{' '}
          <strong>{check.data.district_a.assignment_count} '{check.data.district_a.name}'</strong> reports 
          to District {check.data.district_a.name}, but{' '}
          <strong>{check.data.district_b.assignment_count} to District {check.data.district_b.name}</strong> 
          (which covers similar terrain).
        </CheckSummary>
        
        <DataVisualization className="my-3">
          <BarChart>
            <Bar 
              label={check.data.district_a.name} 
              value={check.data.district_a.assignment_count} 
              color="blue" 
            />
            <Bar 
              label={check.data.district_b.name} 
              value={check.data.district_b.assignment_count} 
              color="gray" 
            />
          </BarChart>
        </DataVisualization>
        
        <ExplanationList>
          <ListHeader>Possible explanations:</ListHeader>
          {check.explanations.map((exp, i) => (
            <ExplanationItem key={i}>
              <Bullet>•</Bullet>
              <ExplanationText>{exp}</ExplanationText>
            </ExplanationItem>
          ))}
        </ExplanationList>
      </CardBody>
      
      <CardActions>
        <Button primary onClick={() => viewCoverageMap(check.data.district_b.name)}>
          View District {check.data.district_b.name} Coverage Map
        </Button>
        <Button secondary onClick={() => acknowledgeBias(check.check_id)}>
          Acknowledge Bias
        </Button>
        <Button tertiary onClick={() => dismissCheck(check.check_id)}>
          Dismiss
        </Button>
      </CardActions>
    </InsightCard>
  );
};
```

***

## SAFETY CIRCUIT-BREAKERS

### High-Risk Decision Handling

**REQUIREMENT:** Immediate closures, emergency notices, impassable hazards MUST have explicit deliberate review

**IMPLEMENTATION:**
```tsx
const HighRiskDecisionGuard: React.FC<{
  report: Report;
  onApprove: () => void;
}> = ({ report, onApprove }) => {
  const [explicitReviewComplete, setExplicitReviewComplete] = useState(false);
  const [reviewChecklist, setReviewChecklist] = useState({
    photoReviewed: false,
    gpsValidated: false,
    severityConfirmed: false,
    closureJustified: false
  });
  
  const isHighRisk = report.severity === 'critical' || 
                     report.recommended_action === 'immediate_closure';
  
  if (!isHighRisk) {
    return <Button primary onClick={onApprove}>Approve</Button>;
  }
  
  const allChecksComplete = Object.values(reviewChecklist).every(v => v);
  
  return (
    <div className="border-2 border-red-600 rounded-lg p-4 bg-red-900/20">
      <WarningHeader className="flex items-center gap-2 mb-3">
        <Icon className="text-red-500">⚠️</Icon>
        <Text className="text-red-400 font-bold">HIGH-RISK DECISION</Text>
      </WarningHeader>
      
      <ExplicitReviewChecklist>
        <ChecklistItem>
          <Checkbox 
            checked={reviewChecklist.photoReviewed}
            onChange={(v) => setReviewChecklist({...reviewChecklist, photoReviewed: v})}
          />
          <Label>I have reviewed the citizen photo evidence</Label>
        </ChecklistItem>
        
        <ChecklistItem>
          <Checkbox 
            checked={reviewChecklist.gpsValidated}
            onChange={(v) => setReviewChecklist({...reviewChecklist, gpsValidated: v})}
          />
          <Label>GPS coordinates validated against trail geometry</Label>
        </ChecklistItem>
        
        <ChecklistItem>
          <Checkbox 
            checked={reviewChecklist.severityConfirmed}
            onChange={(v) => setReviewChecklist({...reviewChecklist, severityConfirmed: v})}
          />
          <Label>Severity classification is appropriate (not over/under-classified)</Label>
        </ChecklistItem>
        
        <ChecklistItem>
          <Checkbox 
            checked={reviewChecklist.closureJustified}
            onChange={(v) => setReviewChecklist({...reviewChecklist, closureJustified: v})}
          />
          <Label>Trail closure notice is justified and necessary</Label>
        </ChecklistItem>
      </ExplicitReviewChecklist>
      
      <RequiredTextField className="mt-3">
        <Label>Justification (Required):</Label>
        <Textarea 
          placeholder="Explain why immediate closure is warranted..."
          required
          minLength={50}
        />
      </RequiredTextField>
      
      <Button 
        primary 
        onClick={onApprove}
        disabled={!allChecksComplete}
        className="mt-4 w-full"
      >
        Approve High-Risk Decision
      </Button>
      
      <HelpText className="mt-2 text-sm text-gray-400">
        High-risk decisions are logged for audit compliance and require explicit review.
      </HelpText>
    </div>
  );
};
```

***

## AUDIT LOGGING SPECIFICATIONS

**REQUIREMENT:** Every AI decision + ranger action must be logged for FedRAMP compliance

**DATABASE SCHEMA:**
```sql
CREATE TABLE ai_decision_logs (
  id UUID PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES reports(id),
  
  -- AI decision data
  model_version VARCHAR(50) NOT NULL,
  classification VARCHAR(50) NOT NULL,
  confidence DECIMAL(5,4) NOT NULL,
  reasoning_steps JSONB NOT NULL,
  alternatives JSONB,
  tools_invoked TEXT[],
  
  -- Timestamps
  ai_decision_at TIMESTAMP NOT NULL,
  ranger_reviewed_at TIMESTAMP,
  
  -- Ranger action
  ranger_id UUID REFERENCES users(id),
  ranger_action VARCHAR(20), -- 'approve' | 'override' | 'reject'
  final_classification VARCHAR(50),
  ranger_explanation TEXT,
  
  -- Audit metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_report ON ai_decision_logs(report_id);
CREATE INDEX idx_ai_logs_ranger ON ai_decision_logs(ranger_id);
CREATE INDEX idx_ai_logs_timestamp ON ai_decision_logs(ai_decision_at);
```

**API ENDPOINTS:**
```typescript
// GET /api/audit-logs/:report_id
// Returns complete decision trail for a specific report

// GET /api/audit-logs/ranger/:ranger_id
// Returns all decisions reviewed by a specific ranger

// GET /api/audit-logs/overrides
// Returns all cases where ranger overrode AI classification

// GET /api/audit-logs/high-risk
// Returns all high-risk decisions (closures, emergency notices)
```

***

## FEATURE FLAGS FOR GRADUAL ROLLOUT

**IMPLEMENTATION:**
```typescript
enum FeatureFlag {
  AGENTIC_SPATIAL_INSIGHTS = 'agentic_spatial_insights',
  CLUSTER_DETECTION = 'cluster_detection',
  CONSISTENCY_CHECKS = 'consistency_checks',
  DUPLICATE_DETECTION = 'duplicate_detection',
  STRUCTURED_REASONING = 'structured_reasoning'
}

const useFeatureFlag = (flag: FeatureFlag): boolean => {
  const { user } = useAuth();
  const flags = useFeatureFlags(user.id);
  
  return flags[flag] ?? false;
};

// Usage in components
const SpatialInsightsSidebar = () => {
  const clusterDetectionEnabled = useFeatureFlag(FeatureFlag.CLUSTER_DETECTION);
  
  return (
    <div>
      {clusterDetectionEnabled && (
        <ClusterAlertCards />
      )}
      {/* Other insights */}
    </div>
  );
};
```

**ADMIN CONTROL PANEL:**
```tsx
const FeatureFlagAdmin: React.FC = () => {
  return (
    <AdminPanel>
      <Header>Agentic UI Feature Flags</Header>
      
      <FlagControl flag={FeatureFlag.STRUCTURED_REASONING}>
        <Label>Structured AI Reasoning Display</Label>
        <Description>Shows expandable reasoning panels with tool invocation logs</Description>
        <Status>Enabled for all users</Status>
      </FlagControl>
      
      <FlagControl flag={FeatureFlag.DUPLICATE_DETECTION}>
        <Label>Duplicate Report Detection</Label>
        <Description>Surfaces similar reports based on text + image + GPS similarity</Description>
        <Status>Enabled for all users</Status>
      </FlagControl>
      
      <FlagControl flag={FeatureFlag.CLUSTER_DETECTION}>
        <Label>Spatial Cluster Alerts</Label>
        <Description>Proactively suggests combined notices for clustered reports</Description>
        <Status>Beta - Enabled for 20% of rangers</Status>
        <Button onClick={() => enableForAllUsers(FeatureFlag.CLUSTER_DETECTION)}>
          Enable for All
        </Button>
      </FlagControl>
      
      <FlagControl flag={FeatureFlag.CONSISTENCY_CHECKS}>
        <Label>Assignment Consistency Checks</Label>
        <Description>Surfaces potential assignment bias patterns</Description>
        <Status>Alpha - Enabled for pilot group only</Status>
        <Button onClick={() => enableForBeta(FeatureFlag.CONSISTENCY_CHECKS)}>
          Promote to Beta
        </Button>
      </FlagControl>
    </AdminPanel>
  );
};
```

***

## METRICS & SUCCESS CRITERIA

**MEASURE THESE (NOT VANITY METRICS):**

```typescript
interface AgenticUIMetrics {
  // Time savings
  avg_triage_time_seconds: number;
  triage_time_reduction_percent: number;
  
  // Pattern detection value
  clusters_detected: number;
  clusters_accepted_by_ranger: number;
  clusters_dismissed: number;
  
  // Accuracy improvements
  ai_classification_accuracy: number;
  ranger_override_rate: number;
  override_reasons: Record<string, number>;
  
  // Duplicate prevention
  duplicates_detected: number;
  duplicates_confirmed: number;
  duplicate_work_orders_prevented: number;
  
  // User trust indicators
  reasoning_panel_expansion_rate: number;
  feature_disable_rate: number;
  ranger_satisfaction_score: number;
  
  // Safety compliance
  high_risk_decisions_count: number;
  high_risk_decisions_with_justification: number;
  audit_log_completeness: number;
}
```

**DO NOT MEASURE:**
- "Did rangers click the agentic feature?" (They might not; that's OK if it's just not relevant)
- "How many insights were displayed?" (More insights ≠ better)
- "How many AI suggestions were made?" (Volume doesn't matter; value does)

**SUCCESS THRESHOLDS:**
- Triage time reduced by 15%+ (measured ranger-by-ranger)
- Cluster detection accepted by rangers 60%+ of the time
- Duplicate prevention saves 5+ duplicate work orders/week
- Ranger override rate <20% (indicates appropriate AI confidence calibration)
- Feature disable rate <5% (indicates rangers find value, not noise)

***

## ANTI-PATTERNS TO AVOID

### ❌ DON'T: Build a chatbot sidebar
```tsx
// WRONG - Rangers don't want to type questions
<ChatSidebar>
  <Input placeholder="Ask me about trail patterns..." />
</ChatSidebar>
```

### ✅ DO: Build proactive insight cards
```tsx
// CORRECT - AI surfaces insights without being asked
<SpatialInsightsSidebar>
  <ClusterAlertCard cluster={detectedCluster} />
</SpatialInsightsSidebar>
```

***

### ❌ DON'T: Auto-execute decisions
```tsx
// WRONG - Bypasses ranger oversight
if (confidence > 0.95) {
  autoApproveAndRoute(report);
}
```

### ✅ DO: Suggest with explicit approval
```tsx
// CORRECT - Ranger retains control
<Button onClick={() => rangerExplicitlyApproves(report)}>
  Approve AI Classification
</Button>
```

***

### ❌ DON'T: Show verbose AI explanations by default
```tsx
// WRONG - Information overload
<div>
  <p>Based on analysis of 47 similar reports across 12 districts...</p>
  <p>Seasonal patterns indicate...</p>
  <p>Weather data suggests...</p>
</div>
```

### ✅ DO: Show summary + expandable details
```tsx
// CORRECT - Progressive disclosure
<ReasoningSummary>TRACS 245 (Confidence: 0.89)</ReasoningSummary>
<ExpandableDetails>
  <ReasoningStep>Citizen photo shows obstruction...</ReasoningStep>
  <ReasoningStep>GPS validated against trail geometry...</ReasoningStep>
</ExpandableDetails>
```

***

### ❌ DON'T: Use ML jargon in UI
```tsx
// WRONG - Rangers don't care about model internals
<Badge>Gemini 2.0 Flash · Confidence: 0.894 · Loss: 0.023</Badge>
```

### ✅ DO: Use domain-appropriate language
```tsx
// CORRECT - Plain language, actionable
<Badge>High Confidence · TRACS 245 - Obstruction/Tree</Badge>
```

***

## DEVELOPMENT PRIORITIES

### Phase 1 (Weeks 1-2): Core Fixes + Tier 1 Features
1. Fix dual scrollbars + red divider (P0 bug)
2. Implement structured reasoning display (1A)
3. Implement duplicate detection (1C)
4. Add audit logging infrastructure

### Phase 2 (Weeks 3-4): Batch Operations + Safety
1. Build batch assignment interface (1B)
2. Implement high-risk decision guards
3. Add offline-tolerant defaults (1D)
4. Create feature flag system

### Phase 3 (Weeks 5-6): Tier 2 Agentic Features
1. Build spatial cluster detection (2A)
2. Implement assignment consistency checks (2B)
3. Add metrics tracking dashboard

### Phase 4 (Week 7+): Testing + Iteration
1. Beta test with 5-10 rangers
2. Collect feedback on insight card relevance
3. Measure time savings vs. baseline
4. Iterate based on real usage patterns

***

## CONCLUSION

**Remember:**
- Agentic UI is about **attention management**, not information display
- **Transparency builds trust** more than accuracy alone
- **Rangers retain control** at every decision point
- **Graceful degradation** ensures system works even when AI fails
- **Measure value, not usage** - fewer but better insights win

Build Tier 1 first. Measure impact. Only then justify Tier 2 complexity.

***

*End of Implementation Specification*