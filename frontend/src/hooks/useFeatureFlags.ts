/**
 * useFeatureFlags - Hook for managing feature flags
 *
 * Provides:
 * - Fetching all feature flags
 * - Updating feature flag status
 * - Optimistic updates with cache invalidation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type {
    FeatureFlag,
    FeatureFlagUpdateRequest,
    FeatureFlagUpdateResponse,
} from '../types/featureFlag';

/**
 * Query key for feature flags
 */
const FEATURE_FLAGS_KEY = ['featureFlags'] as const;

/**
 * Fetch all feature flags
 */
async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
    return fetchApi<FeatureFlag[]>('/api/admin/features');
}

/**
 * Update a feature flag status
 */
async function updateFeatureFlag(
    request: FeatureFlagUpdateRequest
): Promise<FeatureFlagUpdateResponse> {
    const response = await fetch(`/api/admin/features/${request.featureId}/action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: request.action }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Failed to update feature flag');
    }

    return response.json();
}

/**
 * Hook for fetching feature flags
 *
 * @returns Query result with feature flags data
 */
export function useFeatureFlags() {
    return useQuery<FeatureFlag[], Error>({
        queryKey: FEATURE_FLAGS_KEY,
        queryFn: fetchFeatureFlags,
    });
}

/**
 * Hook for updating feature flag status
 *
 * @returns Mutation for updating feature flags
 */
export function useFeatureFlagAction() {
    const queryClient = useQueryClient();

    return useMutation<FeatureFlagUpdateResponse, Error, FeatureFlagUpdateRequest>({
        mutationFn: updateFeatureFlag,
        onSuccess: (response) => {
            // Update the cache with the new feature data
            queryClient.setQueryData<FeatureFlag[]>(FEATURE_FLAGS_KEY, (oldData) => {
                if (!oldData) return oldData;

                return oldData.map((feature) =>
                    feature.id === response.feature.id ? response.feature : feature
                );
            });

            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: FEATURE_FLAGS_KEY });
        },
        onError: (error) => {
            console.error('Failed to update feature flag:', error);
        },
    });
}

/**
 * Hook for getting a single feature flag by ID
 *
 * @param featureId - The ID of the feature flag
 * @returns The feature flag or undefined
 */
export function useFeatureFlag(featureId: string) {
    const { data: features, ...rest } = useFeatureFlags();

    const feature = features?.find((f) => f.id === featureId);

    return {
        data: feature,
        ...rest,
    };
}
