import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type { SpatialInsight } from '../types/spatial';

interface SpatialInsightsFilters {
    severity?: 'low' | 'medium' | 'high';
    type?: 'cluster' | 'hotspot' | 'trend' | 'anomaly';
}

export const useSpatialInsights = (filters?: SpatialInsightsFilters) => {
    return useQuery<SpatialInsight[], Error>({
        queryKey: ['insights', filters],
        queryFn: async () => {
            const insights = await fetchApi<SpatialInsight[]>('/api/insights');
            if (filters) {
                return insights.filter(insight => {
                    if (filters.severity && insight.severity !== filters.severity) {
                        return false;
                    }
                    if (filters.type && insight.type !== filters.type) {
                        return false;
                    }
                    return true;
                });
            }
            return insights;
        },
    });
};
