import { z } from "zod";

export type ChartType = "area" | "line" | "bar" | "pie" | "radar" | "radial";

export const ChartFieldSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
});

export const ChartConfigSchema = z.object({
  id: z.string(),
  type: z.enum(["area", "line", "bar", "pie", "radar", "radial"]),
  xKey: z.string().optional(),
  yKeys: z.array(z.string()).optional(),
  stacked: z.boolean().optional(),
  stackedExpanded: z.boolean().optional(),
  stepped: z.boolean().optional(),
  legend: z.boolean().optional(),
  gradient: z.boolean().optional(),
  colors: z.record(z.string(), z.string()).optional(),
  // Area/Line specific options
  showIcons: z.boolean().optional(),
  customAxes: z.boolean().optional(),
  showDots: z.boolean().optional(),
  // Bar specific options
  barLayout: z.enum(["horizontal", "vertical"]).optional(),
  barLabel: z.boolean().optional(),
  // Pie specific options
  donut: z.boolean().optional(),
  showLabels: z.boolean().optional(),
  // Radar specific options
  showGrid: z.boolean().optional(),
  // Mixed overlays
  lineKeys: z.array(z.string()).optional(),
  axis: z.object({
    x: z.any().optional(),
    y: z.any().optional(),
  }).optional(),
  tooltip: z.object({
    enabled: z.boolean(),
    formatters: z.record(z.string(), z.string()).optional(),
  }).optional(),
  theme: z.enum(["system", "light", "dark"]).optional(),
  size: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
});

export const DatasetSchema = z.object({
  fields: z.array(ChartFieldSchema),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.date()]))),
});

export type ChartField = z.infer<typeof ChartFieldSchema>;
export type ChartConfig = z.infer<typeof ChartConfigSchema>;
export type Dataset = z.infer<typeof DatasetSchema>;

// Helper functions for type inference and coercion
export function inferDataType(value: string): "number" | "date" | "string" {
  // Try to parse as number
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return "number";
  }
  
  // Try to parse as date
  const date = new Date(value);
  if (!isNaN(date.getTime()) && value.match(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/)) {
    return "date";
  }
  
  return "string";
}

export function coerceValue(value: string, type: "number" | "date" | "string"): string | number | Date {
  switch (type) {
    case "number":
      return Number(value);
    case "date":
      return new Date(value);
    default:
      return value;
  }
}

export function generateChartId(): string {
  return Math.random().toString(36).substring(2, 15);
}
