import { Layout } from "@/components/Layout";
import { BarChart3, TrendingDown, Zap, AlertTriangle, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Today's dispatch metrics and optimization overview
            </p>
          </div>
          <Link
            to="/rake-planner"
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 font-semibold transition-all"
          >
            Open Rake Planner
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard
            title="Dispatches Planned"
            value="12"
            subtitle="rakes ready today"
            icon={Truck}
            trend="+3 from yesterday"
            color="text-primary"
          />
          <KPICard
            title="Cost Saved"
            value="₹2.4M"
            subtitle="vs baseline plan"
            icon={DollarSign}
            trend="+18% optimization"
            color="text-green-500"
          />
          <KPICard
            title="Rake Utilization"
            value="94.2%"
            subtitle="average across all rakes"
            icon={BarChart3}
            trend="+2.1% this week"
            color="text-primary"
          />
          <KPICard
            title="SLA at Risk"
            value="2"
            subtitle="orders with tight windows"
            icon={AlertTriangle}
            trend="3 flagged for priority"
            color="text-warning"
          />
          <KPICard
            title="Demurrage Avoided"
            value="₹840K"
            subtitle="through optimization"
            icon={Zap}
            trend="This month"
            color="text-primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Optimize Today's Plan"
            description="Automatically generate optimal dispatch rakes based on current inventory and orders"
            action="Run Optimization"
            href="/rake-planner"
            icon={BarChart3}
            primary
          />
          <ActionCard
            title="View Orders"
            description="See all pending customer orders, due dates, and priority levels"
            action="Go to Orders"
            href="/orders"
            icon={Package}
          />
          <ActionCard
            title="Check Inventory"
            description="Monitor available materials across all stockyards and loading points"
            action="Go to Stockyards"
            href="/stockyards"
            icon={Warehouse}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Today's Dispatch Summary
          </h2>

          <div className="space-y-4">
            {[
              {
                id: "RAKE-001",
                status: "Ready",
                destination: "Delhi",
                qty: "240T",
                cost: "₹12.4L",
                sla: "On-Time",
              },
              {
                id: "RAKE-002",
                status: "Loading",
                destination: "Mumbai",
                qty: "198T",
                cost: "₹10.2L",
                sla: "On-Time",
              },
              {
                id: "RAKE-003",
                status: "Optimizing",
                destination: "Ahmedabad",
                qty: "156T",
                cost: "₹8.1L",
                sla: "Tight",
              },
              {
                id: "RAKE-004",
                status: "Queued",
                destination: "Chennai",
                qty: "184T",
                cost: "₹9.8L",
                sla: "On-Time",
              },
            ].map((rake) => (
              <div
                key={rake.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg hover:border-primary/50 border border-border transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      {rake.id}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rake.status === "Ready"
                        ? "bg-green-500/20 text-green-400"
                        : rake.status === "Loading"
                          ? "bg-blue-500/20 text-blue-400"
                          : rake.status === "Optimizing"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {rake.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    → {rake.destination}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-foreground">{rake.qty}</p>
                  <p className="text-xs text-muted-foreground">{rake.cost}</p>
                  <p className={`text-xs font-medium ${
                    rake.sla === "On-Time"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}>
                    {rake.sla} SLA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  color: string;
}

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          <p className="text-xs text-primary mt-2 font-medium">{trend}</p>
        </div>
        <Icon className={`w-8 h-8 ${color} opacity-80`} />
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}

function ActionCard({
  title,
  description,
  action,
  href,
  icon: Icon,
  primary,
}: ActionCardProps) {
  return (
    <Link
      to={href}
      className={`p-6 rounded-lg border transition-all ${
        primary
          ? "bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 hover:border-primary"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <Icon
        className={`w-6 h-6 mb-3 ${primary ? "text-primary" : "text-muted-foreground"}`}
      />
      <h3 className="font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <span className={`inline-block px-3 py-1.5 rounded text-sm font-medium transition-colors ${
        primary
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-muted text-foreground hover:bg-muted/80"
      }`}>
        {action} →
      </span>
    </Link>
  );
}

function Truck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
    </svg>
  );
}

function Warehouse({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}
