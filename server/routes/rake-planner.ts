/**
 * API endpoints for rake planning
 */

import { RequestHandler } from "express";
import { planRakes, type RakePlanOutput } from "../lib/rake-planner";
import { buildInternalModel, validateInternalModel, generateSyntheticData, type CSVOrder } from "../lib/rake-planner-utils";

/**
 * POST /api/plan-rakes
 * Main endpoint: accepts CSV orders and returns optimized rake plan
 */
export const handlePlanRakes: RequestHandler = (req, res) => {
  try {
    const { orders } = req.body as { orders: CSVOrder[] };

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        error: "Invalid input: must provide 'orders' array",
      });
    }

    // Build internal model
    const model = buildInternalModel(orders);

    // Validate
    const validation = validateInternalModel(model);
    if (!validation.valid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    // Plan rakes
    const rakePlan = planRakes(
      model.orders,
      model.rakes,
      model.wagons,
      model.platforms,
      model.constraints
    );

    res.json(rakePlan);
  } catch (error) {
    console.error("Planning error:", error);
    res.status(500).json({
      error: "Planning failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET /api/plan-rakes/demo
 * Returns a demo plan with synthetic data
 */
export const handlePlanRakesDemo: RequestHandler = (req, res) => {
  try {
    const syntheticOrders = generateSyntheticData();
    const model = buildInternalModel(syntheticOrders);

    const rakePlan = planRakes(
      model.orders,
      model.rakes,
      model.wagons,
      model.platforms,
      model.constraints
    );

    res.json(rakePlan);
  } catch (error) {
    console.error("Demo planning error:", error);
    res.status(500).json({
      error: "Demo planning failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
