
import { renderHook, waitFor } from '@testing-library/react';
import { useReports } from './useReports';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useReports', () => {
  it('should return a list of reports', async () => {
    const { result } = renderHook(() => useReports(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(15);
  });

  it('should filter reports by severity', async () => {
    const { result, rerender } = renderHook(({ filters }) => useReports(filters), {
      wrapper: createWrapper(),
      initialProps: { filters: { severity: 'impassable' } },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
  });
});
