
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type { HazardReport } from '../types/report';

interface ReportFilters {
  severity?: string;
  // Add other filter properties here
}

export const useReports = (filters?: ReportFilters) => {
  return useQuery<HazardReport[], Error>({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const reports = await fetchApi<HazardReport[]>('/api/reports');
      if (filters) {
        return reports.filter(report => {
          if (filters.severity && report.severity_estimate !== filters.severity) {
            return false;
          }
          return true;
        });
      }
      return reports;
    },
  });
};
