import { ChartConfig, Dataset } from "./schema";

export interface ChartTemplate {
  id: string;
  title: string;
  description: string;
  config: Omit<ChartConfig, "id">;
  dataset: Dataset;
  category: "area" | "bar" | "line" | "pie" | "radar" | "radial" | "tooltip";
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
  stackedExpanded: {
    fields: [
      { key: "month", label: "Month" },
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
      { key: "tablet", label: "Tablet" },
    ],
    rows: [
      { month: "January", desktop: 186, mobile: 80, tablet: 40 },
      { month: "February", desktop: 305, mobile: 200, tablet: 60 },
      { month: "March", desktop: 237, mobile: 120, tablet: 80 },
      { month: "April", desktop: 73, mobile: 190, tablet: 30 },
      { month: "May", desktop: 209, mobile: 130, tablet: 50 },
      { month: "June", desktop: 214, mobile: 140, tablet: 70 },
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

// Sample data for line charts
const lineChartData = {
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
  multiple: {
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
  dots: {
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

// Sample data for pie charts
const pieChartData = {
  basic: {
    fields: [
      { key: "browser", label: "Browser" },
      { key: "visitors", label: "Visitors" },
    ],
    rows: [
      { browser: "chrome", visitors: 275 },
      { browser: "safari", visitors: 200 },
      { browser: "firefox", visitors: 287 },
      { browser: "edge", visitors: 173 },
      { browser: "other", visitors: 190 },
    ],
  },
  donut: {
    fields: [
      { key: "browser", label: "Browser" },
      { key: "visitors", label: "Visitors" },
    ],
    rows: [
      { browser: "chrome", visitors: 275 },
      { browser: "safari", visitors: 200 },
      { browser: "firefox", visitors: 287 },
      { browser: "edge", visitors: 173 },
      { browser: "other", visitors: 190 },
    ],
  },
};

// Sample data for radar charts
const radarChartData = {
  basic: {
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
  {
    id: "area-stacked-expanded",
    title: "Area Chart - Stacked Expanded",
    description: "100% stacked area chart showing proportional values",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile", "tablet"],
      legend: true,
      gradient: false,
      stacked: true,
      stackedExpanded: true,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.stackedExpanded,
  },
  {
    id: "area-icons",
    title: "Area Chart - Icons",
    description: "Area chart with category icons in legend",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: false,
      showIcons: true,
      size: { width: 600, height: 300 },
    },
    dataset: areaChartData.multiSeries,
  },
  {
    id: "area-axes",
    title: "Area Chart - Axes",
    description: "Area chart with customized axes styling",
    category: "area",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: false,
      customAxes: true,
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

export const LINE_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "line-basic",
    title: "Line Chart",
    description: "A basic line chart showing single data series",
    category: "line",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: lineChartData.basic,
  },
  {
    id: "line-multiple",
    title: "Line Chart - Multiple",
    description: "Multiple line series chart",
    category: "line",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: lineChartData.multiple,
  },
  {
    id: "line-dots",
    title: "Line Chart - Dots",
    description: "Line chart with data point dots",
    category: "line",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      showDots: true,
      size: { width: 600, height: 300 },
    },
    dataset: lineChartData.dots,
  },
  {
    id: "line-step",
    title: "Line Chart - Step",
    description: "Step line chart with sharp transitions",
    category: "line",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      stepped: true,
      size: { width: 600, height: 300 },
    },
    dataset: lineChartData.multiple,
  },
];

export const PIE_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "pie-legend",
    title: "Pie Chart - Legend",
    description: "Pie chart with legend showing categories",
    category: "pie",
    config: {
      type: "pie",
      xKey: "browser",
      yKeys: ["visitors"],
      legend: true,
      size: { width: 600, height: 400 },
    },
    dataset: pieChartData.basic,
  },
  {
    id: "pie-donut-text",
    title: "Pie Chart - Donut with Text",
    description: "Donut chart with center text display",
    category: "pie",
    config: {
      type: "pie",
      xKey: "browser",
      yKeys: ["visitors"],
      legend: true,
      donut: true,
      centerText: true,
      size: { width: 600, height: 400 },
    },
    dataset: pieChartData.donut,
  },
  {
    id: "pie-donut-active",
    title: "Pie Chart - Donut Active",
    description: "Interactive donut chart with active states",
    category: "pie",
    config: {
      type: "pie",
      xKey: "browser",
      yKeys: ["visitors"],
      legend: true,
      donut: true,
      activeIndex: 0,
      size: { width: 600, height: 400 },
    },
    dataset: pieChartData.donut,
  },
  {
    id: "pie-interactive",
    title: "Pie Chart - Interactive",
    description: "Interactive pie chart with hover effects",
    category: "pie",
    config: {
      type: "pie",
      xKey: "browser",
      yKeys: ["visitors"],
      legend: true,
      interactive: true,
      size: { width: 600, height: 400 },
    },
    dataset: pieChartData.basic,
  },
];

export const RADAR_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "radar-basic",
    title: "Radar Chart",
    description: "A basic radar chart for multi-dimensional data",
    category: "radar",
    config: {
      type: "radar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      size: { width: 600, height: 300 },
    },
    dataset: radarChartData.basic,
  },
  {
    id: "radar-grid",
    title: "Radar Chart - Grid",
    description: "Radar chart with customized grid lines",
    category: "radar",
    config: {
      type: "radar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      showGrid: true,
      size: { width: 600, height: 300 },
    },
    dataset: radarChartData.basic,
  },
];

// Sample data for tooltip charts (reuse existing data with enhanced tooltip configs)
const tooltipChartData = {
  basic: {
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
  advanced: {
    fields: [
      { key: "date", label: "Date" },
      { key: "revenue", label: "Revenue" },
      { key: "profit", label: "Profit" },
      { key: "users", label: "Users" },
    ],
    rows: [
      { date: "2024-01-01", revenue: 1200, profit: 400, users: 1500 },
      { date: "2024-01-02", revenue: 1100, profit: 350, users: 1400 },
      { date: "2024-01-03", revenue: 1300, profit: 450, users: 1600 },
      { date: "2024-01-04", revenue: 1250, profit: 420, users: 1550 },
      { date: "2024-01-05", revenue: 1400, profit: 500, users: 1700 },
      { date: "2024-01-06", revenue: 1350, profit: 480, users: 1650 },
    ],
  },
};

export const TOOLTIP_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "tooltip-default",
    title: "Tooltip - Default",
    description: "Default tooltip with ChartTooltipContent",
    category: "tooltip",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "default" 
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-line-indicator",
    title: "Tooltip - Line Indicator",
    description: "Tooltip with line indicator",
    category: "tooltip",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "line-indicator",
        showIndicator: true
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-no-indicator",
    title: "Tooltip - No Indicator",
    description: "Tooltip with no indicator",
    category: "tooltip",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "no-indicator",
        showIndicator: false
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-custom-label",
    title: "Tooltip - Custom Label",
    description: "Tooltip with custom label from chartConfig",
    category: "tooltip",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "custom-label"
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-label-formatter",
    title: "Tooltip - Label Formatter",
    description: "Tooltip with label formatter",
    category: "tooltip",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "label-formatter"
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-no-label",
    title: "Tooltip - No Label",
    description: "Tooltip with no label",
    category: "tooltip",
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "no-label",
        showLabel: false
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-formatter",
    title: "Tooltip - Formatter",
    description: "Tooltip with custom formatter",
    category: "tooltip",
    config: {
      type: "bar",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "formatter",
        customFormatter: true
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-icons",
    title: "Tooltip - Icons",
    description: "Tooltip with icons",
    category: "tooltip",
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "icons",
        showIcons: true
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.basic,
  },
  {
    id: "tooltip-advanced",
    title: "Tooltip - Advanced",
    description: "Tooltip with custom formatter and total",
    category: "tooltip",
    config: {
      type: "bar",
      xKey: "date",
      yKeys: ["revenue", "profit", "users"],
      legend: true,
      tooltip: { 
        enabled: true, 
        variant: "advanced",
        customFormatter: true,
        showTotal: true
      },
      size: { width: 600, height: 300 },
    },
    dataset: tooltipChartData.advanced,
  },
];

// Sample data for radial charts
const radialChartData = {
  basic: {
    fields: [
      { key: "name", label: "Name" },
      { key: "value", label: "Value" },
    ],
    rows: [
      { name: "Progress", value: 72 },
    ],
  },
  stacked: {
    fields: [
      { key: "name", label: "Name" },
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
    ],
    rows: [
      { name: "Progress", desktop: 45, mobile: 27 },
    ],
  },
};

export const RADIAL_CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: "radial-basic",
    title: "Radial Chart",
    description: "A basic radial progress chart",
    category: "radial",
    config: {
      type: "radial",
      xKey: "name",
      yKeys: ["value"],
      legend: false,
      size: { width: 600, height: 400 },
    },
    dataset: radialChartData.basic,
  },
  {
    id: "radial-label",
    title: "Radial Chart - Label",
    description: "Radial chart with center label",
    category: "radial",
    config: {
      type: "radial",
      xKey: "name",
      yKeys: ["value"],
      legend: false,
      centerLabel: true,
      size: { width: 600, height: 400 },
    },
    dataset: radialChartData.basic,
  },
  {
    id: "radial-grid",
    title: "Radial Chart - Grid",
    description: "Radial chart with grid lines",
    category: "radial",
    config: {
      type: "radial",
      xKey: "name",
      yKeys: ["value"],
      legend: false,
      showGrid: true,
      size: { width: 600, height: 400 },
    },
    dataset: radialChartData.basic,
  },
  {
    id: "radial-stacked",
    title: "Radial Chart - Stacked",
    description: "Stacked radial chart with multiple series",
    category: "radial",
    config: {
      type: "radial",
      xKey: "name",
      yKeys: ["desktop", "mobile"],
      legend: true,
      stacked: true,
      size: { width: 600, height: 400 },
    },
    dataset: radialChartData.stacked,
  },
];

export const ALL_TEMPLATES: ChartTemplate[] = [
  ...AREA_CHART_TEMPLATES,
  ...BAR_CHART_TEMPLATES,
  ...LINE_CHART_TEMPLATES,
  ...PIE_CHART_TEMPLATES,
  ...RADAR_CHART_TEMPLATES,
  ...RADIAL_CHART_TEMPLATES,
  ...TOOLTIP_CHART_TEMPLATES,
];

export function getTemplatesByCategory(category: ChartTemplate["category"]): ChartTemplate[] {
  return ALL_TEMPLATES.filter(template => template.category === category);
}

export function getTemplateById(id: string): ChartTemplate | undefined {
  return ALL_TEMPLATES.find(template => template.id === id);
}
