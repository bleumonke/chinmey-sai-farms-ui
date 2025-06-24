import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPricing,
  getPricingById,
  createPricing,
  updatePricing,
  deletePricing
} from "../../../api";
import { Pricing } from "../../../types";

// GET all pricing
export const usePricing = () =>
  useQuery<Pricing[]>({
    queryKey: ['pricing'],
    queryFn: async () => (await getPricing()).data,
  });

// GET pricing by ID
export const usePricingById = (pricingId: string) =>
  useQuery<Pricing>({
    queryKey: ['pricing', pricingId],
    queryFn: async () => (await getPricingById(pricingId)).data,
    enabled: !!pricingId,
  });

// POST pricing
export const useCreatePricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Pricing, 'id'>) => (await createPricing(data)).data,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['pricing']}),
  });
};

// PATCH pricing
export const useUpdatePricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pricingId,
      data,
    }: {
      pricingId: string;
      data: Partial<Omit<Pricing, 'id'>>;
    }) => (await updatePricing(pricingId, data)).data,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['pricing']}),
  });
};

// DELETE pricing
export const useDeletePricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pricingId: string) => (await deletePricing(pricingId)).data,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['pricing']}),
  });
};
