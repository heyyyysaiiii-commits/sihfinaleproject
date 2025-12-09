import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Zap, TrendingDown, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                <p className="text-lg text-muted-foreground">Real-time system overview and KPI tracking</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-foreground">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-glow p-6 space-y-3 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">ACTIVE RAKES</p>
                <BarChart3 className="w-5 h-5 text-primary opacity-60" />
              </div>
              <p className="text-4xl font-bold text-primary">3</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 2 running today
              </p>
            </div>

            <div className="card-glow p-6 space-y-3 border-l-4 border-secondary">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">PENDING ORDERS</p>
                <AlertCircle className="w-5 h-5 text-secondary opacity-60" />
              </div>
              <p className="text-4xl font-bold text-secondary">12</p>
              <p className="text-xs text-orange-400">Ready for next optimization</p>
            </div>

            <div className="card-glow p-6 space-y-3 border-l-4 border-accent">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">AVG UTILIZATION</p>
                <TrendingUp className="w-5 h-5 text-accent opacity-60" />
              </div>
              <p className="text-4xl font-bold text-accent">86.2%</p>
              <p className="text-xs text-green-400">+3.1% vs last week</p>
            </div>

            <div className="card-glow p-6 space-y-3 border-l-4 border-green-400">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">COST SAVINGS</p>
                <TrendingDown className="w-5 h-5 text-green-400 opacity-60" />
              </div>
              <p className="text-4xl font-bold text-green-400">₹2.4M</p>
              <p className="text-xs text-green-400">Last 30 days</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-glow p-8 space-y-6 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/data-upload")}
                className="group relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <span className="text-xl">📤</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Upload Data</p>
                  <p className="text-xs text-muted-foreground">Import new orders</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/optimization-run")}
                className="group relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Run Optimization</p>
                  <p className="text-xs text-muted-foreground">Generate rake plan</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/rake-plan-dispatch")}
                className="group relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <span className="text-xl">🚚</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">View Results</p>
                  <p className="text-xs text-muted-foreground">See rake plan</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="group relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-green-400/10 to-green-400/5 border border-green-400/20 hover:border-green-400/40 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Reports</p>
                  <p className="text-xs text-muted-foreground">Analytics & trends</p>
                </div>
              </button>
            </div>
          </div>

          {/* Active Rakes */}
          <div className="card-glow p-8 space-y-6 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground">Active Rakes (3)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "R1", dest: "Delhi", orders: 5, util: 94, status: "Loading", color: "primary" },
                { id: "R2", dest: "Mumbai", orders: 4, util: 87, status: "Dispatched", color: "secondary" },
                { id: "R3", dest: "Bangalore", orders: 3, util: 77, status: "In Transit", color: "accent" },
              ].map((rake) => (
                <div key={rake.id} className="card-glow p-6 space-y-4 border-l-4 border-muted">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{rake.id}</h3>
                      <p className="text-sm text-muted-foreground">{rake.dest}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      rake.status === "Loading" ? "bg-yellow-500/20 text-yellow-400" :
                      rake.status === "Dispatched" ? "bg-blue-400/20 text-blue-400" :
                      "bg-green-400/20 text-green-400"
                    }`}>
                      {rake.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{rake.orders} orders</span>
                      <span className="font-semibold text-foreground">{rake.util}% full</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${rake.color} to-${rake.color}/60`}
                        style={{
                          backgroundColor: rake.color === "primary" ? "hsl(217 85% 29%)" : rake.color === "secondary" ? "hsl(173 74% 37%)" : "hsl(173 74% 37%)",
                          width: `${rake.util}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SLA Performance */}
            <div className="card-glow p-8 space-y-6 border-green-400/20 bg-green-400/5">
              <h2 className="text-xl font-bold text-foreground">SLA Compliance</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">On-Time Delivery Rate</span>
                    <span className="font-bold text-green-400">97.5%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-11/12" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">On Time</p>
                    <p className="text-xl font-bold text-green-400">39</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">At Risk</p>
                    <p className="text-xl font-bold text-yellow-500">1</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Delayed</p>
                    <p className="text-xl font-bold text-red-400">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Capacity */}
            <div className="card-glow p-8 space-y-6 border-accent/20 bg-accent/5">
              <h2 className="text-xl font-bold text-foreground">Platform Capacity</h2>

              <div className="space-y-4">
                {[
                  { name: "Loading Point 1", used: 135, capacity: 180, percent: 75 },
                  { name: "Loading Point 2", used: 67, capacity: 90, percent: 74 },
                  { name: "Platform 1", used: 45, capacity: 45, percent: 100 },
                ].map((lp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{lp.name}</span>
                      <span className="text-muted-foreground">{lp.used}/{lp.capacity} wagons</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${lp.percent === 100 ? "bg-red-400" : lp.percent >= 75 ? "bg-yellow-500" : "bg-accent"}`}
                        style={{ width: `${lp.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="card-glow p-8 space-y-4 border-accent/20 bg-accent/5 text-center">
            <h2 className="text-2xl font-bold text-foreground">Ready to optimize today's shipments?</h2>
            <p className="text-foreground/80">Upload your orders and let AI handle the complex logistics planning</p>
            <Button
              onClick={() => navigate("/data-upload")}
              className="btn-gradient h-12 px-8 mx-auto"
            >
              Start New Optimization
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
