import { useQuery } from '@tanstack/react-query';
import { getCustomers as fetchCustomers } from '../../../lib/api'; // Adjust path as needed
import type { Customer } from '../../../types'; // Adjust path as needed

// Function to fetch data (can be inline or imported)
// const fetchCustomers = async (): Promise<Customer[]> => {
//   const response = await getCustomers();
//   return response.data;
// };

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