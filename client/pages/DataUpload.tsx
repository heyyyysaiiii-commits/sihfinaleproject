import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileUp, CheckCircle, AlertCircle, Play } from "lucide-react";
import { DATA_SCHEMAS, SampleDatasetResponse, UploadDataResponse } from "@shared/api";
import { useQuery } from "@tanstack/react-query";

export default function DataUpload() {
  const [uploadedData, setUploadedData] = useState<Record<string, any>>({});
  const [validationResult, setValidationResult] = useState<UploadDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample dataset
  const { data: sampleDataset } = useQuery({
    queryKey: ["sample-dataset"],
    queryFn: async () => {
      const res = await fetch("/api/sample-dataset");
      return res.json() as Promise<SampleDatasetResponse>;
    },
  });

  const handleLoadSampleData = async () => {
    if (!sampleDataset) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/upload-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleDataset),
      });

      const result = (await response.json()) as UploadDataResponse;
      setUploadedData(sampleDataset);
      setValidationResult(result);
    } catch (error) {
      console.error("Failed to load sample data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) => f.type === "text/csv");

    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setIsLoading(true);
    try {
      const data: Record<string, any> = {};

      for (const file of files) {
        const text = await file.text();
        const rows = parseCSV(text);
        const fileName = file.name.replace(".csv", "").toLowerCase();

        if (fileName.includes("stockyard")) {
          data.stockyards = rows;
        } else if (fileName.includes("order")) {
          data.orders = rows;
        } else if (fileName.includes("rake")) {
          data.rakes = rows;
        } else if (fileName.includes("product") || fileName.includes("wagon")) {
          data.product_wagon_matrix = rows;
        } else if (fileName.includes("loading")) {
          data.loading_points = rows;
        } else if (fileName.includes("route") || fileName.includes("cost")) {
          data.routes_costs = rows;
        }
      }

      // Validate the upload
      const response = await fetch("/api/upload-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as UploadDataResponse;
      setUploadedData(data);
      setValidationResult(result);
    } catch (error) {
      console.error("Failed to process files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSV = (text: string): Record<string, any>[] => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, any> = {};
      headers.forEach((header, idx) => {
        let value: any = values[idx];
        if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (!isNaN(Number(value)) && value !== "") value = Number(value);
        row[header] = value;
      });
      return row;
    });
    return rows;
  };

  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <div className="min-h-full bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Panel: Upload Zone */}
              <div className="lg:col-span-1">
                <Card className="h-full border-dashed border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload Dataset
                    </CardTitle>
                    <CardDescription>
                      Drag and drop CSV files or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Drag Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <FileUp className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Drag files here</p>
                      <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Supported Files */}
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-2">Expected Files:</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>✓ stockyards.csv</li>
                        <li>✓ orders.csv</li>
                        <li>✓ rakes.csv</li>
                        <li>✓ product_wagon_matrix.csv</li>
                        <li>✓ loading_points.csv</li>
                        <li>✓ routes_costs.csv</li>
                      </ul>
                    </div>

                    {/* Sample Data Button */}
                    <Button
                      onClick={handleLoadSampleData}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Use Sample Dataset
                    </Button>

                    {/* Validation Status */}
                    {validationResult && (
                      <div className="space-y-2">
                        {validationResult.success ? (
                          <Alert className="bg-green-500/10 border-green-500/30">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertDescription className="text-green-800 dark:text-green-400">
                              Data validation passed! Ready to optimize.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="bg-red-500/10 border-red-500/30">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <AlertDescription className="text-red-800 dark:text-red-400">
                              Validation failed. Check errors below.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* Upload Stats */}
                    {Object.keys(uploadedData).length > 0 && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs font-semibold mb-1">Uploaded:</p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {validationResult?.validation_results &&
                            Object.entries(validationResult.validation_results).map(
                              ([name, result]) => (
                                <li key={name}>
                                  {result.errors.length === 0 ? "✓" : "✗"} {name}: {result.rows}{" "}
                                  rows
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel: Expected Schema */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Expected Schema</CardTitle>
                    <CardDescription>CSV column definitions and requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="stockyards" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                        {Object.keys(DATA_SCHEMAS).map((key) => (
                          <TabsTrigger key={key} value={key} className="text-xs">
                            {key.replace(/_/g, " ")}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Object.entries(DATA_SCHEMAS).map(([key, schema]) => (
                        <TabsContent key={key} value={key} className="space-y-4">
                          <p className="text-sm text-muted-foreground">{schema.description}</p>

                          {/* Columns Table */}
                          <div className="overflow-x-auto border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-secondary/50">
                                  <TableHead className="font-semibold">Column Name</TableHead>
                                  <TableHead className="font-semibold">Type</TableHead>
                                  <TableHead className="font-semibold">Required</TableHead>
                                  <TableHead className="font-semibold">Example</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {schema.columns.map((col, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-mono text-xs">{col.name}</TableCell>
                                    <TableCell className="text-xs">
                                      <code className="bg-secondary/50 px-2 py-1 rounded">
                                        {col.type}
                                      </code>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {col.required ? (
                                        <span className="text-red-600 font-semibold">Required</span>
                                      ) : (
                                        <span className="text-muted-foreground">Optional</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                      {String(col.example)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Sample Row */}
                          <div className="bg-secondary/30 rounded-lg p-4">
                            <p className="text-sm font-semibold mb-2">Sample Row (JSON):</p>
                            <pre className="text-xs overflow-x-auto bg-background rounded p-3 border">
                              {JSON.stringify(schema.sample_row, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Validation Errors */}
            {validationResult &&
              validationResult.validation_results &&
              Object.values(validationResult.validation_results).some((r) => r.errors.length > 0) && (
                <Card className="mt-6 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Validation Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(validationResult.validation_results).map(
                        ([name, result]) =>
                          result.errors.length > 0 && (
                            <div key={name} className="space-y-1">
                              <p className="font-semibold text-sm">{name}:</p>
                              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 ml-4">
                                {result.errors.map((err, idx) => (
                                  <li key={idx}>• {err}</li>
                                ))}
                              </ul>
                            </div>
                          )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
