import { useQuery } from '@tanstack/react-query';
import { getCrops as fetchCrops } from '../../../lib/api'; 
import type { Crop } from '../../../types'; 

export function useCrops() {
  const { 
    data: crops = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<Crop[], Error>({
    queryKey: ['crops'], 
    queryFn: async () => {
        const response = await fetchCrops();
        return response.data; 
    }, 
  });

  return { crops, isLoading, isError, error };
} 