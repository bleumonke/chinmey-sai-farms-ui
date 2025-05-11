import { useQuery } from '@tanstack/react-query';
import { getLayouts as fetchLayouts } from '../../../lib/api';  
import type { Layout } from '../../../types';  

export function useLayouts() {
  const { 
    data: layouts = [], // Provide default value
    isLoading, 
    isError, 
    error 
  } = useQuery<Layout[], Error>({
    queryKey: ['layouts'], // Unique key for this query
    queryFn: async () => {
        const response = await fetchLayouts();
        return response.data; // Extract data here
    }, 
    // Optional: Add configuration
    // staleTime: 5 * 60 * 1000, 
  });

  return { layouts, isLoading, isError, error };
} 