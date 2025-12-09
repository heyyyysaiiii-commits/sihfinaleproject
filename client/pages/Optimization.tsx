import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, CheckCircle, AlertCircle, Play, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { OptimizeRakesResponse } from "@shared/api";

type OptimizationStatus = "idle" | "running" | "success" | "error";

export default function Optimization() {
  const [costFocus, setCostFocus] = useState(0.6);
  const [allowMultiDest, setAllowMultiDest] = useState(true);
  const [minUtilization, setMinUtilization] = useState(75);
  const [status, setStatus] = useState<OptimizationStatus>("idle");
  const [result, setResult] = useState<OptimizeRakesResponse | null>(null);
  const [error, setError] = useState<string>("");

  const { data: sampleDataset } = useQuery({
    queryKey: ["sample-dataset"],
    queryFn: async () => {
      const res = await fetch("/api/sample-dataset");
      return res.json();
    },
  });

  const statusMessages = [
    "Checking inventory availability…",
    "Analyzing orders & priorities…",
    "Assigning rakes optimally…",
    "Avoiding delays & penalties…",
    "Maximizing utilization…",
    "Finalizing rake plan…",
  ];

  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  const handleRunOptimization = async () => {
    if (!sampleDataset) {
      setError("Sample data not loaded yet");
      return;
    }

    setStatus("running");
    setError("");
    setResult(null);
    setCurrentStatusIndex(0);

    const progressInterval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        if (prev >= statusMessages.length - 1) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    try {
      const res = await fetch("/api/optimize-rakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sampleDataset,
          config: {
            cost_vs_sla_weight: costFocus,
            allow_multi_destination_rakes: allowMultiDest,
            min_utilization_percent: minUtilization,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Optimization failed");
      }

      clearInterval(progressInterval);
      const data = (await res.json()) as OptimizeRakesResponse;
      setResult(data);
      setStatus("success");
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  const costEmoji = costFocus > 0.7 ? "💰" : costFocus > 0.4 ? "⚖️" : "⏱️";

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Page Header */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-title-lg flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Optimize Rake Plan
            </h1>
            <p className="text-subtitle">
              Tune the algorithm to match your priorities
            </p>
          </div>

          {/* Configuration Panel */}
          <div className="card-glow p-6 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4">Priority Balance</h3>

              {/* Cost vs SLA Slider */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">💰</span> Cost Focus
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {(costFocus * 100).toFixed(0)}% cost · {((1 - costFocus) * 100).toFixed(0)}% on-time
                    </span>
                  </div>
                  <Slider
                    value={[costFocus]}
                    onValueChange={(v) => setCostFocus(v[0])}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Prioritize Speed & Deadlines</span>
                    <span>Prioritize Cost Savings</span>
                  </div>
                </div>

                <p className="text-xs text-foreground/70 bg-muted/20 p-3 rounded">
                  {costFocus > 0.7
                    ? "🎯 Cost mode: Algorithm prefers large rakes and consolidation, even if it means tighter schedules."
                    : costFocus > 0.4
                      ? "⚖️ Balanced mode: Mix of cost savings and on-time reliability."
                      : "⏱️ Speed mode: Prioritizes hitting all SLA deadlines with minimal delays."}
                </p>
              </div>
            </div>

            <div className="border-t border-primary/20 pt-6">
              <h3 className="font-bold text-lg mb-4">Rake Rules</h3>

              {/* Allow Multi-Destination Toggle */}
              <div className="flex items-center justify-between p-4 frosted-glass">
                <div>
                  <p className="font-medium">Allow Multi-Destination Rakes</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    One rake can serve multiple destinations (increases grouping, may reduce simplicity)
                  </p>
                </div>
                <Switch checked={allowMultiDest} onCheckedChange={setAllowMultiDest} />
              </div>

              {/* Minimum Utilization Slider */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    📊 Minimum Utilization Target
                  </label>
                  <span className="text-sm font-semibold text-primary">{minUtilization}%</span>
                </div>
                <Slider
                  value={[minUtilization]}
                  onValueChange={(v) => setMinUtilization(v[0])}
                  min={50}
                  max={95}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-foreground/70">
                  {minUtilization >= 80
                    ? "🎯 Aggressive: Fewer rakes, higher capacity usage. Orders may wait longer."
                    : minUtilization >= 70
                      ? "✅ Balanced: Good capacity usage with reasonable rake frequency."
                      : "⚡ Lenient: More frequent rakes, less wait time but more empty space."}
                </p>
              </div>
            </div>
          </div>

          {/* Run Optimization Button */}
          <div className="space-y-4">
            <Button
              onClick={handleRunOptimization}
              disabled={status === "running"}
              className="btn-gradient w-full h-14 text-lg font-semibold"
            >
              {status === "running" ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Run Optimization
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Progress Display */}
          {status === "running" && (
            <div className="card-glow p-6 space-y-6 border-primary/40">
              <h3 className="font-bold text-lg">Running Optimization</h3>

              {/* Step Progress Bubbles */}
              <div className="space-y-4">
                {statusMessages.map((msg, idx) => {
                  const isActive = idx === currentStatusIndex;
                  const isComplete = idx < currentStatusIndex;

                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isComplete
                            ? "bg-green-500/20 border border-green-500/50"
                            : isActive
                              ? "bg-primary/20 border border-primary/50 animate-glow-pulse"
                              : "bg-muted/20 border border-muted/50"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : isActive ? (
                          <Loader className="w-5 h-5 text-primary animate-spin" />
                        ) : (
                          <div className="w-2 h-2 bg-muted rounded-full" />
                        )}
                      </div>
                      <div className={`pt-2 ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                        {msg}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success Result */}
          {status === "success" && result && (
            <div className="card-glow p-6 space-y-4 border-primary/40 border-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="font-bold text-lg text-green-400">
                  Optimization Complete!
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="frosted-glass p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {result.planned_rakes.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Rakes Needed</p>
                </div>
                <div className="frosted-glass p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {(result.summary.avg_utilization).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Utilization</p>
                </div>
                <div className="frosted-glass p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round(result.summary.on_time_percent)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">On-Time</p>
                </div>
                <div className="frosted-glass p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    ₹{(result.summary.demurrage_avoided / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Penalties Avoided</p>
                </div>
              </div>

              <Alert className="border-green-500/30 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  New plan is {result.summary.on_time_percent === 100 ? "100% on-time" : "optimized for your priorities"}. 
                  Go to Rake Planner to review and approve.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* How It Works */}
          {status === "idle" && !result && (
            <div className="card-glow p-6 space-y-4 border-primary/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-bold">How Optimization Works</h3>
                  <p className="text-sm text-foreground/80">
                    Our AI analyzes all pending orders, available inventory, and customer deadlines. It creates rake plans that either 
                    <strong> minimize cost</strong> or <strong> maximize on-time delivery</strong> based on your settings above.
                  </p>
                  <p className="text-sm text-foreground/80 mt-2">
                    The system avoids demurrage (late penalties), maximizes wagon utilization, and explains every decision in plain English.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
