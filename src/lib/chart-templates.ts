import { ChartConfig, Dataset } from "./schema";

export interface ChartTemplate {
  id: string;
  title: string;
  description: string;
  config: Omit<ChartConfig, "id">;
  dataset: Dataset;
  category: "area" | "bar" | "line" | "pie" | "radar" | "radial";
}

// Sample data for area charts
const areaChartData = {
  basic: {
    fields: [
      { key: "month", label: "Month" },
      { key: "desktop", label: "Desktop" },
    ],
    rows: [
      { month: "January", desktop: 186 },
      { month: "February", desktop: 305 },
      { month: "March", desktop: 237 },
      { month: "April", desktop: 73 },
      { month: "May", desktop: 209 },
      { month: "June", desktop: 214 },
    ],
  },
  interactive: {
    fields: [
      { key: "date", label: "Date" },
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
    ],
    rows: [
      { date: "2024-04-01", desktop: 222, mobile: 150 },
      { date: "2024-04-02", desktop: 97, mobile: 180 },
      { date: "2024-04-03", desktop: 167, mobile: 120 },
      { date: "2024-04-04", desktop: 242, mobile: 260 },
      { date: "2024-04-05", desktop: 373, mobile: 290 },
      { date: "2024-04-06", desktop: 301, mobile: 340 },
      { date: "2024-04-07", desktop: 245, mobile: 180 },
      { date: "2024-04-08", desktop: 409, mobile: 320 },
      { date: "2024-04-09", desktop: 59, mobile: 110 },
      { date: "2024-04-10", desktop: 261, mobile: 190 },
      { date: "2024-04-11", desktop: 327, mobile: 350 },
      { date: "2024-04-12", desktop: 292, mobile: 210 },
      { date: "2024-04-13", desktop: 342, mobile: 380 },
      { date: "2024-04-14", desktop: 137, mobile: 220 },
      { date: "2024-04-15", desktop: 120, mobile: 170 },
      { date: "2024-04-16", desktop: 138, mobile: 190 },
      { date: "2024-04-17", desktop: 446, mobile: 360 },
      { date: "2024-04-18", desktop: 364, mobile: 410 },
      { date: "2024-04-19", desktop: 243, mobile: 180 },
      { date: "2024-04-20", desktop: 89, mobile: 150 },
      { date: "2024-04-21", desktop: 137, mobile: 230 },
      { date: "2024-04-22", desktop: 224, mobile: 290 },
      { date: "2024-04-23", desktop: 138, mobile: 340 },
      { date: "2024-04-24", desktop: 387, mobile: 320 },
      { date: "2024-04-25", desktop: 215, mobile: 250 },
      { date: "2024-04-26", desktop: 75, mobile: 130 },
      { date: "2024-04-27", desktop: 383, mobile: 420 },
      { date: "2024-04-28", desktop: 122, mobile: 180 },
      { date: "2024-04-29", desktop: 315, mobile: 240 },
      { date: "2024-04-30", desktop: 454, mobile: 380 },
    ],
  },
  multiSeries: {
    fields: [
      { key: "month", label: "Month" },
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
    ],
    rows: [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
    ],
  },
};

// Sample data for bar charts (reuse shapes from area for consistency)
const barChartData = {
  basic: {
    fields: [
      { key: "month", label: "Month" },
      { key: "desktop", label: "Desktop" },
    ],
    rows: [
      { month: "January", desktop: 186 },
      { month: "February", desktop: 305 },
      { month: "March", desktop: 237 },
      { month: "April", desktop: 73 },
      { month: "May", desktop: 209 },
      { month: "June", desktop: 214 },
    ],
  },
  multiSeries: {
    fields: [
      { key: "month", label: "Month" },
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
    ],
    rows: [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
    ],
  },
  negative: {
    fields: [
      { key: "month", label: "Month" },
      { key: "revenue", label: "Revenue" },
    ],
    rows: [
      { month: "January", revenue: 120 },
      { month: "February", revenue: -40 },
      { month: "March", revenue: 80 },
      { month: "April", revenue: -20 },
      { month: "May", revenue: 60 },
      { month: "June", revenue: 110 },
    ],
  },
};

export const AREA_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "area-basic",
    title: "Area Chart",
    description: "A basic area chart showing single data series",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop"],
      legend: true,
      gradient: false,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.basic,
  },
  {
    id: "area-interactive",
    title: "Area Chart - Interactive",
    description: "Interactive area chart with hover effects and tooltips",
    category: "area",
    config: {
      type: "area",
      xKey: "date",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: false,
      size: { width: 600, height: 300 },
      tooltip: { enabled: true },
    },
    dataset: areaChartData.interactive,
  },
  {
    id: "area-linear",
    title: "Area Chart - Linear",
    description: "Linear interpolation area chart",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: false,
      stepped: false,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.multiSeries,
  },
  {
    id: "area-step",
    title: "Area Chart - Step",
    description: "Step interpolation area chart",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: false,
      stepped: true,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.multiSeries,
  },
  {
    id: "area-stacked",
    title: "Area Chart - Stacked",
    description: "Stacked area chart showing cumulative values",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: false,
      stacked: true,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.multiSeries,
  },
  {
    id: "area-gradient",
    title: "Area Chart - Gradient",
    description: "Area chart with gradient fill",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: true,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.multiSeries,
  },
];

export const BAR_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "bar-basic",
    title: "Bar Chart",
    description: "A basic bar chart showing single data series",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.basic,
  },
  {
    id: "bar-horizontal",
    title: "Bar Chart - Horizontal",
    description: "Horizontal layout bar chart",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop"],
      legend: true,
      barLayout: "horizontal",
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.basic,
  },
  {
    id: "bar-multiple",
    title: "Bar Chart - Multiple",
    description: "Multiple series bar chart",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.multiSeries,
  },
  {
    id: "bar-stacked",
    title: "Bar Chart - Stacked + Legend",
    description: "Stacked bar chart showing cumulative values",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      stacked: true,
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.multiSeries,
  },
  {
    id: "bar-label",
    title: "Bar Chart - Custom Label",
    description: "Bar chart with value labels on bars",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop"],
      legend: true,
      barLabel: true,
      barLayout: "horizontal",
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.basic,
  },
  {
    id: "bar-mixed",
    title: "Bar Chart - Mixed",
    description: "Bars with an overlaid line series",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop"],
      lineKeys: ["mobile"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.multiSeries,
  },
  {
    id: "bar-negative",
    title: "Bar Chart - Negative",
    description: "Bar chart with positive and negative values",
    category: "bar",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["revenue"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: barChartData.negative,
  },
];

export const ALL_TEMPLATES: ChartTemplate[] = [
  ...AREA_CHART_TEMPLATES,
  ...BAR_CHART_TEMPLATES,
];

export function getTemplatesByCategory(category: ChartTemplate["category"]): ChartTemplate[] {
  return ALL_TEMPLATES.filter(template => template.category === category);
}

export function getTemplateById(id: string): ChartTemplate | undefined {
  return ALL_TEMPLATES.find(template => template.id === id);
}
