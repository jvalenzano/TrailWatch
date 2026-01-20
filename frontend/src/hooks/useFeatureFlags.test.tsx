import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFeatureFlags, useFeatureFlagAction } from './useFeatureFlags';
import type { ReactNode } from 'react';

// Create a wrapper with fresh QueryClient for each test
function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
}

describe('useFeatureFlags', () => {
    beforeEach(async () => {
        // Reset feature flags to initial state before each test
        await fetch('/api/admin/features/reset', { method: 'POST' });
    });

    describe('fetching feature flags', () => {
        it('should fetch feature flags successfully', async () => {
            const { result } = renderHook(() => useFeatureFlags(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBeDefined();
            expect(result.current.data?.length).toBeGreaterThan(0);
        });

        it('should return feature flags with correct structure', async () => {
            const { result } = renderHook(() => useFeatureFlags(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const feature = result.current.data?.[0];
            expect(feature).toHaveProperty('id');
            expect(feature).toHaveProperty('name');
            expect(feature).toHaveProperty('status');
            expect(feature).toHaveProperty('metric');
            expect(feature).toHaveProperty('availableActions');
        });

        it('should include all expected feature flags', async () => {
            const { result } = renderHook(() => useFeatureFlags(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const featureIds = result.current.data?.map((f) => f.id);
            expect(featureIds).toContain('structured-ai-reasoning');
            expect(featureIds).toContain('spatial-cluster-alerts');
            expect(featureIds).toContain('assignment-consistency');
        });

        it('should have correct status for each feature', async () => {
            const { result } = renderHook(() => useFeatureFlags(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const reasoning = result.current.data?.find(
                (f) => f.id === 'structured-ai-reasoning'
            );
            expect(reasoning?.status).toBe('enabled');

            const clusters = result.current.data?.find(
                (f) => f.id === 'spatial-cluster-alerts'
            );
            expect(clusters?.status).toBe('beta');

            const consistency = result.current.data?.find(
                (f) => f.id === 'assignment-consistency'
            );
            expect(consistency?.status).toBe('alpha');
        });
    });

    describe('loading states', () => {
        it('should start in loading state', () => {
            const { result } = renderHook(() => useFeatureFlags(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
        });

        it('should not be in error state on success', async () => {
            const { result } = renderHook(() => useFeatureFlags(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });
});

describe('useFeatureFlagAction', () => {
    beforeEach(async () => {
        // Reset feature flags to initial state before each test
        await fetch('/api/admin/features/reset', { method: 'POST' });
    });

    it('should update feature flag status successfully', async () => {
        const wrapper = createWrapper();
        const { result: flagsResult } = renderHook(() => useFeatureFlags(), { wrapper });
        const { result: actionResult } = renderHook(() => useFeatureFlagAction(), { wrapper });

        await waitFor(() => {
            expect(flagsResult.current.isLoading).toBe(false);
        });

        // Alpha feature should have "promote_to_beta" action
        const alphaFeature = flagsResult.current.data?.find(
            (f) => f.id === 'assignment-consistency'
        );
        expect(alphaFeature?.status).toBe('alpha');

        // Perform action
        await act(async () => {
            await actionResult.current.mutateAsync({
                featureId: 'assignment-consistency',
                action: 'promote_to_beta',
            });
        });

        // Wait for cache to update
        await waitFor(() => {
            const updatedFeature = flagsResult.current.data?.find(
                (f) => f.id === 'assignment-consistency'
            );
            expect(updatedFeature?.status).toBe('beta');
        });
    });

    it('should update available actions after status change', async () => {
        const wrapper = createWrapper();
        const { result: flagsResult } = renderHook(() => useFeatureFlags(), { wrapper });
        const { result: actionResult } = renderHook(() => useFeatureFlagAction(), { wrapper });

        await waitFor(() => {
            expect(flagsResult.current.isLoading).toBe(false);
        });

        // Perform action to promote to beta
        let response;
        await act(async () => {
            response = await actionResult.current.mutateAsync({
                featureId: 'assignment-consistency',
                action: 'promote_to_beta',
            });
        });

        // The response should contain the updated feature with new actions
        expect(response?.feature.availableActions).toContain('enable_for_all');
        expect(response?.feature.availableActions).toContain('disable');
    });

    it('should start in non-pending state', async () => {
        const wrapper = createWrapper();
        const { result: actionResult } = renderHook(() => useFeatureFlagAction(), { wrapper });

        // Initially should not be pending
        expect(actionResult.current.isPending).toBe(false);
    });

    it('should complete mutation successfully', async () => {
        const wrapper = createWrapper();
        const { result: actionResult } = renderHook(() => useFeatureFlagAction(), { wrapper });

        await act(async () => {
            await actionResult.current.mutateAsync({
                featureId: 'assignment-consistency',
                action: 'promote_to_beta',
            });
        });

        // After completion, should not be pending
        expect(actionResult.current.isPending).toBe(false);
        expect(actionResult.current.isSuccess).toBe(true);
    });

    it('should return updated feature in mutation result', async () => {
        const wrapper = createWrapper();
        const { result: actionResult } = renderHook(() => useFeatureFlagAction(), { wrapper });

        let response;
        await act(async () => {
            response = await actionResult.current.mutateAsync({
                featureId: 'assignment-consistency',
                action: 'promote_to_beta',
            });
        });

        expect(response?.success).toBe(true);
        expect(response?.feature.status).toBe('beta');
    });
});
