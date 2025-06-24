import { useQuery, useMutation, useQueryClient, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import {
  getLayouts,
  getLayoutById,
  createLayout,
  updateLayout,
  deleteLayout,
  getLayoutPlots
} from "../../../api";
import { Layout, Plot } from "../../../types";

// GET all layouts
export const useLayouts = () =>
  useQuery<Layout[]>({
    queryKey: ['layouts'],
    queryFn: async () => (await getLayouts()).data,
  });

// GET a single layout by ID
export const useLayout = (layoutId: string) =>
  useQuery<Layout>({
    queryKey: ['layout', layoutId],
    queryFn: async () => (await getLayoutById(layoutId)).data,
    enabled: !!layoutId,
  });

// POST new layout
export const useCreateLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Layout, 'id'>) => (await createLayout(data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['layouts'] }),
  });
};

// PATCH layout
export const useUpdateLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      layoutId,
      data,
    }: {
      layoutId: string;
      data: Partial<Omit<Layout, 'id'>>;
    }) => (await updateLayout(layoutId, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['layouts'] }),
  });
};

// DELETE layout
export const useDeleteLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (layoutId: string) => (await deleteLayout(layoutId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['layouts'] }),
  });
};

type LayoutPlotsOptions = Omit<
  UseQueryOptions<Plot[], Error, Plot[], QueryKey>,
  'queryKey' | 'queryFn' | 'enabled'
> & {
  onError?: (error: Error) => void;
};

// GET plots for a layout
export const useLayoutPlots = (layoutId: string, options?: LayoutPlotsOptions) => {
  return useQuery<Plot[], Error, Plot[], QueryKey>({
    queryKey: ['layoutPlots', layoutId],
    queryFn: async () => (await getLayoutPlots(layoutId)).data,
    enabled: !!layoutId,
    ...options,
  });
};
