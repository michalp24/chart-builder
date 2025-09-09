// Chart color mapping to CSS variables
export const CHART_COLORS = {
  1: "hsl(var(--chart-1))",
  2: "hsl(var(--chart-2))",
  3: "hsl(var(--chart-3))",
  4: "hsl(var(--chart-4))",
  5: "hsl(var(--chart-5))",
} as const;

export function getChartColor(index: number): string {
  const colorKey = ((index % 5) + 1) as keyof typeof CHART_COLORS;
  return CHART_COLORS[colorKey];
}

export function mapSeriesToColors(yKeys: string[]): Record<string, string> {
  const colors: Record<string, string> = {};
  yKeys.forEach((key, index) => {
    colors[key] = getChartColor(index);
  });
  return colors;
}
