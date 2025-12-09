import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload } from "lucide-react";
import { useState } from "react";

export default function DataInput() {
  const [uploadedFiles, setUploadedFiles] = useState<Set<number>>(new Set());

  const files = [
    {
      id: 1,
      name: "orders.csv",
      purpose: "Customer demand — what orders need to be delivered",
      columns: [
        "order_id",
        "customer_id",
        "destination",
        "material_id",
        "quantity_tonnes",
        "priority (1-5, where 1 is highest)",
        "due_date",
        "penalty_rate_per_day",
      ],
      example: {
        order_id: "ORD_2024_001",
        customer: "ABC Pipes Ltd",
        destination: "Delhi",
        material: "Hot Rolled Coil (HRC)",
        quantity: "28.5 tonnes",
        priority: "1 (High)",
        due_date: "2024-01-17",
        penalty: "₹500/day late",
      },
    },
    {
      id: 2,
      name: "stockyards.csv",
      purpose: "Current inventory — what materials are available where",
      columns: [
        "stockyard_id",
        "stockyard_name",
        "material_id",
        "available_tonnage",
        "safety_stock_tonnage",
        "loading_point_id",
      ],
      example: {
        stockyard: "BOKARO_SY_1",
        location: "Bokaro Plant Yard-1",
        material: "HRC",
        available: "450.5 tonnes",
        safety_stock: "50 tonnes",
        loading: "BOKARO_LP_1",
      },
    },
    {
      id: 3,
      name: "rakes.csv",
      purpose: "Train composition — available rakes and their wagon capacity",
      columns: [
        "rake_id",
        "wagon_type (BOXN/BOXX/etc)",
        "num_wagons",
        "per_wagon_capacity_tonnes",
        "total_capacity_tonnes",
        "available_from_time",
        "current_location",
      ],
      example: {
        rake: "RAKE_001",
        wagon_type: "BOXN",
        wagons: "34",
        per_wagon: "28 tonnes",
        total: "952 tonnes",
        available: "2024-01-14 08:00",
        location: "Bokaro",
      },
    },
    {
      id: 4,
      name: "product_wagon_matrix.csv",
      purpose: "Compatibility rules — which materials fit in which wagons",
      columns: [
        "material_id",
        "wagon_type",
        "max_load_per_wagon_tonnes",
        "allowed (Yes/No)",
      ],
      example: {
        material: "HRC",
        wagon: "BOXN",
        max_load: "28",
        allowed: "Yes",
      },
    },
    {
      id: 5,
      name: "loading_points.csv",
      purpose: "Loading constraints — how fast each stockyard can load trains",
      columns: [
        "loading_point_id",
        "stockyard_id",
        "max_rakes_per_day",
        "loading_rate_tonnes_per_hour",
        "operating_hours_start",
        "operating_hours_end",
      ],
      example: {
        lp_id: "BOKARO_LP_1",
        stockyard: "BOKARO_SY_1",
        max_rakes: "5",
        rate: "120 tonnes/hour",
        start: "08:00 (8 AM)",
        end: "20:00 (8 PM)",
      },
    },
    {
      id: 6,
      name: "routes_costs.csv",
      purpose: "Transport & cost parameters — rates and times for each route",
      columns: [
        "origin",
        "destination",
        "mode (rail/road)",
        "distance_km",
        "transit_time_hours",
        "cost_per_tonne",
        "idle_freight_cost_per_hour",
      ],
      example: {
        from: "Bokaro",
        to: "Delhi",
        mode: "rail",
        distance: "1485 km",
        transit: "48 hours",
        cost: "₹280/tonne",
        idle: "₹45/hour",
      },
    },
  ];

  const handleUploadFile = (fileId: number) => {
    setUploadedFiles((prev) => new Set(prev).add(fileId));
  };

  const handleUseSampleData = () => {
    setUploadedFiles(new Set([1, 2, 3, 4, 5, 6]));
  };

  const allUploaded = uploadedFiles.size === 6;

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Data Input Requirements</h1>
            <p className="text-lg text-muted-foreground">
              The system needs 6 CSV files to create an optimal rake plan. Each file has a specific purpose and required columns.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>✅ Upload Status:</strong> {uploadedFiles.size} of 6 files loaded
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(uploadedFiles.size / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* File Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {files.map((file) => (
              <div key={file.id} className="card-glow p-6 space-y-4">
                {/* File Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{file.id}. {file.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{file.purpose}</p>
                  </div>
                  {uploadedFiles.has(file.id) && (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                </div>

                {/* Required Columns */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Required Columns:</p>
                  <div className="space-y-1">
                    {file.columns.map((col, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-primary text-xs font-bold mt-0.5">•</span>
                        <code className="text-xs text-foreground/80 bg-muted/20 px-2 py-1 rounded">
                          {col}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Row */}
                <div className="frosted-glass p-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Example:</p>
                  <div className="space-y-0.5 text-xs">
                    {Object.entries(file.example).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-foreground/80">
                        <span className="opacity-70">{key}:</span>
                        <span className="font-medium text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Button */}
                <Button
                  onClick={() => handleUploadFile(file.id)}
                  disabled={uploadedFiles.has(file.id)}
                  variant={uploadedFiles.has(file.id) ? "outline" : "default"}
                  className={
                    uploadedFiles.has(file.id)
                      ? "w-full opacity-50"
                      : "btn-gradient w-full"
                  }
                >
                  {uploadedFiles.has(file.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Loaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="card-glow p-8 space-y-4 border-primary/40">
            <p className="text-center text-foreground">
              Ready to proceed? Choose one of these options:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="btn-gradient h-12 px-8 flex items-center gap-2"
                disabled={!allUploaded}
              >
                <CheckCircle className="w-5 h-5" />
                All Files Uploaded - Proceed to Optimization
              </Button>
              <Button
                onClick={handleUseSampleData}
                variant="outline"
                className="h-12 px-8 border-primary/30 hover:border-primary/60"
              >
                Use Sample Dataset
              </Button>
            </div>
            {allUploaded && (
              <div className="text-center text-green-400 text-sm font-semibold">
                ✅ All files loaded successfully! You can now proceed to optimize.
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="card-glow p-6 border-primary/20">
            <p className="text-sm text-foreground/80">
              <strong>💡 Tip:</strong> If you don't have real data yet, use the "Sample Dataset" button above. 
              It loads example SAIL Bokaro data so you can see how the system works. Later, you can upload your real data files.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
