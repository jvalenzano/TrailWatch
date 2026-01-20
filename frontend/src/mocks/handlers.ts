import { http, HttpResponse } from 'msw';
import reports from './reports.json';
import crews from './crews.json';
import insights from './insights.json';
import districts from './districts.json';
import syntheticData from '../data/synthetic_day_in_life.json';
import type { District, DistrictSuggestion } from '../types/district';
import type {
    CrewContext,
    RouteSummary,
    BatchAssignmentRequest,
    BatchAssignmentResult,
    CrewPerformanceLevel,
} from '../types/assignment';

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
];
