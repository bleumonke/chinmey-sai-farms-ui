export interface Customer {
  icon:string;
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface Layout {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  area_in_acres: number;
  description?: string | null;
  center_coordinates?: { lat: number; long: number } | null;
  perimeter_coordinates?: { [key: string]: { lat: number; lng: number } } | null;
  number_of_plots?: number;
}

export interface Plot {
  id: string;
  layout_id: string;
  customer_id?: string | null;
  crop_id?: string | null;
  number: string;
  name: string;
  area_in_acres: number;
  is_active: boolean;
  is_sold: boolean;
  description?: string | null;
  center_coordinates?: { lat: number; long: number } | null;
  perimeter_coordinates?: { [key: string]: { lat: number; lng: number } } | null;
}

export interface Pricing {
  id: string;
  crop_id:string;
  name: string;
  payment_mode: string;
  status: string;
  extent_unit: string;
  extent_min_value: number;
  extent_max_value: number;
  cost_per_acre: number;
  cost_per_cent: number;
  cost_per_sqft:number;
  total_cost_per_acre: number;
  valid_from: string;
  valid_to: string;
  description?: string;
}

export interface Crop {
  id: string;
  name: string;
}


export interface LayoutPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  area_in_acres: number;
  description?: string | null;
  center_coordinates: { lat: number; long: number };
  perimeter_coordinates: { [key: string]: { lat: number; lng: number } };
}

export interface PlotPayload {
  layout_id: string;
  customer_id?: string | null;
  number: string;
  name: string;
  area_in_acres: number;
  is_active: boolean;
  is_sold: boolean;
  description?: string | null;
  center_coordinates?: { lat: number; long: number } | null;
  perimeter_coordinates?: { [key: string]: { lat: number; lng: number } } | null;
}

export type Transaction = {
  id: string;
  plotId: string;
  amount: number;
  date: string;
  // add other fields
};