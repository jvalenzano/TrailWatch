
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';

export const useExtraction = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (reportId: string) => fetchApi(`/api/reports/${reportId}/extract`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
