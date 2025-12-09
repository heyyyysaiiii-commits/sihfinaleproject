import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function OptimizationRun() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [costWeight, setCostWeight] = useState(50);
  const [slaWeight, setSlaWeight] = useState(50);
  const [minUtilization, setMinUtilization] = useState(65);
  const [allowMultiDest, setAllowMultiDest] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample data summary (in production, this would come from uploaded data)
  const dataSummary = {
    totalOrders: 20,
    totalQuantity: 850,
    destinations: 6,
    platforms: 3,
    loadingPoints: 2,
  };

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      // Load the sample data from the demo endpoint
      const sampleResponse = await fetch("/api/plan-rakes/demo");
      if (!sampleResponse.ok) throw new Error("Failed to load sample data");
      
      const result = await sampleResponse.json();
      
      // Store result in session storage for next page
      sessionStorage.setItem("optimizationResult", JSON.stringify(result));
      
      toast({
        title: "Optimization Complete",
        description: "Rake plan generated successfully",
      });

      navigate("/rake-plan-dispatch");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Optimization failed";
      setError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Optimization Run</h1>
            <p className="text-lg text-muted-foreground">Configure parameters and run the AI optimization</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Data Summary */}
              <div className="card-glow p-8 space-y-6 border-primary/20">
                <h2 className="text-2xl font-bold text-foreground">Input Summary</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">TOTAL ORDERS</p>
                    <p className="text-2xl font-bold text-primary">{dataSummary.totalOrders}</p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">QUANTITY</p>
                    <p className="text-2xl font-bold text-secondary">{dataSummary.totalQuantity} MT</p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">DESTINATIONS</p>
                    <p className="text-2xl font-bold text-accent">{dataSummary.destinations}</p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">PLATFORMS</p>
                    <p className="text-2xl font-bold text-primary">{dataSummary.platforms}</p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">LOADING POINTS</p>
                    <p className="text-2xl font-bold text-secondary">{dataSummary.loadingPoints}</p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">STATUS</p>
                    <p className="text-sm font-bold text-green-400">Ready</p>
                  </div>
                </div>
              </div>

              {/* Optimization Parameters */}
              <div className="card-glow p-8 space-y-8 border-primary/20">
                <h2 className="text-2xl font-bold text-foreground">Optimization Parameters</h2>

                {/* Cost vs SLA Weight */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Cost vs SLA Priority
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Balance between minimizing costs and meeting delivery deadlines
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cost {costWeight}% • SLA {slaWeight}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-muted-foreground">Cost Minimize</p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={costWeight}
                        onChange={(e) => {
                          setCostWeight(Number(e.target.value));
                          setSlaWeight(100 - Number(e.target.value));
                        }}
                        className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-muted-foreground text-right">SLA Compliance</p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slaWeight}
                        onChange={(e) => {
                          setSlaWeight(Number(e.target.value));
                          setCostWeight(100 - Number(e.target.value));
                        }}
                        className="w-full h-2 bg-gradient-to-r from-secondary to-primary rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Min Utilization */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Minimum Rake Utilization
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Minimum wagon fill percentage for each rake (65-95%)
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">{minUtilization}%</p>
                  </div>

                  <input
                    type="range"
                    min="65"
                    max="95"
                    value={minUtilization}
                    onChange={(e) => setMinUtilization(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Multi-destination Rakes */}
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Allow Multi-Destination Rakes</p>
                    <p className="text-xs text-muted-foreground">Mix orders from different destinations in single rake</p>
                  </div>
                  <button
                    onClick={() => setAllowMultiDest(!allowMultiDest)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      allowMultiDest ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        allowMultiDest ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">Optimization Error</p>
                    <p className="text-xs text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Run Button */}
              <div className="flex gap-4">
                <Button
                  onClick={handleRunOptimization}
                  disabled={isOptimizing}
                  className="flex-1 btn-gradient h-12 text-lg font-semibold"
                >
                  {isOptimizing && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {isOptimizing ? "Running Optimization..." : "Run Optimization"}
                </Button>

                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="h-12 px-8 border-primary/30"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Right Panel: Info */}
            <div className="space-y-6">
              <div className="card-glow p-6 space-y-4 border-primary/20">
                <h3 className="font-bold text-foreground">Optimization Process</h3>
                <ol className="space-y-2 text-sm text-foreground/80">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">1.</span>
                    <span>Validate order data</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">2.</span>
                    <span>Group orders by destination & priority</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">3.</span>
                    <span>Assign to available rakes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">4.</span>
                    <span>Optimize wagon utilization</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">5.</span>
                    <span>Generate explanations</span>
                  </li>
                </ol>
              </div>

              <div className="card-glow p-6 space-y-3 border-secondary/20 bg-secondary/5">
                <p className="text-xs font-bold text-secondary">⚡ TYPICAL RESULTS</p>
                <div className="space-y-2 text-sm text-foreground/80">
                  <div className="flex justify-between"><span>Rakes Formed:</span><span className="font-bold text-primary">3-4</span></div>
                  <div className="flex justify-between"><span>Avg Utilization:</span><span className="font-bold text-secondary">87-92%</span></div>
                  <div className="flex justify-between"><span>SLA Compliance:</span><span className="font-bold text-accent">95%+</span></div>
                  <div className="flex justify-between"><span>Cost Savings:</span><span className="font-bold text-green-400">12-18%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
