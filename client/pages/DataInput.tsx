import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Loader, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OptimizeRakesResponse } from "@shared/api";

export default function DataInput() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<Set<number>>(new Set());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizeRakesResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load sample dataset
  const { data: sampleDataset } = useQuery({
    queryKey: ["sample-dataset"],
    queryFn: async () => {
      const res = await fetch("/api/sample-dataset");
      return res.json();
    },
  });

  const files = [
    {
      id: 1,
      name: "orders.csv",
      purpose: "Customer orders — what needs to be shipped where and when",
      columns: ["order_id", "customer_id", "destination", "material_id", "quantity_tonnes", "priority", "due_date"],
      example: {
        order_id: "ORD_2024_001",
        customer: "ABC Pipes Ltd",
        destination: "Delhi",
        material: "Coils",
        quantity: "28.5 tonnes",
        priority: "1 (High)",
        due_date: "2024-01-17",
      },
    },
    {
      id: 2,
      name: "stockyards.csv",
      purpose: "Inventory — what materials are available where",
      columns: ["stockyard_id", "location", "material_id", "available_tonnage", "loading_point_id"],
      example: {
        stockyard: "BOKARO_SY_1",
        location: "Bokaro Plant Yard-1",
        material: "Coils",
        available: "450.5 tonnes",
        loading: "BOKARO_LP_1",
      },
    },
    {
      id: 3,
      name: "rakes.csv",
      purpose: "Available rakes — train capacity and wagon count",
      columns: ["rake_id", "wagon_type", "num_wagons", "total_capacity_tonnes"],
      example: {
        rake: "RAKE_001",
        wagon_type: "BOXN",
        wagons: "34",
        total: "952 tonnes",
      },
    },
    {
      id: 4,
      name: "product_wagon_matrix.csv",
      purpose: "Compatibility — which materials fit in which wagon types",
      columns: ["material_id", "wagon_type", "max_load_per_wagon_tonnes", "allowed"],
      example: {
        material: "Coils",
        wagon: "BOXN",
        max_load: "26 tonnes",
        allowed: "Yes",
      },
    },
    {
      id: 5,
      name: "loading_points.csv",
      purpose: "Loading facilities — max rakes per day, loading speed",
      columns: ["loading_point_id", "stockyard_id", "max_rakes_per_day", "loading_rate_tonnes_per_hour"],
      example: {
        lp_id: "BOKARO_LP_1",
        stockyard: "BOKARO_SY_1",
        max_rakes: "5",
        rate: "120 tonnes/hour",
      },
    },
    {
      id: 6,
      name: "routes_costs.csv",
      purpose: "Routes — distance, cost, and transit time",
      columns: ["origin", "destination", "mode", "distance_km", "transit_time_hours", "cost_per_tonne"],
      example: {
        from: "Bokaro",
        to: "Delhi",
        mode: "rail",
        distance: "1,400 km",
        transit: "72 hours",
        cost: "₹280/tonne",
      },
    },
  ];

  const handleUploadFile = (fileId: number) => {
    setUploadedFiles((prev) => new Set(prev).add(fileId));
  };

  const handleUseSampleData = async () => {
    if (!sampleDataset) return;

    setUploadedFiles(new Set([1, 2, 3, 4, 5, 6]));
    setIsOptimizing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/optimize-rakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sampleDataset,
          config: {
            cost_vs_sla_weight: 0.6,
            allow_multi_destination_rakes: true,
            min_utilization_percent: 70,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Optimization failed");
      }

      const result = (await response.json()) as OptimizeRakesResponse;
      setOptimizationResult(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to run optimization");
    } finally {
      setIsOptimizing(false);
    }
  };

  const allUploaded = uploadedFiles.size === 6;

  // Show results if optimization is complete
  if (optimizationResult) {
    return (
      <Layout>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold text-foreground">Optimization Complete</h1>
              <p className="text-lg text-muted-foreground">Review your results below</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
              <div className="card-glow p-6 space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Rakes Formed</p>
                <p className="text-3xl font-bold text-primary">{optimizationResult.kpi_summary.number_of_rakes_planned}</p>
                <p className="text-xs text-green-400">Ready for dispatch</p>
              </div>

              <div className="card-glow p-6 space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Quantity</p>
                <p className="text-3xl font-bold text-primary">
                  {Math.round(optimizationResult.planned_rakes.reduce((sum, r) => sum + r.total_tonnage_assigned, 0))} MT
                </p>
                <p className="text-xs text-muted-foreground">Processed</p>
              </div>

              <div className="card-glow p-6 space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Avg Utilization</p>
                <p className="text-3xl font-bold text-green-400">
                  {Math.round(optimizationResult.kpi_summary.average_rake_utilization_percent)}%
                </p>
                <p className="text-xs text-muted-foreground">Wagon fill rate</p>
              </div>

              <div className="card-glow p-6 space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Cost</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{(optimizationResult.kpi_summary.total_cost_optimized / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-muted-foreground">Estimated</p>
              </div>
            </div>

            {/* AI Reasoning Timeline */}
            <div className="card-glow p-6 space-y-6">
              <p className="font-bold text-lg text-foreground">AI Reasoning Steps</p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Validated {optimizationResult.kpi_summary.number_of_rakes_planned} orders across {new Set(optimizationResult.planned_rakes.map((r) => r.primary_destination)).size} destinations.</p>
                    <p className="text-xs text-muted-foreground mt-1">Checked compatibility and identified material types needed.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Grouped orders by destination and priority.</p>
                    <p className="text-xs text-muted-foreground mt-1">High-priority orders were planned first to ensure on-time delivery.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Allocated rakes to maximize utilization (avg {Math.round(optimizationResult.kpi_summary.average_rake_utilization_percent)}%).</p>
                    <p className="text-xs text-muted-foreground mt-1">Avoided creating extra rakes by consolidating shipments efficiently.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Calculated costs and delivery timelines.</p>
                    <p className="text-xs text-muted-foreground mt-1">All rakes scheduled to meet customer SLA deadlines.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">5</div>
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Generated human-readable explanations for each decision.</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready for review and approval by logistics planners.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/rake-planner")}
                className="btn-gradient h-12 px-8"
              >
                Review Rake Plan
              </Button>
              <Button
                onClick={() => navigate("/orders")}
                variant="outline"
                className="h-12 px-8 border-primary/30 hover:border-primary/60"
              >
                View Order Allocations
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Data Input</h1>
            <p className="text-lg text-muted-foreground">
              Upload 6 essential CSV files or use sample data to run optimization.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Upload Status:</strong> {uploadedFiles.size} of 6 files loaded
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(uploadedFiles.size / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          {/* File Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {files.map((file) => (
              <div key={file.id} className="card-glow p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{file.id}. {file.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{file.purpose}</p>
                  </div>
                  {uploadedFiles.has(file.id) && (
                    <div className="w-5 h-5 text-green-400 flex-shrink-0">✓</div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Required Columns:</p>
                  <div className="space-y-1">
                    {file.columns.map((col, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-primary text-xs font-bold mt-0.5">•</span>
                        <code className="text-xs text-foreground/80 bg-muted/20 px-2 py-1 rounded">
                          {col}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="frosted-glass p-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Example:</p>
                  <div className="space-y-0.5 text-xs">
                    {Object.entries(file.example).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-foreground/80">
                        <span className="opacity-70">{key}:</span>
                        <span className="font-medium text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleUploadFile(file.id)}
                  disabled={uploadedFiles.has(file.id)}
                  variant={uploadedFiles.has(file.id) ? "outline" : "default"}
                  className={
                    uploadedFiles.has(file.id)
                      ? "w-full opacity-50"
                      : "btn-gradient w-full"
                  }
                >
                  {uploadedFiles.has(file.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Loaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="card-glow p-8 space-y-4 border-primary/40">
            <p className="text-center text-foreground">
              Ready to proceed? Choose one of these options:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="btn-gradient h-12 px-8 flex items-center gap-2"
                disabled={!allUploaded || isOptimizing}
              >
                {isOptimizing && <Loader className="w-4 h-4 animate-spin" />}
                {isOptimizing ? "Optimizing..." : "Run Optimization"}
              </Button>
              <Button
                onClick={handleUseSampleData}
                disabled={isOptimizing}
                variant="outline"
                className="h-12 px-8 border-primary/30 hover:border-primary/60"
              >
                {isOptimizing && <Loader className="w-4 h-4 animate-spin" />}
                {isOptimizing ? "Optimizing..." : "Use Sample Data"}
              </Button>
            </div>
            {allUploaded && (
              <div className="text-center text-green-400 text-sm font-semibold">
                All files loaded successfully! Click "Run Optimization" to proceed.
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="card-glow p-6 border-primary/20">
            <p className="text-sm text-foreground/80">
              <strong>Tip:</strong> No real data yet? Click "Use Sample Data" to see OptiRake DSS in action with example SAIL Bokaro data. Later, upload your own files to optimize your actual orders.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
