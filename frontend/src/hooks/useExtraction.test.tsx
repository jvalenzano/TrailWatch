
import { renderHook, waitFor } from '@testing-library/react';
import { useExtraction } from './useExtraction';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useExtraction', () => {
  it('should trigger extraction successfully', async () => {
    server.use(
      http.post('/api/reports/:id/extract', () => {
        return HttpResponse.json({ success: true });
      })
    );

    const { result } = renderHook(() => useExtraction(), { wrapper: createWrapper() });

    result.current.mutate('test-id');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ success: true });
  });
});
