import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function RailRoadSplit() {
  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Rail vs Road Split
            </h1>
            <p className="text-lg text-muted-foreground">
              Transport mode allocation and cost-benefit analysis
            </p>
          </div>

          {/* Distribution Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rail */}
            <div className="card-glow p-8 space-y-6 border-primary/30">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Rail Transport
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Quantity Distribution</span>
                    <span className="text-primary font-bold">94.8%</span>
                  </div>
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: "94.8%" }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold text-primary">18</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-2xl font-bold text-primary">1,245 MT</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Cost/MT</p>
                    <p className="text-2xl font-bold text-primary">₹350</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Advantages</p>
                  <ul className="text-sm text-foreground/80 space-y-1">
                    <li>✓ Lowest cost per tonne</li>
                    <li>✓ High volume consolidation</li>
                    <li>✓ Predictable SLA compliance</li>
                    <li>✓ Reduced demurrage risk</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Road */}
            <div className="card-glow p-8 space-y-6 border-secondary/30">
              <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Road Transport
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Quantity Distribution</span>
                    <span className="text-secondary font-bold">5.2%</span>
                  </div>
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: "5.2%" }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold text-secondary">2</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-2xl font-bold text-secondary">68 MT</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Cost/MT</p>
                    <p className="text-2xl font-bold text-secondary">₹765</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Use Cases</p>
                  <ul className="text-sm text-foreground/80 space-y-1">
                    <li>✓ Urgent/short-haul routes</li>
                    <li>✓ Crane unavailability fallback</li>
                    <li>✓ Final-mile delivery</li>
                    <li>✓ Last-minute orders</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Summary & Recommendations */}
          <div className="card-glass p-8 space-y-6 border-primary/30">
            <h2 className="text-2xl font-bold text-foreground">Cost Savings Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Baseline Cost (100% Road)</p>
                <p className="text-3xl font-bold text-foreground">₹1,313k</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Optimized Cost (94% Rail)</p>
                <p className="text-3xl font-bold text-primary">₹487k</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-3xl font-bold text-emerald-400">₹826k (63%)</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
