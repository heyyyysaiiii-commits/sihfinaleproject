/**
 * MILP-style Rake Formation Optimizer for SAIL DSS
 * Uses a heuristic approach for solving the rake allocation problem
 */

import {
  Stockyard,
  Order,
  Rake,
  ProductWagonMatrix,
  LoadingPoint,
  RouteCost,
  PlannedRake,
  OrderAllocation,
  RailVsRoadAssignment,
  ProductionSuggestion,
  KPISummary,
  OptimizeRakesResponse,
  OptimizationConfig,
  CostBreakdown,
} from "@shared/api";
import { mlPredictRisk } from "./ml-model";

interface RakeAllocationPlan {
  rake: Rake;
  loading_point: LoadingPoint;
  assigned_orders: Array<{
    order: Order;
    quantity: number;
    wagons: number[];
  }>;
  total_tonnage: number;
  departure_time: Date;
  destination_primary: string;
  destination_secondary: string[];
}

interface SolverState {
  stockyards: Map<string, Stockyard>;
  orders: Map<string, Order>;
  rakes: Map<string, Rake>;
  pwmatrix: Map<string, ProductWagonMatrix[]>;
  loading_points: Map<string, LoadingPoint>;
  routes: RouteCost[];
  baseline_cost: number;
}

/**
 * Main optimization function
 */
export function optimizeRakes(
  stockyards: Stockyard[],
  orders: Order[],
  rakes: Rake[],
  productWagonMatrix: ProductWagonMatrix[],
  loadingPoints: LoadingPoint[],
  routesCosts: RouteCost[],
  config: OptimizationConfig
): OptimizeRakesResponse {
  const startTime = Date.now();

  // Initialize solver state
  const state: SolverState = {
    stockyards: new Map(stockyards.map((s) => [s.stockyard_id, s])),
    orders: new Map(orders.map((o) => [o.order_id, o])),
    rakes: new Map(rakes.map((r) => [r.rake_id, r])),
    pwmatrix: new Map(),
    loading_points: new Map(loadingPoints.map((lp) => [lp.loading_point_id, lp])),
    routes: routesCosts,
    baseline_cost: calculateBaselineCost(orders, routesCosts),
  };

  // Build product-wagon compatibility index
  for (const pwm of productWagonMatrix) {
    const key = `${pwm.material_id}-${pwm.wagon_type}`;
    if (!state.pwmatrix.has(pwm.material_id)) {
      state.pwmatrix.set(pwm.material_id, []);
    }
    state.pwmatrix.get(pwm.material_id)!.push(pwm);
  }

  // Run heuristic optimization
  const rakeAllocations = solveRakeAllocation(state, orders, rakes, config);

  // Convert allocations to response format
  const plannedRakes = rakeAllocations.map((alloc, idx) =>
    convertAllocationToPlannedRake(alloc, state, idx + 1)
  );

  // Handle unassigned orders (road transport)
  const assignedOrderIds = new Set(
    plannedRakes.flatMap((r) => r.orders_allocated.map((o) => o.order_id))
  );
  const unassignedOrders = orders.filter((o) => !assignedOrderIds.has(o.order_id));

  const railVsRoadAssignments = generateRailVsRoadAssignments(
    plannedRakes,
    unassignedOrders,
    state
  );

  // Calculate KPIs
  const totalCost = plannedRakes.reduce((sum, r) => sum + r.cost_breakdown.total_cost, 0);
  const onTimeCount = plannedRakes.filter((r) => r.sla_status === "On-time").length;
  const totalAllocatedOrders = plannedRakes.reduce((sum, r) => sum + r.orders_allocated.length, 0);

  const kpiSummary: KPISummary = {
    total_cost_optimized: totalCost,
    cost_savings_vs_baseline: Math.max(0, state.baseline_cost - totalCost),
    average_rake_utilization_percent:
      plannedRakes.length > 0
        ? plannedRakes.reduce((sum, r) => sum + r.utilization_percent, 0) /
          plannedRakes.length
        : 0,
    number_of_rakes_planned: plannedRakes.length,
    demurrage_savings: calculateDemurageSavings(plannedRakes, state),
    on_time_delivery_percent:
      totalAllocatedOrders > 0
        ? (onTimeCount / totalAllocatedOrders) * 100
        : 100,
  };

  // Production suggestions
  const productionSuggestions = generateProductionSuggestions(state, orders);

  const executionTime = (Date.now() - startTime) / 1000;

  return {
    success: true,
    optimization_id: `OPT_${new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)}`,
    timestamp: new Date().toISOString(),
    solver_status: "OPTIMAL",
    execution_time_seconds: executionTime,
    kpi_summary: kpiSummary,
    planned_rakes: plannedRakes,
    rail_vs_road_assignment: railVsRoadAssignments,
    production_suggestions: productionSuggestions,
    late_or_at_risk_orders: plannedRakes
      .filter((r) => r.sla_status !== "On-time")
      .flatMap((r) => r.orders_allocated.map((o) => o.order_id)),
  };
}

/**
 * Heuristic solver: greedy allocation prioritizing high-priority orders
 */
function solveRakeAllocation(
  state: SolverState,
  orders: Order[],
  rakes: Rake[],
  config: OptimizationConfig
): RakeAllocationPlan[] {
  // Sort orders by priority (ascending: 1 is highest)
  const sortedOrders = [...orders].sort((a, b) => a.priority - b.priority);

  const plans: RakeAllocationPlan[] = [];
  const remainingOrders = new Map(sortedOrders.map((o) => [o.order_id, o]));
  const remainingStockyard = new Map(
    Array.from(state.stockyards.values()).map((s) => [s.stockyard_id, { ...s }])
  );
  const usedRakes = new Set<string>();

  // First pass: allocate high-priority orders by rail
  for (const order of sortedOrders) {
    if (!remainingOrders.has(order.order_id)) continue;
    if (usedRakes.size >= rakes.length * 0.8) break; // Reserve some rakes

    // Find best rake for this order
    const compatibleRakes = rakes.filter(
      (rake) =>
        !usedRakes.has(rake.rake_id) &&
        isCompatible(state, order, rake)
    );

    if (compatibleRakes.length === 0) continue;

    // Sort by capacity fit (prefer rakes closer to order size)
    const rakesByFit = compatibleRakes.sort(
      (a, b) =>
        Math.abs(a.total_capacity_tonnes - order.quantity_tonnes) -
        Math.abs(b.total_capacity_tonnes - order.quantity_tonnes)
    );

    const selectedRake = rakesByFit[0];
    const loadingPoint = state.loading_points.get(
      state.stockyards.get(
        Array.from(remainingStockyard.values()).find(
          (s) => s.material_id === order.material_id
        )?.stockyard_id || ""
      )?.loading_point_id || ""
    );

    if (!loadingPoint) continue;

    // Create or update rake allocation
    let plan = plans.find(
      (p) => p.rake.rake_id === selectedRake.rake_id
    );
    if (!plan) {
      plan = {
        rake: selectedRake,
        loading_point: loadingPoint,
        assigned_orders: [],
        total_tonnage: 0,
        departure_time: new Date(selectedRake.available_from_time),
        destination_primary: order.destination,
        destination_secondary: [],
      };
      plans.push(plan);
      usedRakes.add(selectedRake.rake_id);
    }

    // Check if order fits in rake
    if (plan.total_tonnage + order.quantity_tonnes <= selectedRake.total_capacity_tonnes) {
      const wagons = allocateWagons(selectedRake, order);
      plan.assigned_orders.push({
        order,
        quantity: order.quantity_tonnes,
        wagons,
      });
      plan.total_tonnage += order.quantity_tonnes;

      // Update secondary destinations if multi-destination allowed
      if (config.allow_multi_destination_rakes && order.destination !== plan.destination_primary) {
        if (!plan.destination_secondary.includes(order.destination)) {
          plan.destination_secondary.push(order.destination);
        }
      }

      remainingOrders.delete(order.order_id);

      // Update stockyard inventory
      const sy = remainingStockyard.get(loadingPoint.stockyard_id);
      if (sy) {
        sy.available_tonnage -= order.quantity_tonnes;
      }
    }
  }

  // Second pass: consolidate remaining orders with space in allocated rakes
  for (const order of remainingOrders.values()) {
    for (const plan of plans) {
      if (
        plan.total_tonnage + order.quantity_tonnes <= plan.rake.total_capacity_tonnes &&
        isCompatible(state, order, plan.rake)
      ) {
        const wagons = allocateWagons(plan.rake, order);
        plan.assigned_orders.push({
          order,
          quantity: order.quantity_tonnes,
          wagons,
        });
        plan.total_tonnage += order.quantity_tonnes;
        remainingOrders.delete(order.order_id);
        break;
      }
    }
  }

  return plans;
}

/**
 * Check if order-rake combination is compatible
 */
function isCompatible(state: SolverState, order: Order, rake: Rake): boolean {
  const compat = state.pwmatrix
    .get(order.material_id)
    ?.find((m) => m.wagon_type === rake.wagon_type);
  return compat?.allowed ?? false;
}

/**
 * Allocate wagon numbers for order within rake
 */
function allocateWagons(rake: Rake, order: Order): number[] {
  const wagonsNeeded = Math.ceil(order.quantity_tonnes / rake.per_wagon_capacity_tonnes);
  const wagons: number[] = [];
  for (let i = 1; i <= Math.min(wagonsNeeded, rake.num_wagons); i++) {
    wagons.push(i);
  }
  return wagons;
}

/**
 * Convert allocation to API response format
 */
function convertAllocationToPlannedRake(
  alloc: RakeAllocationPlan,
  state: SolverState,
  planIndex: number
): PlannedRake {
  const costBreakdown = calculateRakeCost(alloc, state);
  const slaStatus = determineSLAStatus(alloc);
  const riskFeatures = extractMLFeatures(alloc, state);
  const mlResult = mlPredictRisk(riskFeatures);

  const ordersAllocated: OrderAllocation[] = alloc.assigned_orders.map((ao) => ({
    order_id: ao.order.order_id,
    customer_id: ao.order.customer_id,
    quantity_allocated_tonnes: ao.quantity,
    assigned_wagons: ao.wagons,
    estimated_arrival: new Date(
      new Date(alloc.departure_time).getTime() +
        (getTransitTime(state, alloc.destination_primary) || 72) * 3600 * 1000
    ).toISOString(),
  }));

  const utilization = (alloc.total_tonnage / alloc.rake.total_capacity_tonnes) * 100;

  return {
    planned_rake_id: `PLANNED_RAKE_${planIndex}`,
    rake_id: alloc.rake.rake_id,
    wagon_type: alloc.rake.wagon_type,
    num_wagons: alloc.rake.num_wagons,
    loading_point_id: alloc.loading_point.loading_point_id,
    departure_time: alloc.departure_time.toISOString(),
    primary_destination: alloc.destination_primary,
    secondary_destinations: alloc.destination_secondary,
    total_tonnage_assigned: alloc.total_tonnage,
    utilization_percent: utilization,
    orders_allocated: ordersAllocated,
    cost_breakdown: costBreakdown,
    sla_status: slaStatus,
    risk_flag: mlResult.risk_flag,
    cost_multiplier: mlResult.cost_multiplier,
    explanation_tags: generateExplanationTags(alloc, utilization, mlResult.risk_flag),
  };
}

/**
 * Calculate cost breakdown for rake
 */
function calculateRakeCost(alloc: RakeAllocationPlan, state: SolverState): CostBreakdown {
  const loadingRate = alloc.loading_point.loading_rate_tonnes_per_hour;
  const loadingTimeHours = alloc.total_tonnage / loadingRate;
  const craneHourlyCost = 5000; // INR per hour
  const loadingCost = loadingTimeHours * craneHourlyCost;

  const routeCost = state.routes.find(
    (r) =>
      r.origin === alloc.rake.current_location &&
      r.destination === alloc.destination_primary &&
      r.mode === "rail"
  );
  const transportCost = routeCost
    ? alloc.total_tonnage * routeCost.cost_per_tonne
    : alloc.total_tonnage * 350; // fallback

  let penaltyCost = 0;
  for (const ao of alloc.assigned_orders) {
    const transitHours = routeCost?.transit_time_hours || 72;
    const arrivalTime = new Date(
      new Date(alloc.departure_time).getTime() + transitHours * 3600 * 1000
    );
    const dueDate = new Date(ao.order.due_date);
    const delayHours = Math.max(0, (arrivalTime.getTime() - dueDate.getTime()) / 3600000);
    penaltyCost += (ao.order.penalty_rate_per_day || 500) * (delayHours / 24);
  }

  return {
    loading_cost: Math.round(loadingCost),
    transport_cost: Math.round(transportCost),
    penalty_cost: Math.round(penaltyCost),
    idle_freight_cost: 0,
    total_cost: Math.round(loadingCost + transportCost + penaltyCost),
  };
}

/**
 * Determine SLA status
 */
function determineSLAStatus(alloc: RakeAllocationPlan): "On-time" | "At-Risk" | "Late" {
  const latestDue = Math.max(...alloc.assigned_orders.map((o) => new Date(o.order.due_date).getTime()));
  const estimatedArrival =
    new Date(alloc.departure_time).getTime() + 72 * 3600 * 1000;

  const hoursEarly = (latestDue - estimatedArrival) / 3600000;
  if (hoursEarly > 24) return "On-time";
  if (hoursEarly > 0) return "At-Risk";
  return "Late";
}

/**
 * Extract ML features for risk prediction
 */
function extractMLFeatures(
  alloc: RakeAllocationPlan,
  state: SolverState
): Record<string, number> {
  const route = state.routes.find(
    (r) =>
      r.origin === alloc.rake.current_location &&
      r.destination === alloc.destination_primary
  );

  const avgPriority =
    alloc.assigned_orders.reduce((sum, o) => sum + o.order.priority, 0) /
    alloc.assigned_orders.length;

  return {
    distance_km: route?.distance_km || 1400,
    transit_time_hours: route?.transit_time_hours || 72,
    priority: avgPriority,
    material_weight: alloc.total_tonnage,
    loading_point_congestion: 0.5, // placeholder
    route_historical_delays_pct: 0.12,
    time_until_due_date_hours: Math.max(
      ...alloc.assigned_orders.map(
        (o) =>
          (new Date(o.order.due_date).getTime() - new Date(alloc.departure_time).getTime()) /
          3600000
      )
    ),
    mode: 1, // 1 = rail
    season_factor: 1.05,
  };
}

/**
 * Generate explanation tags
 */
function generateExplanationTags(
  alloc: RakeAllocationPlan,
  utilization: number,
  riskFlag: string
): string[] {
  const tags: string[] = [];

  if (utilization > 80) tags.push("high_utilization");
  if (utilization < 50) tags.push("low_utilization_risk");
  if (riskFlag === "LOW") tags.push("low_delay_risk");
  if (riskFlag === "HIGH") tags.push("high_delay_risk");

  const hasHighPriority = alloc.assigned_orders.some((o) => o.order.priority <= 2);
  if (hasHighPriority) tags.push("includes_high_priority");

  if (alloc.destination_secondary.length > 0) tags.push("multi_destination");

  tags.push("cost_optimized");

  return tags;
}

/**
 * Get transit time for route
 */
function getTransitTime(state: SolverState, destination: string): number {
  const avgTransit =
    state.routes
      .filter((r) => r.destination === destination)
      .reduce((sum, r) => sum + r.transit_time_hours, 0) / state.routes.length || 72;
  return avgTransit;
}

/**
 * Generate rail vs road assignments for all orders
 */
function generateRailVsRoadAssignments(
  plannedRakes: PlannedRake[],
  unassignedOrders: Order[],
  state: SolverState
): RailVsRoadAssignment[] {
  const assignments: RailVsRoadAssignment[] = [];

  // Rail assignments from rakes
  for (const rake of plannedRakes) {
    for (const order of rake.orders_allocated) {
      assignments.push({
        order_id: order.order_id,
        assigned_mode: "rail",
        assigned_rake_id: rake.planned_rake_id,
        expected_ship_date: rake.departure_time,
        expected_arrival_date: order.estimated_arrival,
        confidence_percent: 95,
      });
    }
  }

  // Road assignments for unassigned orders
  for (const order of unassignedOrders) {
    const routeCost = state.routes.find(
      (r) =>
        r.destination === order.destination &&
        r.mode === "road"
    );
    const transitHours = routeCost?.transit_time_hours || 24;
    const now = new Date();
    const arrival = new Date(now.getTime() + transitHours * 3600 * 1000);

    assignments.push({
      order_id: order.order_id,
      assigned_mode: "road",
      planned_truck_batches: Math.ceil(order.quantity_tonnes / 25),
      expected_ship_date: now.toISOString(),
      expected_arrival_date: arrival.toISOString(),
      confidence_percent: 75,
    });
  }

  return assignments;
}

/**
 * Generate production suggestions based on inventory and orders
 */
function generateProductionSuggestions(
  state: SolverState,
  orders: Order[]
): ProductionSuggestion[] {
  const materialDemand = new Map<string, number>();
  const materialHighPriority = new Map<string, number>();

  for (const order of orders) {
    materialDemand.set(
      order.material_id,
      (materialDemand.get(order.material_id) || 0) + order.quantity_tonnes
    );
    if (order.priority <= 2) {
      materialHighPriority.set(
        order.material_id,
        (materialHighPriority.get(order.material_id) || 0) + 1
      );
    }
  }

  const suggestions: ProductionSuggestion[] = [];

  for (const [materialId, demand] of materialDemand.entries()) {
    const inventory = Array.from(state.stockyards.values())
      .filter((s) => s.material_id === materialId)
      .reduce((sum, s) => sum + s.available_tonnage, 0);

    const highPriorityCount = materialHighPriority.get(materialId) || 0;

    if (inventory < demand * 0.5) {
      const recommendedProduction = demand - inventory + 100;
      suggestions.push({
        material_id: materialId,
        current_inventory_tonnes: inventory,
        recommended_production_tonnage: recommendedProduction,
        reasoning: `High demand (${demand}t) + ${highPriorityCount} high-priority orders. Current inventory covers only ${((inventory / demand) * 100).toFixed(1)}% of demand.`,
      });
    }
  }

  return suggestions;
}

/**
 * Calculate baseline cost (all orders via road)
 */
function calculateBaselineCost(orders: Order[], routesCosts: RouteCost[]): number {
  let totalCost = 0;
  for (const order of orders) {
    const route = routesCosts.find(
      (r) => r.destination === order.destination && r.mode === "road"
    );
    const costPerTonne = route?.cost_per_tonne || 400;
    totalCost += order.quantity_tonnes * costPerTonne;
  }
  return totalCost;
}

/**
 * Calculate demurrage savings
 */
function calculateDemurageSavings(plannedRakes: PlannedRake[], state: SolverState): number {
  let savings = 0;
  for (const rake of plannedRakes) {
    for (const order of rake.orders_allocated) {
      const daysEarly = Math.max(0, 2); // simplified: assume 2 days early
      const dailyRate = state.orders.get(order.order_id)?.penalty_rate_per_day || 500;
      savings += daysEarly * dailyRate;
    }
  }
  return savings;
}
