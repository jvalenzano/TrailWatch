import { http, HttpResponse } from 'msw';
import reports from './reports.json';
import crews from './crews.json';
import insights from './insights.json';
import syntheticData from '../data/synthetic_day_in_life.json';

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
];
