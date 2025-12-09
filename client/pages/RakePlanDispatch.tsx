import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Share2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface RakePlan {
  rake_id: string;
  loading_point_id: string;
  destination: string;
  total_tonnage: number;
  utilization_percent: number;
  orders: string[];
  wagons: number;
}

interface OptimizationResult {
  kpi_summary: {
    rakes_used: number;
    total_orders: number;
    average_rake_utilization_percent: number;
    total_estimated_cost: number;
  };
  rake_plan: RakePlan[];
  natural_language_plan: Array<{
    order_id: string;
    explanation: string;
    reason: string;
  }>;
}

export default function RakePlanDispatch() {
  const { toast } = useToast();
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [selectedRake, setSelectedRake] = useState<string | null>(null);

  useEffect(() => {
    // Load optimization result from session storage
    const stored = sessionStorage.getItem("optimizationResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
        sessionStorage.removeItem("optimizationResult");
      } catch (e) {
        // Fallback: use demo data
        loadDemoData();
      }
    } else {
      loadDemoData();
    }
  }, []);

  const loadDemoData = async () => {
    try {
      const response = await fetch("/api/plan-rakes/demo");
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        if (data.rake_plan && data.rake_plan.length > 0) {
          setSelectedRake(data.rake_plan[0].rake_id);
        }
      }
    } catch (e) {
      console.error("Failed to load demo data", e);
    }
  };

  const handleExportCSV = () => {
    if (!result) return;

    const headers = ["Order ID", "Rake ID", "Destination", "Loading Point", "Wagon Index", "Quantity (MT)", "Status"];
    const rows = result.rake_plan.map((rake) => [
      rake.orders.join("; "),
      rake.rake_id,
      rake.destination,
      rake.loading_point_id,
      "1-45",
      rake.total_tonnage.toFixed(1),
      "Planned",
    ]);

    const csv = [headers, ...rows].map((row) => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rake_plan.csv";
    a.click();

    toast({
      title: "Downloaded",
      description: "Rake plan exported to CSV",
    });
  };

  if (!result) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
            <p className="text-foreground font-semibold">Loading optimization results...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedRakeData = result.rake_plan.find((r) => r.rake_id === selectedRake);

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Rake Plan & Dispatch</h1>
            <p className="text-lg text-muted-foreground">Optimized rake formations with AI explanations</p>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-glow p-6 space-y-2 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground font-medium">RAKES FORMED</p>
              <p className="text-3xl font-bold text-primary">{result.kpi_summary.rakes_used}</p>
              <p className="text-xs text-muted-foreground">Ready to dispatch</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-l-4 border-secondary">
              <p className="text-sm text-muted-foreground font-medium">TOTAL ORDERS</p>
              <p className="text-3xl font-bold text-secondary">{result.kpi_summary.total_orders}</p>
              <p className="text-xs text-muted-foreground">Processed</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-l-4 border-accent">
              <p className="text-sm text-muted-foreground font-medium">AVG UTILIZATION</p>
              <p className="text-3xl font-bold text-accent">{result.kpi_summary.average_rake_utilization_percent.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Wagon fill rate</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-l-4 border-green-400">
              <p className="text-sm text-muted-foreground font-medium">EST. COST</p>
              <p className="text-3xl font-bold text-green-400">₹{(result.kpi_summary.total_estimated_cost / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Total cost</p>
            </div>
          </div>

          {/* Rake Cards Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Formed Rakes ({result.kpi_summary.rakes_used})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.rake_plan.map((rake) => (
                <button
                  key={rake.rake_id}
                  onClick={() => setSelectedRake(rake.rake_id)}
                  className={`card-glow p-6 space-y-4 text-left transition-all border-2 cursor-pointer ${
                    selectedRake === rake.rake_id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-primary">{rake.rake_id}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {rake.orders.length} orders
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium text-foreground">{rake.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loading Point</span>
                      <span className="font-medium text-foreground">{rake.loading_point_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wagons</span>
                      <span className="font-medium text-foreground">{rake.wagons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium text-foreground">{rake.total_tonnage.toFixed(1)} MT</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className={`font-bold ${rake.utilization_percent >= 85 ? "text-green-400" : rake.utilization_percent >= 70 ? "text-yellow-400" : "text-orange-400"}`}>
                        {rake.utilization_percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Rake Details */}
          {selectedRakeData && (
            <div className="card-glow p-8 space-y-6 border-primary/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedRakeData.rake_id} Details
                </h2>
                <div className="flex gap-2">
                  <Button onClick={handleExportCSV} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Plan
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Orders in this rake */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Orders Allocated</p>
                <div className="space-y-2">
                  {selectedRakeData.orders.map((orderId, idx) => {
                    const nlExplanation = result.natural_language_plan.find((nl) => nl.order_id === orderId);
                    return (
                      <div key={idx} className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <p className="text-sm font-semibold text-foreground">{orderId}</p>
                        {nlExplanation && (
                          <>
                            <p className="text-xs text-foreground/80">{nlExplanation.explanation}</p>
                            <p className="text-xs text-muted-foreground italic">
                              Reason: {nlExplanation.reason}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Natural Language Explanations */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">AI Explanations</h2>
            <div className="card-glow p-8 space-y-6 border-primary/20">
              {result.natural_language_plan.slice(0, 10).map((item, idx) => (
                <div key={idx} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-foreground">{item.order_id}</p>
                  <p className="text-sm text-foreground/90">{item.explanation}</p>
                  <p className="text-xs text-muted-foreground italic">Reason: {item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center py-8">
            <Button className="btn-gradient h-12 px-8">
              Save to Database
            </Button>
            <Button variant="outline" className="h-12 px-8 border-primary/30">
              Go to Rail vs Road Split
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
