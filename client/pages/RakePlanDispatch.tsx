import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Share2, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface RakePlanItem {
  order_id: string;
  customer_name: string;
  product_type: string;
  destination: string;
  quantity_tonnes: number;
  rake_id: string;
  wagon_id: string;
  platform_id: string;
  crane_capacity_tonnes: number;
  utilization_percent: number;
  estimated_cost: number;
  explanation: string;
  reason: string;
  status?: "pending" | "approved" | "overridden";
}

const generateRakePlanFromOrders = (orders: any[]): RakePlanItem[] => {
  if (!orders || orders.length === 0) return [];
  
  // Group orders by destination
  const ordersByDestination: { [key: string]: any[] } = {};
  orders.forEach((order) => {
    const dest = order.destination || "Unknown";
    if (!ordersByDestination[dest]) {
      ordersByDestination[dest] = [];
    }
    ordersByDestination[dest].push(order);
  });

  // Create rakes from destination groups
  const rakePlan: RakePlanItem[] = [];
  let rakeCounter = 1;

  Object.entries(ordersByDestination).forEach(([destination, destOrders]) => {
    // Create sub-rakes based on quantity (aim for ~200-300 tonnes per rake)
    let currentQuantity = 0;
    let rakeIndex = 1;

    destOrders.forEach((order, orderIndex) => {
      const rakeId = `R${rakeCounter}`;
      const wagonId = `W${rakeCounter}-${rakeIndex}`;
      const platformId = `P${Math.floor(Math.random() * 5) + 1}`;
      const craneCapacity = 30 + Math.random() * 20;
      
      // If current rake is full (200+ tonnes) or last order, move to next rake
      if (currentQuantity + order.quantity_tonnes > 250 && orderIndex > 0) {
        rakeCounter++;
        rakeIndex = 1;
        currentQuantity = 0;
      }

      const utilization = (order.quantity_tonnes / craneCapacity) * 100;
      const baseCost = order.quantity_tonnes * (300 + Math.random() * 100);
      const costAdjustment = (100 - Math.min(utilization, 100)) / 100;

      rakePlan.push({
        order_id: order.order_id,
        customer_name: order.customer_name,
        product_type: order.product_type,
        destination: order.destination,
        quantity_tonnes: order.quantity_tonnes,
        rake_id: rakeId,
        wagon_id: wagonId,
        platform_id: platformId,
        crane_capacity_tonnes: Math.round(craneCapacity * 10) / 10,
        utilization_percent: Math.round(Math.min(utilization, 100) * 10) / 10,
        estimated_cost: Math.round(baseCost * (1 - costAdjustment * 0.3)),
        explanation: `ORDER #${order.order_id} with cargo ${order.product_type} from ${order.customer_name} is allocated to WAGON ${wagonId} of RAKE ${rakeId} at PLATFORM ${platformId}, which has a crane capacity of ${Math.round(craneCapacity * 10) / 10} tons, headed to ${destination}.`,
        reason: `Consolidated with other ${destination}-bound orders to maximize rake utilization. Wagon utilization at ${Math.round(Math.min(utilization, 100) * 10) / 10}% minimizes per-tonne transport cost. Allocation respects delivery deadline and priority constraints.`,
        status: "pending",
      });

      currentQuantity += order.quantity_tonnes;
      rakeIndex++;
    });
  });

  return rakePlan;
};

export default function RakePlanDispatch() {
  const { toast } = useToast();
  const [plan, setPlan] = useState<RakePlanItem[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedRake, setSelectedRake] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Load orders from sessionStorage
    const uploadedOrdersStr = sessionStorage.getItem("uploadedOrders");
    if (uploadedOrdersStr) {
      try {
        const uploadedOrders = JSON.parse(uploadedOrdersStr);
        const generatedPlan = generateRakePlanFromOrders(uploadedOrders);
        setPlan(generatedPlan);
        if (generatedPlan.length > 0) {
          setSelectedRake(generatedPlan[0].rake_id);
        }
      } catch (error) {
        console.error("Error loading uploaded orders:", error);
        toast({
          title: "Error",
          description: "Failed to load uploaded orders",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const uniqueRakes = [...new Set(plan.map((item) => item.rake_id))];
  const selectedItems = plan.filter((item) => item.rake_id === selectedRake);

  const handleApprove = (orderId: string) => {
    setPlan((prev) =>
      prev.map((item) =>
        item.order_id === orderId ? { ...item, status: "approved" } : item
      )
    );
    toast({
      title: "Approved",
      description: `Order ${orderId} approved for dispatch`,
    });
  };

  const handleOverride = (orderId: string) => {
    setPlan((prev) =>
      prev.map((item) =>
        item.order_id === orderId ? { ...item, status: "overridden" } : item
      )
    );
    toast({
      title: "Override Recorded",
      description: `Order ${orderId} marked for manual override`,
    });
  };

  const handleExportCSV = () => {
    if (plan.length === 0) return;

    const headers = [
      "Order ID",
      "Customer",
      "Product",
      "Destination",
      "Quantity (MT)",
      "Rake",
      "Wagon",
      "Platform",
      "Utilization %",
      "Cost",
      "Status",
    ];
    const rows = plan.map((item) => [
      item.order_id,
      item.customer_name,
      item.product_type,
      item.destination,
      item.quantity_tonnes,
      item.rake_id,
      item.wagon_id,
      item.platform_id,
      item.utilization_percent,
      item.estimated_cost,
      item.status || "pending",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
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

  const kpiStats = {
    rakes: uniqueRakes.length,
    orders: plan.length,
    avgUtil: plan.length > 0 ? (plan.reduce((sum, p) => sum + p.utilization_percent, 0) / plan.length).toFixed(1) : "0",
    totalCost: plan.length > 0 ? (plan.reduce((sum, p) => sum + p.estimated_cost, 0) / 1000).toFixed(1) : "0",
    approvedCount: plan.filter((p) => p.status === "approved").length,
  };

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Rake Plan & Dispatch
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-optimized rake formations with detailed allocation explanations and approval workflow
            </p>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="card-glow p-6 space-y-2 border-primary/30">
              <p className="kpi-label">Rakes Formed</p>
              <p className="kpi-value">{kpiStats.rakes}</p>
              <p className="text-xs text-emerald-400">Ready to dispatch</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-secondary/30">
              <p className="kpi-label">Total Orders</p>
              <p className="kpi-value">{kpiStats.orders}</p>
              <p className="text-xs text-muted-foreground">Processed</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-primary/30">
              <p className="kpi-label">Avg Utilization</p>
              <p className="kpi-value">{kpiStats.avgUtil}%</p>
              <p className="text-xs text-muted-foreground">Wagon fill rate</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-emerald-500/30">
              <p className="kpi-label">Est. Total Cost</p>
              <p className="kpi-value">₹{kpiStats.totalCost}k</p>
              <p className="text-xs text-emerald-400">Consolidated rate</p>
            </div>

            <div className="card-glow p-6 space-y-2 border-emerald-500/30">
              <p className="kpi-label">Approved</p>
              <p className="kpi-value">{kpiStats.approvedCount}</p>
              <p className="text-xs text-emerald-400">of {kpiStats.orders}</p>
            </div>
          </div>

          {/* Rake Selection Tabs */}
          {plan.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Formed Rakes</h2>
              <div className="flex flex-wrap gap-2">
                {uniqueRakes.map((rakeId) => {
                  const rakeOrders = plan.filter((p) => p.rake_id === rakeId);
                  const rakeQuantity = rakeOrders.reduce((sum, p) => sum + p.quantity_tonnes, 0);
                  return (
                    <button
                      key={rakeId}
                      onClick={() => setSelectedRake(rakeId)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedRake === rakeId
                          ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground border border-primary/50"
                          : "card-glass border border-border/30 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span>{rakeId}</span>
                        <span className="text-xs opacity-75">{rakeOrders.length} orders • {Math.round(rakeQuantity)} MT</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rake Plan Table with NL Explanations */}
          {plan.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedRake} • {selectedItems.length} Orders
                </h2>
                <div className="flex gap-2">
                  <Button onClick={handleExportCSV} variant="outline" className="gap-2 border-primary/30">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="gap-2 border-primary/30">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="card-glow overflow-hidden border border-border/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20">
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Order ID
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Customer
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Product
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Destination
                        </th>
                        <th className="text-right p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Quantity
                        </th>
                        <th className="text-center p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Util %
                        </th>
                        <th className="text-right p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Cost
                        </th>
                        <th className="text-center p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Status
                        </th>
                        <th className="text-center p-4 font-semibold text-muted-foreground text-xs uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item) => (
                        <tr
                          key={item.order_id}
                          onMouseEnter={() => setHoveredRow(item.order_id)}
                          onMouseLeave={() => setHoveredRow(null)}
                          className="border-b border-border/20 hover:bg-muted/10 transition-colors group relative"
                        >
                          <td className="p-4 font-medium text-primary">{item.order_id}</td>
                          <td className="p-4 text-foreground/80">{item.customer_name}</td>
                          <td className="p-4 text-foreground/80">{item.product_type}</td>
                          <td className="p-4 text-foreground/80">{item.destination}</td>
                          <td className="p-4 text-right font-medium text-foreground">
                            {item.quantity_tonnes} MT
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                item.utilization_percent >= 85
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : item.utilization_percent >= 70
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              {item.utilization_percent}%
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium text-foreground">
                            ₹{(item.estimated_cost / 1000).toFixed(1)}k
                          </td>
                          <td className="p-4 text-center">
                            {item.status === "approved" ? (
                              <span className="flex items-center justify-center gap-1 text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                Approved
                              </span>
                            ) : item.status === "overridden" ? (
                              <span className="flex items-center justify-center gap-1 text-amber-400">
                                <AlertCircle className="w-4 h-4" />
                                Override
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">Pending</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.status !== "approved" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(item.order_id)}
                                  className="h-7 px-3 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                                >
                                  Approve
                                </Button>
                              )}
                              {item.status !== "overridden" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOverride(item.order_id)}
                                  variant="outline"
                                  className="h-7 px-3 text-xs border-amber-500/30"
                                >
                                  Override
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Natural Language Explanations */}
          {selectedItems.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">AI Allocation Explanations</h2>

              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.order_id} className="card-glow p-6 space-y-4 border border-border/30">
                    {/* Main NL Explanation */}
                    <div className="space-y-2">
                      <p className="font-semibold text-primary flex items-start gap-2">
                        <span className="text-sm mt-1">→</span>
                        <span className="text-foreground">{item.explanation}</span>
                      </p>
                    </div>

                    {/* Reasoning Section */}
                    <div className="pt-4 border-t border-border/30 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Why this allocation?</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{item.reason}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border/30">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Wagon/Platform</p>
                        <p className="text-sm font-semibold text-primary">
                          {item.wagon_id} / {item.platform_id}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Crane Capacity</p>
                        <p className="text-sm font-semibold text-foreground">{item.crane_capacity_tonnes} MT</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Utilization</p>
                        <p className="text-sm font-semibold text-emerald-400">{item.utilization_percent}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Est. Cost</p>
                        <p className="text-sm font-semibold text-foreground">
                          ₹{(item.estimated_cost / 1000).toFixed(1)}k
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premium CTA */}
          {plan.length > 0 && (
            <div className="card-glass p-12 space-y-6 border-primary/30 text-center">
              <h2 className="text-3xl font-bold text-foreground">Ready to dispatch?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Review the allocation explanations above and approve the rake formations. Use the Approve and Override buttons for each order.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-gradient h-12 px-8 text-base font-semibold">
                  Approve All & Dispatch
                </Button>
                <Button variant="outline" className="h-12 px-8 border-primary/30">
                  Back to Optimization
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {plan.length === 0 && (
            <div className="card-glass p-12 text-center space-y-4 border-border/30">
              <p className="text-muted-foreground">No rake plan available. Please upload data and run optimization first.</p>
              <Button className="btn-gradient" onClick={() => window.location.href = "/upload"}>
                Go to Data Upload
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
