import { useQuery } from '@tanstack/react-query';
import { getLayouts as fetchLayouts } from '../../../api';  
import type { Layout } from '../../../types';  

export function useLayouts() {
  const { 
    data: layouts = [], 
    isLoading, 
    isError, 
    error,
  } = useQuery<Layout[], Error>({
    queryKey: ['layouts'],
    queryFn: async () => {
      const response = await fetchLayouts();
      return response.data;
    }, 
  });

  return { layouts, isLoading, isError, error };
}