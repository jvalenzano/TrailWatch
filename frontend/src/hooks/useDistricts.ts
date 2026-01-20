/**
 * useDistricts hook - Fetches districts with optional AI suggestion
 *
 * When report IDs are provided, the API returns a suggested district
 * based on report locations.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type { DistrictsResponse } from '../types/district';

interface UseDistrictsOptions {
    /** Report IDs to get district suggestion for */
    reportIds?: string[];
    /** Whether to enable the query */
    enabled?: boolean;
}

/**
 * Hook to fetch districts with optional suggestion
 *
 * @param options - Query options including report IDs for suggestion
 * @returns Query result with districts and optional suggestion
 */
export const useDistricts = (options: UseDistrictsOptions = {}) => {
    const { reportIds = [], enabled = true } = options;

    const queryParams = reportIds.length > 0
        ? `?report_ids=${reportIds.join(',')}`
        : '';

    return useQuery<DistrictsResponse, Error>({
        queryKey: ['districts', reportIds],
        queryFn: () => fetchApi<DistrictsResponse>(`/api/districts${queryParams}`),
        enabled,
    });
};
