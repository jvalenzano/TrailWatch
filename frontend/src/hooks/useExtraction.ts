import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type { TriageResult } from '../types/report';

interface ExtractionResponse {
  success: boolean;
  triage_result: TriageResult;
}

export const useExtraction = () => {
  const queryClient = useQueryClient();

  return useMutation<ExtractionResponse, Error, string>({
    mutationFn: (reportId: string) => fetchApi<ExtractionResponse>(`/api/reports/${reportId}/extract`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
