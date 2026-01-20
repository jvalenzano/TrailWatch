import { renderHook, waitFor } from '@testing-library/react';
import { useDistricts } from './useDistricts';
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

describe('useDistricts', () => {
    it('should return a list of districts without suggestion when no report IDs', async () => {
        const { result } = renderHook(() => useDistricts(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.districts).toHaveLength(5);
        expect(result.current.data?.suggestion).toBeUndefined();
    });

    it('should return districts with suggestion when report IDs provided', async () => {
        const { result } = renderHook(
            () => useDistricts({ reportIds: ['report-1', 'report-2', 'report-3'] }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.districts).toHaveLength(5);
        expect(result.current.data?.suggestion).toBeDefined();
        expect(result.current.data?.suggestion?.district_id).toBe('district-01');
        expect(result.current.data?.suggestion?.matching_reports).toBeGreaterThan(0);
    });

    it('should not fetch when disabled', async () => {
        const { result } = renderHook(() => useDistricts({ enabled: false }), {
            wrapper: createWrapper(),
        });

        // Query should not be fetching
        expect(result.current.isFetching).toBe(false);
        expect(result.current.data).toBeUndefined();
    });

    it('should have correct district structure', async () => {
        const { result } = renderHook(() => useDistricts(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const firstDistrict = result.current.data?.districts[0];
        expect(firstDistrict).toHaveProperty('id');
        expect(firstDistrict).toHaveProperty('name');
        expect(firstDistrict).toHaveProperty('number');
    });
});
