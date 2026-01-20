import { http, HttpResponse, delay } from 'msw';
import reports from './reports.json';
import crews from './crews.json';
import insights from './insights.json';
import districts from './districts.json';
import featureFlagsData from './featureFlags.json';
import syncQueueData from './syncQueue.json';
import syntheticData from '../data/synthetic_day_in_life.json';
import type { District, DistrictSuggestion } from '../types/district';
import type {
    CrewContext,
    RouteSummary,
    BatchAssignmentRequest,
    BatchAssignmentResult,
    CrewPerformanceLevel,
} from '../types/assignment';
import type {
    FeatureFlag,
    FeatureFlagUpdateRequest,
    FeatureFlagUpdateResponse,
    FeatureStatus,
    FeatureAction,
} from '../types/featureFlag';
import type {
    SyncQueueItem,
    SyncQueueAddRequest,
    SyncQueueAddResponse,
    SyncQueueResponse,
    SyncExecuteResponse,
    SyncStatus,
} from '../types/sync';

// Mutable copy of feature flags for simulating state changes
let featureFlags: FeatureFlag[] = JSON.parse(JSON.stringify(featureFlagsData));

// Mutable copy of sync queue for simulating state changes
let syncQueue: SyncQueueItem[] = JSON.parse(JSON.stringify(syncQueueData));

// Track last sync timestamp for status endpoint
let lastSyncTimestamp: string | null = null;

// Type for synthetic data structure
interface SyntheticData {
  reports: unknown[];
  insights: unknown[];
  weather_context: unknown;
  metadata: unknown;
}

const typedSyntheticData = syntheticData as SyntheticData;

export const handlers = [
  http.get('/api/test', () => {
    return HttpResponse.json({ success: true });
  }),
  http.get('/api/error', () => {
    return new HttpResponse(JSON.stringify({ message: 'Test error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
  http.get('/api/reports', () => {
    return HttpResponse.json(reports);
  }),
  http.get('/api/crews', () => {
    return HttpResponse.json(crews);
  }),
  http.get('/api/insights', () => {
    return HttpResponse.json(insights);
  }),

  // Agentic UI endpoints - serve synthetic data
  http.get('/api/agentic/reports', () => {
    return HttpResponse.json(typedSyntheticData.reports);
  }),

  http.get('/api/agentic/insights', () => {
    return HttpResponse.json(typedSyntheticData.insights);
  }),

  http.get('/api/patterns/clusters', () => {
    const clusterInsights = typedSyntheticData.insights.filter(
      (insight: unknown) => {
        const i = insight as { type?: string };
        return i.type === 'cluster';
      }
    );
    const clusterReportIds = clusterInsights.flatMap((insight: unknown) => {
      const i = insight as { report_ids?: string[] };
      return i.report_ids ?? [];
    });
    const clusterReports = typedSyntheticData.reports.filter(
      (report: unknown) => {
        const r = report as { id?: string };
        return clusterReportIds.includes(r.id ?? '');
      }
    );
    return HttpResponse.json({
      insights: clusterInsights,
      reports: clusterReports,
    });
  }),

  http.get('/api/patterns/duplicates', () => {
    const duplicateInsights = typedSyntheticData.insights.filter(
      (insight: unknown) => {
        const i = insight as { type?: string };
        return i.type === 'duplicate';
      }
    );
    const duplicateReportIds = duplicateInsights.flatMap((insight: unknown) => {
      const i = insight as { report_ids?: string[] };
      return i.report_ids ?? [];
    });
    const duplicateReports = typedSyntheticData.reports.filter(
      (report: unknown) => {
        const r = report as { id?: string };
        return duplicateReportIds.includes(r.id ?? '');
      }
    );
    return HttpResponse.json({
      insights: duplicateInsights,
      reports: duplicateReports,
    });
  }),

  http.get('/api/weather', () => {
    return HttpResponse.json(typedSyntheticData.weather_context as object);
  }),

  http.get('/api/weather/current', () => {
    return HttpResponse.json(typedSyntheticData.weather_context as object);
  }),

  // Get report by ID (supports both regular and agentic data)
  http.get('/api/agentic/reports/:id', ({ params }) => {
    const { id } = params;
    const report = typedSyntheticData.reports.find((r: unknown) => {
      const rep = r as { id?: string };
      return rep.id === id;
    });
    if (report) {
      return HttpResponse.json(report);
    }
    return new HttpResponse(JSON.stringify({ message: 'Report not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  // Get high-risk reports (safety alerts)
  http.get('/api/patterns/high-risk', () => {
    const highRiskReports = typedSyntheticData.reports.filter(
      (report: unknown) => {
        const r = report as { safety_alert?: boolean };
        return r.safety_alert === true;
      }
    );
    const criticalInsights = typedSyntheticData.insights.filter(
      (insight: unknown) => {
        const i = insight as { type?: string };
        return i.type === 'anomaly';
      }
    );
    return HttpResponse.json({
      reports: highRiskReports,
      insights: criticalInsights,
    });
  }),

  // Get consistency check insights (bias detection)
  http.get('/api/patterns/consistency', () => {
    const consistencyInsights = typedSyntheticData.insights.filter(
      (insight: unknown) => {
        const i = insight as { type?: string };
        return i.type === 'consistency_check';
      }
    );
    return HttpResponse.json({
      insights: consistencyInsights,
    });
  }),

  // ========================================
  // Batch Assignment Endpoints
  // ========================================

  // GET /api/districts - List all districts with optional suggestion
  http.get('/api/districts', ({ request }) => {
    const url = new URL(request.url);
    const reportIdsParam = url.searchParams.get('report_ids');

    const typedDistricts = districts as District[];
    let suggestion: DistrictSuggestion | undefined;

    // If report IDs provided, calculate a suggestion
    if (reportIdsParam) {
      const reportIds = reportIdsParam.split(',');
      // Mock: suggest Mt. Adams district for most reports
      suggestion = {
        district_id: 'district-01',
        reason: 'Most reports are located in this district',
        matching_reports: Math.ceil(reportIds.length * 0.75),
      };
    }

    return HttpResponse.json({
      districts: typedDistricts,
      suggestion,
    });
  }),

  // POST /api/route/optimize - Get optimized route for selected reports
  http.post('/api/route/optimize', async ({ request }) => {
    const body = (await request.json()) as { report_ids?: string[] };
    const reportCount = body.report_ids?.length ?? 0;

    // Mock route calculation based on report count
    const routeSummary: RouteSummary = {
      total_distance_miles: reportCount * 2.5 + 8.3,
      estimated_travel_hours: reportCount * 0.4 + 1.2,
      estimated_work_hours: reportCount * 1.5 + 0.5,
    };

    return HttpResponse.json(routeSummary);
  }),

  // GET /api/crews/:id/context - Get extended crew context
  http.get('/api/crews/:id/context', ({ params }) => {
    const { id } = params;
    const crew = (crews as Array<{ id: string; name: string; status: string }>).find(
      (c) => c.id === id
    );

    if (!crew) {
      return new HttpResponse(JSON.stringify({ message: 'Crew not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mock performance calculation
    const performanceMap: Record<string, CrewPerformanceLevel> = {
      'crew-alpha': 'excellent',
      'crew-bravo': 'good',
      'crew-charlie': 'fair',
      'crew-delta': 'good',
      'crew-echo': 'excellent',
    };

    const capacityMap: Record<string, number> = {
      'crew-alpha': 15,
      'crew-bravo': 45,
      'crew-charlie': 80,
      'crew-delta': 65,
      'crew-echo': 25,
    };

    const lastAssignmentMap: Record<string, string | null> = {
      'crew-alpha': '2026-01-15T14:30:00Z',
      'crew-bravo': '2026-01-12T09:00:00Z',
      'crew-charlie': null,
      'crew-delta': '2026-01-18T11:45:00Z',
      'crew-echo': '2026-01-10T16:00:00Z',
    };

    const crewContext: CrewContext = {
      crew_id: crew.id,
      crew_name: crew.name,
      performance: performanceMap[crew.id] ?? 'good',
      capacity_percent: capacityMap[crew.id] ?? 50,
      last_assignment_date: lastAssignmentMap[crew.id] ?? null,
    };

    return HttpResponse.json(crewContext);
  }),

  // POST /api/assignments/batch - Create batch assignment
  http.post('/api/assignments/batch', async ({ request }) => {
    const body = (await request.json()) as BatchAssignmentRequest;

    // Validate request
    if (!body.report_ids || body.report_ids.length === 0) {
      return new HttpResponse(
        JSON.stringify({ message: 'No reports specified' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.district_id || !body.crew_id) {
      return new HttpResponse(
        JSON.stringify({ message: 'District and crew are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Mock successful assignment
    const result: BatchAssignmentResult = {
      success: true,
      assigned_count: body.report_ids.length,
      assignment_id: `batch-${Date.now()}`,
    };

    return HttpResponse.json(result);
  }),

  // ========================================
  // Feature Flag Admin Endpoints (WF10)
  // ========================================

  // GET /api/admin/features - List all feature flags
  http.get('/api/admin/features', () => {
    return HttpResponse.json(featureFlags);
  }),

  // GET /api/admin/features/:id - Get single feature flag
  http.get('/api/admin/features/:id', ({ params }) => {
    const { id } = params;
    const feature = featureFlags.find((f) => f.id === id);

    if (!feature) {
      return new HttpResponse(
        JSON.stringify({ message: 'Feature not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return HttpResponse.json(feature);
  }),

  // POST /api/admin/features/:id/action - Update feature flag status
  http.post('/api/admin/features/:id/action', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { action: FeatureAction };

    const featureIndex = featureFlags.findIndex((f) => f.id === id);
    if (featureIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Feature not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const feature = featureFlags[featureIndex];

    // Calculate new status based on action
    const actionToStatus: Record<FeatureAction, FeatureStatus> = {
      enable_globally: 'enabled',
      disable_globally: 'disabled',
      enable_for_all: 'enabled',
      disable: 'disabled',
      promote_to_beta: 'beta',
      promote_to_enabled: 'enabled',
      demote_to_alpha: 'alpha',
      demote_to_disabled: 'disabled',
    };

    // Calculate new available actions based on new status
    const statusToActions: Record<FeatureStatus, FeatureAction[]> = {
      enabled: ['disable_globally'],
      beta: ['enable_for_all', 'disable'],
      alpha: ['promote_to_beta'],
      disabled: ['enable_globally'],
    };

    const newStatus = actionToStatus[body.action];
    const newActions = statusToActions[newStatus];

    // Update the feature flag
    const updatedFeature: FeatureFlag = {
      ...feature,
      status: newStatus,
      availableActions: newActions,
      updatedAt: new Date().toISOString(),
    };

    featureFlags[featureIndex] = updatedFeature;

    const response: FeatureFlagUpdateResponse = {
      success: true,
      feature: updatedFeature,
      message: `Feature "${feature.name}" status changed to ${newStatus}`,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/admin/features/reset - Reset feature flags to initial state (for testing)
  http.post('/api/admin/features/reset', () => {
    featureFlags = JSON.parse(JSON.stringify(featureFlagsData));
    return HttpResponse.json({ success: true, message: 'Feature flags reset to initial state' });
  }),

  // ========================================
  // Offline Sync Queue Endpoints (WF9)
  // ========================================

  // GET /api/sync/queue - Get pending sync items
  http.get('/api/sync/queue', async () => {
    // Simulate realistic network delay (50-100ms)
    await delay(75);

    const response: SyncQueueResponse = {
      items: syncQueue,
      count: syncQueue.length,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/sync/queue - Add item to sync queue
  http.post('/api/sync/queue', async ({ request }) => {
    // Simulate realistic network delay (50-100ms)
    await delay(60);

    const body = (await request.json()) as SyncQueueAddRequest;

    // Validate request
    if (!body.type) {
      return new HttpResponse(
        JSON.stringify({ message: 'Type is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.data || Object.keys(body.data).length === 0) {
      return new HttpResponse(
        JSON.stringify({ message: 'Data is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create new sync queue item
    const newItem: SyncQueueItem = {
      id: `sync-${Date.now()}`,
      type: body.type,
      data: body.data,
      timestamp: body.timestamp || new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };

    syncQueue.push(newItem);

    const response: SyncQueueAddResponse = {
      id: newItem.id,
      status: 'pending',
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  // POST /api/sync/execute - Execute sync (when back online)
  http.post('/api/sync/execute', async () => {
    // Simulate realistic sync delay (100ms)
    await delay(100);

    // Simulate sync execution
    const pendingItems = syncQueue.filter((item) => item.status === 'pending');
    const failedItems = syncQueue.filter((item) => item.status === 'failed');

    // Mock: successfully sync all pending items, keep failed items as failed
    let syncedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process pending items (simulate 90% success rate)
    for (const item of pendingItems) {
      if (Math.random() > 0.1) {
        // Success - remove from queue
        syncedCount++;
      } else {
        // Failure - mark as failed
        item.status = 'failed';
        item.retryCount++;
        item.lastError = 'Server error: Unable to process request';
        failedCount++;
        errors.push(`Failed to sync ${item.type} (${item.id}): Server error`);
      }
    }

    // Failed items remain failed (need manual retry or intervention)
    for (const item of failedItems) {
      if (item.retryCount < 3 && Math.random() > 0.5) {
        // Retry succeeded
        syncedCount++;
      } else {
        // Still failing
        failedCount++;
        errors.push(`Failed to sync ${item.type} (${item.id}): ${item.lastError || 'Unknown error'}`);
      }
    }

    // Remove successfully synced items from queue
    syncQueue = syncQueue.filter(
      (item) => item.status === 'failed' || item.status === 'syncing'
    );

    // Update last sync timestamp
    lastSyncTimestamp = new Date().toISOString();

    const response: SyncExecuteResponse = {
      synced: syncedCount,
      failed: failedCount,
      errors,
    };

    return HttpResponse.json(response);
  }),

  // GET /api/sync/status - Get sync status
  http.get('/api/sync/status', async () => {
    // Simulate realistic network delay (50-100ms)
    await delay(50);

    const pendingCount = syncQueue.filter(
      (item) => item.status === 'pending' || item.status === 'failed'
    ).length;

    const response: SyncStatus = {
      isOnline: true, // Mock server always reports online
      pendingCount,
      lastSync: lastSyncTimestamp,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/sync/reset - Reset sync queue to initial state (for testing)
  http.post('/api/sync/reset', () => {
    syncQueue = JSON.parse(JSON.stringify(syncQueueData));
    lastSyncTimestamp = null;
    return HttpResponse.json({ success: true, message: 'Sync queue reset to initial state' });
  }),
];
