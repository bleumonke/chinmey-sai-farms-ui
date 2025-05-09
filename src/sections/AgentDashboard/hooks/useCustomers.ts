import { useQuery } from '@tanstack/react-query';
import { getCustomers as fetchCustomers } from '../../../lib/api';  
import type { Customer } from '../../../types';  
 

export function useCustomers() {
  const { 
    data: customers = [], // Provide default value
    isLoading, 
    isError, 
    error 
  } = useQuery<Customer[], Error>({
    queryKey: ['customers'], // Unique key for this query
    queryFn: async () => {
        const response = await fetchCustomers();
        return response.data; // Extract data here
    }, 
    // Optional: Add configuration like staleTime, cacheTime, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { customers, isLoading, isError, error };
} 