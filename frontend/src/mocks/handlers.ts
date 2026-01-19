import { http, HttpResponse } from 'msw';
import reports from './reports.json';
import crews from './crews.json';
import insights from './insights.json';

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
];
