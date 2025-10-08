// NVIDIA color palette: Green primary + Gray scale (300-700)
export const CHART_COLORS_LIGHT = {
  0: "#76B900",   // NVIDIA Green (primary - stays same)
  1: "#A7A7A7",   // Gray 300 (lightest)
  2: "#989898",   // Gray 400 (second lightest)
  3: "#757575",   // Gray 500 (middle - stays same)
  4: "#636363",   // Gray 600 (second darkest)
  5: "#4B4B4B",   // Gray 700 (darkest)
} as const;

export const CHART_COLORS_DARK = {
  0: "#76B900",   // NVIDIA Green (primary - stays same)
  1: "#4B4B4B",   // Gray 700 (inverted from Gray 300)
  2: "#636363",   // Gray 600 (inverted from Gray 400)
  3: "#757575",   // Gray 500 (middle - stays same)
  4: "#989898",   // Gray 400 (inverted from Gray 600)
  5: "#A7A7A7",   // Gray 300 (inverted from Gray 700)
} as const;

// Fallback colors using CSS variables for theme compatibility
export const CHART_COLORS_CSS = {
  0: "hsl(var(--chart-1))",
  1: "hsl(var(--chart-2))",
  2: "hsl(var(--chart-3))",
  3: "hsl(var(--chart-4))",
  4: "hsl(var(--chart-5))",
  5: "hsl(var(--chart-6))",
} as const;

export function getChartColor(index: number, useActualColors: boolean = true): string {
  const colorKey = (index % 6) as keyof typeof CHART_COLORS_LIGHT;
  
  if (useActualColors) {
    // Check if we're in dark mode (only on client side)
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return isDark ? CHART_COLORS_DARK[colorKey] : CHART_COLORS_LIGHT[colorKey];
  }
  
  return CHART_COLORS_CSS[colorKey];
}

// Sequential color assignment: First column gets NVIDIA Green, rest get Gray scale
// No special column name logic - purely based on order

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
  
  // For regular charts, assign colors sequentially: NVIDIA Green first, then Gray scale
  yKeys.forEach((key, index) => {
    if (customColors?.[key]) {
      // Preserve user-set custom colors
      colors[key] = customColors[key];
    } else {
      // Sequential color assignment: NVIDIA Green (index 0), then Gray 300-700 (index 1-5)
      const colorIndex = Math.min(index, 5); // Cap at 6 colors maximum (0-5)
      colors[key] = getChartColor(colorIndex, useActualColors);
    }
  });
  
  return colors;
}
