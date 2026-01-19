
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type { Crew } from '../types/crew';

export const useCrews = () => {
  return useQuery<Crew[], Error>({
    queryKey: ['crews'],
    queryFn: () => fetchApi<Crew[]>('/api/crews'),
  });
};
