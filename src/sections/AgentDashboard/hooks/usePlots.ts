import { useQuery, useMutation, useQueryClient, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import {
  getPlots,
  getPlotById,
  createPlot,
  updatePlot,
  deletePlot,
  getPlotTransactions
} from "../../../api";
import { Plot, Transaction } from "../../../types";

// GET all plots
export const usePlots = () =>
  useQuery<Plot[]>({
    queryKey: ['plots'],
    queryFn: async () => (await getPlots()).data,
  });

// GET a single plot by ID
export const usePlot = (plotId: string) =>
  useQuery<Plot>({
    queryKey: ['plot', plotId],
    queryFn: async () => (await getPlotById(plotId)).data,
    enabled: !!plotId,
  });

// POST new plot
export const useCreatePlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Plot, 'id'>) => (await createPlot(data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plots'] }),
  });
};

// PATCH plot
export const useUpdatePlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      plotId,
      data,
    }: {
      plotId: string;
      data: Partial<Omit<Plot, 'id'>>;
    }) => (await updatePlot(plotId, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plots'] }),
  });
};

// DELETE plot
export const useDeletePlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plotId: string) => (await deletePlot(plotId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plots'] }),
  });
};

type PlotTransactionsOptions = Omit<
  UseQueryOptions<Transaction[], Error, Transaction[], QueryKey>,
  'queryKey' | 'queryFn' | 'enabled'
> & {
  onError?: (error: Error) => void;
};

// GET transactions for a plot
export const usePlotTransactions = (plotId: string, options?: PlotTransactionsOptions) => {
  return useQuery<Transaction[], Error, Transaction[], QueryKey>({
    queryKey: ['plotTransactions', plotId],
    queryFn: async () => (await getPlotTransactions(plotId)).data,
    enabled: !!plotId,
    ...options,
  });
};
