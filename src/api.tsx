// src/api.tsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://ecs-chinmey-sai-farms-api-1958333646.us-east-1.elb.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Customers
export const getCustomers = () => api.get("/customers");
export const getCustomer = (customerId: string) => api.get(`/customers/${customerId}`);
export const createCustomer = (data: any) => api.post("/customers", data);
export const updateCustomer = (customerId: string, data: any) => api.patch(`/customers/${customerId}`, data);
export const deleteCustomer = (customerId: string) => api.delete(`/customers/${customerId}`);
export const getCustomerPlots = (customerId: string) => api.get(`/customers/${customerId}/plots`);

// Layouts
export const getLayouts = () => api.get("/layouts");
export const getLayoutById = (layoutId: string) => api.get(`/layouts/${layoutId}`);
export const createLayout = (data: any) => api.post("/layouts", data);
export const updateLayout = (layoutId: string, data: any) => api.patch(`/layouts/${layoutId}`, data);
export const deleteLayout = (layoutId: string) => api.delete(`/layouts/${layoutId}`);
export const getLayoutPlots = (layoutId: string) => api.get(`/layouts/${layoutId}/plots`);

// Plots
export const getPlots = () => api.get("/plots");
export const getPlotById = (plotId: string) => api.get(`/plots/${plotId}`);
export const createPlot = (data: any) => api.post("/plots", data);
export const updatePlot = (plotId: string, data: any) => api.patch(`/plots/${plotId}`, data);
export const deletePlot = (plotId: string) => api.delete(`/plots/${plotId}`);
export const getPlotTransactions = (plotId: string) => api.get(`/plots/${plotId}/transactions`);

// Plot History (Transactions)
export const getAllPlotTransactions = () => api.get("/plot-history");
export const getPlotTransactionById = (id: string) => api.get(`/plot-history/${id}`);
export const createPlotTransaction = (data: any) => api.post("/plot-history", data);
export const updatePlotTransaction = (id: string, data: any) => api.patch(`/plot-history/${id}`, data);
export const deletePlotTransaction = (id: string) => api.delete(`/plot-history/${id}`);

// Crops
export const getCrops = () => api.get("/crops/");
export const getCrop = (cropId: string) => api.get(`/crops/${cropId}`);
export const createCrop = (data: any) => api.post("/crops/", data);
export const updateCrop = (cropId: string, data: any) => api.patch(`/crops/${cropId}`, data);
export const deleteCrop = (cropId: string) => api.delete(`/crops/${cropId}`);
export const getPricingByCropId = (cropId: string) => api.get(`/crops/${cropId}/pricing`);

// Pricing
export const getPricing = () => api.get("/pricing");
export const getPricingById = (pricingId: string) => api.get(`/pricing/${pricingId}`);
export const createPricing = (data: any) => api.post("/pricing", data);
export const updatePricing = (pricingId: string, data: any) => api.patch(`/pricing/${pricingId}`, data);
export const deletePricing = (pricingId: string) => api.delete(`/pricing/${pricingId}`);

// Root
export const readRoot = () => api.get("/");

export default api;