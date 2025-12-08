import { Layout } from "@/components/Layout";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Play,
  RotateCw,
} from "lucide-react";
import { useState } from "react";

type UploadStep = "upload" | "mapping" | "validation" | "results";

export default function DataImport() {
  const [step, setStep] = useState<UploadStep>("upload");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Simulate file processing
      setTimeout(() => setStep("mapping"), 500);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Import</h1>
          <p className="text-muted-foreground mt-1">
            Import your plant stock, orders, wagon logs, and run optimization
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4">
          {[
            { id: "upload", label: "Upload" },
            { id: "mapping", label: "Schema Mapping" },
            { id: "validation", label: "Validation" },
            { id: "results", label: "Results" },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setStep(s.id as UploadStep)}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                  ["upload", "mapping", "validation", "results"].indexOf(step) >=
                  idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </button>
              {idx < 3 && (
                <div className="w-12 h-1 mx-2 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === "upload" && (
          <div className="bg-card border border-border rounded-lg p-12">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Your Data
              </h2>
              <p className="text-muted-foreground mb-8">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>

              <label className="block border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="space-y-2">
                  <p className="text-primary font-semibold">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV or Excel files up to 100MB
                  </p>
                </div>
              </label>

              <div className="mt-8 space-y-4 text-left">
                <h3 className="font-semibold text-foreground">
                  Expected data structure:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Plant Stock (Grade, Quantity, Date)</li>
                  <li>• Pending Orders (Customer, Grade, Qty, Deadline)</li>
                  <li>• Wagon Availability (Type, Count, Location)</li>
                  <li>• Historical Rake Logs (Route, Date, Performance)</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setFileName("sample_data.xlsx");
                  setStep("mapping");
                }}
                className="mt-8 w-full py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/10 font-medium transition-colors"
              >
                Try Sample Data
              </button>
            </div>
          </div>
        )}

        {step === "mapping" && (
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Schema Mapping
            </h2>
            <p className="text-muted-foreground mb-8">
              File: <span className="font-semibold text-foreground">{fileName}</span>
            </p>

            <div className="space-y-6">
              {[
                {
                  name: "Plant Stock Sheet",
                  fields: [
                    { col: "A", mapped: "Product Grade" },
                    { col: "B", mapped: "Quantity (Tonnes)" },
                    { col: "C", mapped: "Date" },
                  ],
                },
                {
                  name: "Pending Orders Sheet",
                  fields: [
                    { col: "A", mapped: "Customer Name" },
                    { col: "B", mapped: "Product Grade" },
                    { col: "C", mapped: "Order Qty (T)" },
                    { col: "D", mapped: "Delivery Deadline" },
                  ],
                },
                {
                  name: "Wagon Availability",
                  fields: [
                    { col: "A", mapped: "Wagon Type" },
                    { col: "B", mapped: "Count Available" },
                    { col: "C", mapped: "Current Location" },
                  ],
                },
              ].map((sheet) => (
                <div key={sheet.name} className="border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    {sheet.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sheet.fields.map((field) => (
                      <div key={field.col} className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Column {field.col}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-foreground font-medium">
                            {field.mapped}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep("upload")}
                className="px-6 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted/50 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("validation")}
                className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
              >
                Continue to Validation
              </button>
            </div>
          </div>
        )}

        {step === "validation" && (
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Data Validation
            </h2>

            <div className="space-y-6">
              <ValidationItem
                name="Plant Stock Data"
                status="valid"
                records={1245}
                errors={0}
              />
              <ValidationItem
                name="Pending Orders"
                status="valid"
                records={342}
                errors={0}
              />
              <ValidationItem
                name="Wagon Availability"
                status="valid"
                records={892}
                errors={0}
              />
              <ValidationItem
                name="Historical Logs"
                status="warning"
                records={5680}
                errors={3}
              />
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Ready to Optimize
              </h3>
              <p className="text-sm text-blue-800">
                All data has been validated. You can now run the optimization
                algorithm to generate optimal rake formation plans.
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep("mapping")}
                className="px-6 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted/50 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("results")}
                className="flex-1 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run Optimization
              </button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Optimization Results
                </h2>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <ResultMetric
                  label="Total Rakes Formed"
                  value="14"
                  subtext="Optimized configuration"
                />
                <ResultMetric
                  label="Cost Reduction"
                  value="₹1.8M"
                  subtext="vs current plan"
                />
                <ResultMetric
                  label="SLA Improvement"
                  value="18%"
                  subtext="Faster deliveries"
                />
                <ResultMetric
                  label="Wagon Utilization"
                  value="94.2%"
                  subtext="Better load matching"
                />
              </div>
            </div>

            {/* Recommended Rake Plans */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Recommended Rake Plans
              </h3>

              <div className="space-y-4">
                {[
                  {
                    id: "RAKE-001",
                    route: "Bokaro → CMO → Cust A",
                    rakes: 3,
                    capacity: 92,
                    cost: "₹2.4L",
                  },
                  {
                    id: "RAKE-002",
                    route: "Bokaro → CMO → Cust B",
                    rakes: 2,
                    capacity: 88,
                    cost: "₹1.8L",
                  },
                  {
                    id: "RAKE-003",
                    route: "Bokaro → CMO → Cust C",
                    rakes: 4,
                    capacity: 95,
                    cost: "₹3.2L",
                  },
                  {
                    id: "RAKE-004",
                    route: "Bokaro → CMO (Buffer)",
                    rakes: 5,
                    capacity: 85,
                    cost: "₹3.8L",
                  },
                ].map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {plan.id}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.route}
                        </p>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div>
                          <p className="text-muted-foreground">Wagons</p>
                          <p className="font-semibold text-foreground">
                            {plan.rakes}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Capacity</p>
                          <p className="font-semibold text-foreground">
                            {plan.capacity}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Cost</p>
                          <p className="font-semibold text-foreground">
                            {plan.cost}
                          </p>
                        </div>
                        <button className="px-3 py-1.5 border border-border rounded hover:bg-muted/50 text-sm font-medium text-foreground transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Import New Data
              </button>
              <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export Rake Plan (CSV)
              </button>
              <button className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-semibold transition-colors">
                Deploy to Production
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

interface ValidationItemProps {
  name: string;
  status: "valid" | "warning" | "error";
  records: number;
  errors: number;
}

function ValidationItem({
  name,
  status,
  records,
  errors,
}: ValidationItemProps) {
  const statusConfig = {
    valid: { bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2, color: "text-green-700" },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: AlertCircle,
      color: "text-yellow-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertCircle,
      color: "text-red-700",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`border ${config.border} ${config.bg} rounded-lg p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <div className="flex-1">
          <p className={`font-semibold ${config.color}`}>{name}</p>
          <p className={`text-sm ${config.color}`}>
            {records.toLocaleString()} records {errors > 0 ? `• ${errors} errors` : ""}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bg} border ${config.border}`}>
          {status === "valid" ? "Valid" : status === "warning" ? "Warning" : "Error"}
        </span>
      </div>
    </div>
  );
}

interface ResultMetricProps {
  label: string;
  value: string;
  subtext: string;
}

function ResultMetric({ label, value, subtext }: ResultMetricProps) {
  return (
    <div className="border border-border rounded-lg p-4">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
