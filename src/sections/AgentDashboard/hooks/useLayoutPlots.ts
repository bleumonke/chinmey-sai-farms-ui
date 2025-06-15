import { useQuery } from '@tanstack/react-query';
import { getLayoutPlots as fetchLayoutPlots } from '../../../api';
import type { Plot } from '../../../types';

export function useLayoutPlots(layoutId: string | undefined) {
  const { 
    data: plots = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<Plot[], Error>({
    queryKey: ['layoutPlots', layoutId], 
    queryFn: async () => {
      if (!layoutId) return [];
      const response = await fetchLayoutPlots(layoutId);
      return response.data; 
    }, 
    enabled: !!layoutId, 
  });

  return { plots, isLoading, isError, error };
} 