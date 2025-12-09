/**
 * CSV Template generator for downloading sample files
 */

import { DATA_SCHEMAS } from "@shared/api";

export function generateCSVTemplate(fileType: string): string {
  const schema = DATA_SCHEMAS[fileType];
  if (!schema) return "";

  // Generate header row
  const headers = schema.columns.map(col => col.name).join(',');
  
  // Generate sample rows
  const sampleRows: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const row = schema.columns.map(col => {
      let value = col.example;
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return String(value);
    });
    sampleRows.push(row.join(','));
  }

  return [headers, ...sampleRows].join('\n');
}

export function downloadCSVTemplate(fileType: string, fileName: string): void {
  const csv = generateCSVTemplate(fileType);
  if (!csv) return;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const fileTypeDisplayNames: Record<string, string> = {
  stockyards: "stockyards.csv",
  orders: "orders.csv",
  rakes: "rakes.csv",
  product_wagon_matrix: "product_wagon_matrix.csv",
  loading_points: "loading_points.csv",
  routes_costs: "routes_costs.csv",
};
