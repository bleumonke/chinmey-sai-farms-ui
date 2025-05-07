import { useQuery } from '@tanstack/react-query';
import { getPricingByCropId as fetchPricing } from '../../../lib/api';
import type { Pricing } from '../../../types';

export function useCropPricing(cropId: string | undefined) { 
  const { 
    data: pricing = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<Pricing[], Error>({
    queryKey: ['cropPricing', cropId], 
    queryFn: async () => {
      if (!cropId) return []; 
      const response = await fetchPricing(cropId);
      return response.data; 
    }, 
    enabled: !!cropId, 
  });

  return { pricing, isLoading, isError, error };
} 