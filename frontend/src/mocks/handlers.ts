import { http, HttpResponse } from 'msw';

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
];
