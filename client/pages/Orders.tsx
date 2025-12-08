import { Layout } from "@/components/Layout";
import { ChevronDown, Plus } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  material: string;
  qty: number;
  dueDate: string;
  priority: "high" | "medium" | "low";
  aiRecommendation: string;
  selectedMode: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Delhi Steel Mills",
    material: "HR Coils",
    qty: 80,
    dueDate: "2024-01-20",
    priority: "high",
    aiRecommendation: "Rail - RAKE-001",
    selectedMode: "Rail - RAKE-001",
  },
  {
    id: "ORD-002",
    customer: "Delhi Plates Ltd",
    material: "Slabs",
    qty: 160,
    dueDate: "2024-01-21",
    priority: "high",
    aiRecommendation: "Rail - RAKE-001",
    selectedMode: "Rail - RAKE-001",
  },
  {
    id: "ORD-003",
    customer: "Mumbai Steel",
    material: "Billets",
    qty: 100,
    dueDate: "2024-01-22",
    priority: "medium",
    aiRecommendation: "Rail - RAKE-002",
    selectedMode: "Rail - RAKE-002",
  },
  {
    id: "ORD-004",
    customer: "Ahmedabad Mills",
    material: "HR Coils",
    qty: 98,
    dueDate: "2024-01-23",
    priority: "medium",
    aiRecommendation: "Rail - RAKE-002",
    selectedMode: "Rail - RAKE-002",
  },
  {
    id: "ORD-005",
    customer: "Ahmedabad Steel",
    material: "Iron Ore",
    qty: 156,
    dueDate: "2024-01-20",
    priority: "high",
    aiRecommendation: "Rail - RAKE-003",
    selectedMode: "Rail - RAKE-003",
  },
  {
    id: "ORD-006",
    customer: "Chennai Steel Works",
    material: "Slabs",
    qty: 184,
    dueDate: "2024-01-24",
    priority: "low",
    aiRecommendation: "Rail - RAKE-004",
    selectedMode: "Rail - RAKE-004",
  },
];

export default function Orders() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-2">
              Pending customer orders with AI allocation recommendations
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 font-semibold transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Order
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Priorities</option>
            <option>High Priority</option>
            <option>Medium Priority</option>
            <option>Low Priority</option>
          </select>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Customers</option>
            <option>Delhi Steel Mills</option>
            <option>Mumbai Steel</option>
            <option>Ahmedabad Mills</option>
            <option>Chennai Steel Works</option>
          </select>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Materials</option>
            <option>HR Coils</option>
            <option>Slabs</option>
            <option>Billets</option>
            <option>Iron Ore</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Material
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Qty (T)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    AI Recommendation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Your Selection
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-background/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {order.material}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                      {order.qty}T
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {order.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : order.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {order.priority.charAt(0).toUpperCase() +
                          order.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary font-semibold">
                          {order.aiRecommendation}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (AI)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        defaultValue={order.selectedMode}
                        className="px-3 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>Rail - RAKE-001</option>
                        <option>Rail - RAKE-002</option>
                        <option>Rail - RAKE-003</option>
                        <option>Rail - RAKE-004</option>
                        <option>Road - Transport A</option>
                        <option>Road - Transport B</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Total Orders"
            value={mockOrders.length}
            subtext={`${mockOrders.reduce((sum, o) => sum + o.qty, 0)}T material`}
          />
          <StatCard
            label="High Priority"
            value={mockOrders.filter((o) => o.priority === "high").length}
            subtext="Require immediate dispatch"
          />
          <StatCard
            label="Rail Allocation"
            value={mockOrders.filter((o) => o.selectedMode.startsWith("Rail")).length}
            subtext="orders on rails"
          />
          <StatCard
            label="Road Allocation"
            value={mockOrders.filter((o) => o.selectedMode.startsWith("Road")).length}
            subtext="orders by road"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 font-bold transition-all">
            Finalize Order Allocations
          </button>
          <button className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-background font-semibold transition-colors">
            Reset to AI Recommendations
          </button>
        </div>
      </div>
    </Layout>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  subtext: string;
}

function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
