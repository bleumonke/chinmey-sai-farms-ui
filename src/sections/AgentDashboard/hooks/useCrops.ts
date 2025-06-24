import { useQuery, useMutation, useQueryClient, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import {
  getCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  getPricingByCropId
} from "../../../api";
import { Crop, Pricing } from "../../../types";

// GET all crops
export const useCrops = () =>
  useQuery<Crop[]>({
    queryKey: ['crops'],
    queryFn: async () => (await getCrops()).data,
  });

// GET a single crop by ID
export const useCrop = (cropId: string) =>
  useQuery<Crop>({
    queryKey: ['crop', cropId],
    queryFn: async () => (await getCrop(cropId)).data,
    enabled: !!cropId,
  });

// POST new crop
export const useCreateCrop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Crop, 'id'>) => (await createCrop(data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crops'] }),
  });
};

// PATCH crop
export const useUpdateCrop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cropId,
      data,
    }: {
      cropId: string;
      data: Partial<Omit<Crop, 'id'>>;
    }) => (await updateCrop(cropId, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crops'] }),
  });
};

// DELETE crop
export const useDeleteCrop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cropId: string) => (await deleteCrop(cropId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crops'] }),
  });
};

type CropPricingOptions = Omit<
  UseQueryOptions<Pricing[], Error, Pricing[], QueryKey>,
  'queryKey' | 'queryFn' | 'enabled'
> & {
  onError?: (error: Error) => void;
};

// GET pricing for a crop
export const useCropPricing = (cropId: string, options?: CropPricingOptions) => {
  return useQuery<Pricing[], Error, Pricing[], QueryKey>({
    queryKey: ['cropPricing', cropId],
    queryFn: async () => (await getPricingByCropId(cropId)).data,
    enabled: !!cropId,
    ...options,
  });
};