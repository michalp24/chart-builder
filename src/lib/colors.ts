// NVIDIA color palette based on 300-series colors
export const CHART_COLORS_LIGHT = {
  1: "#76B900",   // NVIDIA Green (primary)
  2: "#1DBBA4",   // Teal 300
  3: "#FC79CA",   // Fuchsia 300
  4: "#FF7181",   // Red 300
  5: "#EF9100",   // Yellow 300
} as const;

export const CHART_COLORS_DARK = {
  1: "#76B900",   // NVIDIA Green (primary)
  2: "#1DBBA4",   // Teal 300
  3: "#FC79CA",   // Fuchsia 300
  4: "#FF7181",   // Red 300
  5: "#EF9100",   // Yellow 300
} as const;

// Fallback colors using CSS variables for theme compatibility
export const CHART_COLORS_CSS = {
  1: "hsl(var(--chart-1))",
  2: "hsl(var(--chart-2))",
  3: "hsl(var(--chart-3))",
  4: "hsl(var(--chart-4))",
  5: "hsl(var(--chart-5))",
} as const;

export function getChartColor(index: number, useActualColors: boolean = true): string {
  const colorKey = ((index % 5) + 1) as keyof typeof CHART_COLORS_LIGHT;
  
  if (useActualColors) {
    // Check if we're in dark mode (only on client side)
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return isDark ? CHART_COLORS_DARK[colorKey] : CHART_COLORS_LIGHT[colorKey];
  }
  
  return CHART_COLORS_CSS[colorKey];
}

// Primary columns that should ALWAYS get NVIDIA Green
const PRIMARY_COLUMNS = ['desktop', 'revenue', 'sales', 'value', 'amount', 'data', 'count', 'total'];

// Check if a column is a primary data column
function isPrimaryColumn(columnName: string): boolean {
  return PRIMARY_COLUMNS.includes(columnName.toLowerCase());
}

// Stable color mapping - each column name gets a consistent color
function getStableColorForColumn(columnName: string): number {
  // Primary columns always get NVIDIA Green (index 0) - NEVER override this
  if (isPrimaryColumn(columnName)) {
    return 0; // NVIDIA Green - ALWAYS
  }
  
  // For other columns, create a stable hash based on column name
  let hash = 0;
  for (let i = 0; i < columnName.length; i++) {
    const char = columnName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Map hash to color index 1-4 (skip 0 which is reserved for primary)
  const colorIndex = (Math.abs(hash) % 4) + 1;
  return colorIndex;
}

export function mapSeriesToColors(
  yKeys: string[], 
  useActualColors: boolean = true,
  customColors?: Record<string, string>,
  isTooltipChart?: boolean
): Record<string, string> {
  const colors: Record<string, string> = {};
  
  // Special color mapping for tooltip charts to match shadcn blue theme
  if (isTooltipChart) {
    const tooltipColors: Record<string, string> = {
      swimming: "#93C5FD", // Light blue (bottom segment)
      running: "#3B82F6",  // Darker blue (top segment) 
    };
    
    yKeys.forEach((key, index) => {
      if (customColors?.[key]) {
        colors[key] = customColors[key];
      } else if (tooltipColors[key]) {
        colors[key] = tooltipColors[key];
      } else {
        colors[key] = getChartColor(index, useActualColors);
      }
    });
    
    return colors;
  }
  
  // For regular charts, use stable color assignment based on column name
  yKeys.forEach((key) => {
    // Check if this is a primary column that should ALWAYS be NVIDIA Green
    if (isPrimaryColumn(key)) {
      // Primary columns get NVIDIA Green unless explicitly overridden by user
      if (customColors?.[key] && customColors[key] !== getChartColor(0, useActualColors)) {
        // User has explicitly set a different color for primary column
        colors[key] = customColors[key];
      } else {
        // Use NVIDIA Green for primary columns (default behavior)
        colors[key] = getChartColor(0, useActualColors);
      }
    } else {
      // Non-primary columns
      if (customColors?.[key]) {
        // Preserve user-set custom colors
        colors[key] = customColors[key];
      } else {
        // Get stable hash-based color for non-primary columns
        const colorIndex = getStableColorForColumn(key);
        colors[key] = getChartColor(colorIndex, useActualColors);
      }
    }
  });
  
  return colors;
}
