import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function RailRoadSplit() {
  const [data, setData] = useState({
    railOrders: 18,
    railQuantity: 1245,
    railCost: 435000,
    roadOrders: 2,
    roadQuantity: 68,
    roadCost: 52250,
  });

  const railPercent = (data.railQuantity / (data.railQuantity + data.roadQuantity)) * 100;
  const roadPercent = (data.roadQuantity / (data.railQuantity + data.roadQuantity)) * 100;

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Rail vs Road Split</h1>
            <p className="text-lg text-muted-foreground">Mode allocation analysis and recommendations</p>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart Section */}
            <div className="card-glow p-8 space-y-6 border-primary/20">
              <h2 className="text-2xl font-bold text-foreground">Quantity Distribution</h2>

              <div className="space-y-4">
                {/* Rail */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Rail Transport</span>
                    <span className="text-lg font-bold text-primary">{railPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-start pl-3"
                      style={{ width: `${railPercent}%` }}
                    >
                      {railPercent > 20 && (
                        <span className="text-xs font-bold text-primary-foreground">{railPercent.toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.railQuantity} MT • {data.railOrders} orders</p>
                </div>

                {/* Road */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Road Transport</span>
                    <span className="text-lg font-bold text-secondary">{roadPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary/60 flex items-center justify-start pl-3"
                      style={{ width: `${roadPercent}%` }}
                    >
                      {roadPercent > 5 && (
                        <span className="text-xs font-bold text-secondary-foreground">{roadPercent.toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.roadQuantity} MT • {data.roadOrders} orders</p>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">TOTAL QUANTITY</p>
                  <p className="text-2xl font-bold text-foreground">{data.railQuantity + data.roadQuantity} MT</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">TOTAL COST</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{((data.railCost + data.roadCost) / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Comparison */}
            <div className="space-y-6">
              {/* Rail Details */}
              <div className="card-glow p-6 space-y-4 border-l-4 border-primary">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Rail Transport
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orders</span>
                    <span className="font-semibold text-foreground">{data.railOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-semibold text-foreground">{data.railQuantity} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Cost/MT</span>
                    <span className="font-semibold text-foreground">₹{(data.railCost / data.railQuantity).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-bold text-primary">₹{(data.railCost / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="space-y-2 pt-3">
                    <p className="text-xs font-semibold text-foreground">Advantages:</p>
                    <ul className="text-xs text-foreground/80 space-y-1">
                      <li>✓ Lower cost per tonne (₹350/MT)</li>
                      <li>✓ High volume consolidation</li>
                      <li>✓ Predictable SLA compliance</li>
                      <li>✓ Reduced demurrage risk</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Road Details */}
              <div className="card-glow p-6 space-y-4 border-l-4 border-secondary">
                <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Road Transport
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orders</span>
                    <span className="font-semibold text-foreground">{data.roadOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-semibold text-foreground">{data.roadQuantity} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Cost/MT</span>
                    <span className="font-semibold text-foreground">₹{(data.roadCost / data.roadQuantity).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-bold text-secondary">₹{(data.roadCost / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="space-y-2 pt-3">
                    <p className="text-xs font-semibold text-foreground">Use Cases:</p>
                    <ul className="text-xs text-foreground/80 space-y-1">
                      <li>✓ Urgent/short-haul routes</li>
                      <li>✓ Crane unavailability fallback</li>
                      <li>✓ Final-mile delivery</li>
                      <li>✓ Last-minute orders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-glow p-8 space-y-6 border-accent/20 bg-accent/5">
            <h2 className="text-2xl font-bold text-foreground">Optimization Recommendations</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Maximize Rail Utilization</p>
                  <p className="text-sm text-foreground/80">Current split is optimal: 94.8% rail, 5.2% road. Rail is more cost-effective for bulk volumes.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-yellow-500">!</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Monitor Road Orders</p>
                  <p className="text-sm text-foreground/80">2 orders on road due to crane unavailability. Consider advance capacity booking for next cycle.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">i</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Cost Savings Achieved</p>
                  <p className="text-sm text-foreground/80">Consolidation via rail saved ₹87,250 vs. full road transport (12.3% reduction).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="card-glow p-8 space-y-4 border-primary/20">
            <h2 className="text-xl font-bold text-foreground flex items-center justify-between">
              <span>Order Details by Mode</span>
              <Button variant="outline" className="gap-2 h-9">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Order ID</th>
                    <th className="text-left p-3 font-semibold text-foreground">Mode</th>
                    <th className="text-left p-3 font-semibold text-foreground">Destination</th>
                    <th className="text-right p-3 font-semibold text-foreground">Quantity (MT)</th>
                    <th className="text-right p-3 font-semibold text-foreground">Cost</th>
                    <th className="text-center p-3 font-semibold text-foreground">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "ORD-001", mode: "Rail", dest: "Delhi", qty: 45, cost: "15750", reason: "Consolidated in Rake R1" },
                    { id: "ORD-002", mode: "Rail", dest: "Mumbai", qty: 52, cost: "18200", reason: "Multi-destination rake" },
                    { id: "ORD-003", mode: "Road", dest: "Pune", qty: 34, cost: "12920", reason: "Crane unavailable at LP1" },
                    { id: "ORD-004", mode: "Rail", dest: "Bangalore", qty: 48, cost: "16800", reason: "High priority consolidation" },
                    { id: "ORD-005", mode: "Road", dest: "Hyderabad", qty: 34, cost: "12920", reason: "Urgent last-mile delivery" },
                  ].map((row) => (
                    <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                      <td className="p-3 font-medium text-foreground">{row.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.mode === "Rail" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                        }`}>
                          {row.mode}
                        </span>
                      </td>
                      <td className="p-3 text-foreground/80">{row.dest}</td>
                      <td className="p-3 text-right font-medium text-foreground">{row.qty} MT</td>
                      <td className="p-3 text-right text-foreground">₹{row.cost}</td>
                      <td className="p-3 text-center text-xs text-muted-foreground">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Steps */}
          <div className="flex gap-4 justify-center py-8">
            <Button className="btn-gradient h-12 px-8">
              Approve Split & Proceed
            </Button>
            <Button variant="outline" className="h-12 px-8 border-primary/30">
              View Reports
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
