/**
 * Sample SAIL Bokaro logistics dataset for prototyping
 * Real-world inspired synthetic data
 */

import {
  Stockyard,
  Order,
  Rake,
  ProductWagonMatrix,
  LoadingPoint,
  RouteCost,
  InputDataset,
} from "@shared/api";

export const sampleStockyards: Stockyard[] = [
  {
    stockyard_id: "BOKARO_SY_1",
    location: "Bokaro, Jharkhand",
    material_id: "HRC",
    available_tonnage: 450.5,
    safety_stock: 50.0,
    loading_point_id: "BOKARO_LP_1",
  },
  {
    stockyard_id: "BOKARO_SY_2",
    location: "Bokaro, Jharkhand",
    material_id: "CRC",
    available_tonnage: 320.0,
    safety_stock: 40.0,
    loading_point_id: "BOKARO_LP_1",
  },
  {
    stockyard_id: "DURGAPUR_SY_1",
    location: "Durgapur, West Bengal",
    material_id: "HRC",
    available_tonnage: 280.5,
    safety_stock: 35.0,
    loading_point_id: "DURGAPUR_LP_1",
  },
];

export const sampleOrders: Order[] = [
  {
    order_id: "ORD_2024_001",
    customer_id: "ABC_PIPES",
    destination: "Delhi",
    material_id: "HRC",
    quantity_tonnes: 28.5,
    priority: 1,
    due_date: "2024-01-17T10:00:00Z",
    penalty_rate_per_day: 500.0,
    preferred_mode: "rail",
    partial_allowed: false,
  },
  {
    order_id: "ORD_2024_002",
    customer_id: "XYZ_AUTO",
    destination: "Ghaziabad",
    material_id: "HRC",
    quantity_tonnes: 45.0,
    priority: 1,
    due_date: "2024-01-17T14:00:00Z",
    penalty_rate_per_day: 600.0,
    preferred_mode: "rail",
    partial_allowed: false,
  },
  {
    order_id: "ORD_2024_003",
    customer_id: "MNO_MILLS",
    destination: "Kanpur",
    material_id: "CRC",
    quantity_tonnes: 35.0,
    priority: 3,
    due_date: "2024-01-18T08:00:00Z",
    penalty_rate_per_day: 300.0,
    preferred_mode: "either",
    partial_allowed: true,
  },
  {
    order_id: "ORD_2024_004",
    customer_id: "PQR_TRADE",
    destination: "Pune",
    material_id: "HRC",
    quantity_tonnes: 15.5,
    priority: 2,
    due_date: "2024-01-19T12:00:00Z",
    penalty_rate_per_day: 400.0,
    preferred_mode: "road",
    partial_allowed: false,
  },
];

export const sampleRakes: Rake[] = [
  {
    rake_id: "RAKE_001",
    wagon_type: "BOXN",
    num_wagons: 34,
    per_wagon_capacity_tonnes: 28.0,
    total_capacity_tonnes: 952.0,
    available_from_time: "2024-01-14T08:00:00Z",
    current_location: "BOKARO",
  },
  {
    rake_id: "RAKE_002",
    wagon_type: "BOXN",
    num_wagons: 34,
    per_wagon_capacity_tonnes: 28.0,
    total_capacity_tonnes: 952.0,
    available_from_time: "2024-01-14T16:00:00Z",
    current_location: "DURGAPUR",
  },
];

export const sampleProductWagonMatrix: ProductWagonMatrix[] = [
  {
    material_id: "HRC",
    wagon_type: "BOXN",
    max_load_per_wagon_tonnes: 26.0,
    allowed: true,
  },
  {
    material_id: "HRC",
    wagon_type: "OPEN",
    max_load_per_wagon_tonnes: 28.0,
    allowed: true,
  },
  {
    material_id: "CRC",
    wagon_type: "BOXN",
    max_load_per_wagon_tonnes: 24.0,
    allowed: true,
  },
  {
    material_id: "CRC",
    wagon_type: "TANK",
    max_load_per_wagon_tonnes: 25.0,
    allowed: false, // Not suitable for CRC
  },
];

export const sampleLoadingPoints: LoadingPoint[] = [
  {
    loading_point_id: "BOKARO_LP_1",
    stockyard_id: "BOKARO_SY_1",
    max_rakes_per_day: 3,
    loading_rate_tonnes_per_hour: 120.0,
    operating_hours_start: 6,
    operating_hours_end: 22,
    siding_capacity_rakes: 5,
  },
  {
    loading_point_id: "DURGAPUR_LP_1",
    stockyard_id: "DURGAPUR_SY_1",
    max_rakes_per_day: 2,
    loading_rate_tonnes_per_hour: 100.0,
    operating_hours_start: 8,
    operating_hours_end: 20,
    siding_capacity_rakes: 4,
  },
];

export const sampleRoutesCosts: RouteCost[] = [
  {
    origin: "BOKARO",
    destination: "DELHI",
    mode: "rail",
    distance_km: 1400.0,
    transit_time_hours: 72.0,
    cost_per_tonne: 350.0,
    idle_freight_cost_per_hour: 25.0,
  },
  {
    origin: "BOKARO",
    destination: "GHAZIABAD",
    mode: "rail",
    distance_km: 1350.0,
    transit_time_hours: 68.0,
    cost_per_tonne: 345.0,
    idle_freight_cost_per_hour: 25.0,
  },
  {
    origin: "BOKARO",
    destination: "KANPUR",
    mode: "rail",
    distance_km: 900.0,
    transit_time_hours: 45.0,
    cost_per_tonne: 280.0,
    idle_freight_cost_per_hour: 20.0,
  },
  {
    origin: "BOKARO",
    destination: "KANPUR",
    mode: "road",
    distance_km: 750.0,
    transit_time_hours: 24.0,
    cost_per_tonne: 280.0,
    idle_freight_cost_per_hour: 20.0,
  },
  {
    origin: "DURGAPUR",
    destination: "KANPUR",
    mode: "rail",
    distance_km: 400.0,
    transit_time_hours: 20.0,
    cost_per_tonne: 180.0,
    idle_freight_cost_per_hour: 15.0,
  },
  {
    origin: "BOKARO",
    destination: "PUNE",
    mode: "road",
    distance_km: 1200.0,
    transit_time_hours: 36.0,
    cost_per_tonne: 400.0,
    idle_freight_cost_per_hour: 25.0,
  },
  {
    origin: "BOKARO",
    destination: "DELHI",
    mode: "road",
    distance_km: 1380.0,
    transit_time_hours: 42.0,
    cost_per_tonne: 380.0,
    idle_freight_cost_per_hour: 28.0,
  },
];

export function getSampleDataset(): InputDataset {
  return {
    stockyards: sampleStockyards,
    orders: sampleOrders,
    rakes: sampleRakes,
    product_wagon_matrix: sampleProductWagonMatrix,
    loading_points: sampleLoadingPoints,
    routes_costs: sampleRoutesCosts,
  };
}
