"use client";

import React, { forwardRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { ChartConfig, Dataset } from "@/lib/schema";
import { getChartColor, mapSeriesToColors } from "@/lib/colors";
import { Activity, Waves } from "lucide-react";

interface ChartCanvasProps {
  config: ChartConfig;
  dataset: Dataset;
  className?: string;
  isTooltipChart?: boolean; // Flag for tooltip chart variants
}

// Custom tooltip component with color boxes
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: any;
  config: ChartConfig;
  fieldLabelMap: Record<string, string>;
  formatTooltipLabel: (label: any) => string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  config,
  fieldLabelMap,
  formatTooltipLabel
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div 
      className="bg-white border border-gray-200 rounded-none shadow-lg p-3"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: "0px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Label */}
      {label && (
        <div 
          className="font-semibold mb-2"
          style={{
            fontSize: "14px",
            color: "#222222",
            fontFamily: "NVIDIA",
            fontWeight: "600"
          }}
        >
          {formatTooltipLabel(label)}
        </div>
      )}
      
      {/* Data entries */}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const dataKey = entry.dataKey || entry.name;
          const displayName = fieldLabelMap[dataKey] || dataKey;
          const color = entry.color || getChartColor(index);
          
          return (
            <div key={index} className="flex items-center gap-2">
              {/* Color box */}
              <div 
                className="w-3 h-3 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {/* Data */}
              <div className="flex justify-between items-center w-full min-w-0">
                <span 
                  className="truncate"
                  style={{
                    fontSize: "14px",
                    color: "#222222",
                    fontFamily: "NVIDIA"
                  }}
                >
                  {displayName}:
                </span>
                <span 
                  className="font-semibold ml-2"
                  style={{
                    fontSize: "14px",
                    color: "#222222",
                    fontFamily: "NVIDIA",
                    fontWeight: "600"
                  }}
                >
                  {typeof entry.value === 'number' 
                    ? entry.value.toLocaleString() 
                    : entry.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChartCanvas = forwardRef<HTMLDivElement, ChartCanvasProps>(
  ({ config, dataset, className, isTooltipChart = false }, ref) => {
    const { type, xKey, yKeys = [] } = config;


    if (!dataset?.rows?.length) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data to display
        </div>
      );
    }

    if (!yKeys?.length) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No Y-axis keys configured
        </div>
      );
    }

    const colors = mapSeriesToColors(yKeys, true, config.colors, isTooltipChart); // Use actual colors for better SVG export
    const data = dataset.rows;
    
    // Get grid line color based on theme
    const getGridColor = () => {
      if (typeof document !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '#313131' : '#cccccc';
      }
      return '#cccccc'; // Default to light theme color
    };
    
    const gridColor = getGridColor();
    
    // Get text color based on theme  
    const getTextColor = () => {
      if (typeof document !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '#EEEEEE' : '#222222';
      }
      return '#222222'; // Default to light theme color
    };
    
    const textColor = getTextColor();
    
    // Get secondary label color based on theme
    const getSecondaryTextColor = () => {
      if (typeof document !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '#EEEEEE' : '#222222';
      }
      return '#222222'; // Default to light theme color
    };
    
    const secondaryTextColor = getSecondaryTextColor();

    // Check if any secondary labels exist in the dataset
    const hasSecondaryLabels = () => {
      const xAxisKey = dataset.fields[0]?.key || 'month';
      const secondaryKey = `${xAxisKey}_secondary`;
      return data.some(row => row[secondaryKey] && String(row[secondaryKey]).trim() !== '');
    };

    // Smart Y-axis domain calculation with intelligent rounding
    const calculateSmartYDomain = (data: any[], yKeys: string[]) => {
      if (!data?.length || !yKeys?.length) return [0, 100];
      
      // Get all numeric values from the specified y-keys
      const allValues: number[] = [];
      data.forEach(row => {
        yKeys.forEach(key => {
          const value = row[key];
          if (typeof value === 'number' && !isNaN(value)) {
            allValues.push(value);
          }
        });
      });
      
      if (allValues.length === 0) return [0, 100];
      
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      
      // Determine rounding increment based on data range
      let roundingIncrement: number;
      if (max <= 100) {
        roundingIncrement = 10; // Small numbers: round to nearest 10
      } else if (max <= 1000) {
        roundingIncrement = 50; // Medium numbers: round to nearest 50
      } else if (max <= 10000) {
        roundingIncrement = 100; // Large numbers: round to nearest 100
      } else {
        roundingIncrement = 1000; // Very large numbers: round to nearest 1000
      }
      
      // Calculate smart min and max
      let smartMin: number;
      let smartMax: number;
      
      // For positive data, start from 0 unless min is significantly above 0
      if (min >= 0) {
        smartMin = min > roundingIncrement * 2 ? 
          Math.floor(min / roundingIncrement) * roundingIncrement : 0;
      } else {
        smartMin = Math.floor(min / roundingIncrement) * roundingIncrement;
      }
      
      // Always round max up to next increment
      smartMax = Math.ceil(max / roundingIncrement) * roundingIncrement;
      
      // Add some padding for visual appeal
      const padding = roundingIncrement;
      smartMax += padding;
      
      return [smartMin, smartMax];
    };

    // Create a mapping from field keys to labels for the legend
    const fieldLabelMap = dataset.fields.reduce((acc, field) => {
      acc[field.key] = field.label || field.key;
      return acc;
    }, {} as Record<string, string>);


    // Custom legend formatter to use field labels instead of keys
    const legendFormatter = (value: string) => {
      return fieldLabelMap[value] || value;
    };

    // Helper function to format dates and other X-axis values
    const formatXAxisValue = (value: any) => {
      // Check if this looks like a date string (YYYY-MM-DD format)
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            // For stacked bar charts (tooltip examples), show day of week
            if (config.type === 'bar' && config.stacked) {
              return date.toLocaleDateString('en-US', { weekday: 'short' });
            }
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        } catch (error) {
          console.warn('Date parsing error:', error);
        }
      }
      return value;
    };

    // Format tooltip label (shows full date for tooltips)
    const formatTooltipLabel = (value: any) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          }
        } catch (error) {
          console.warn('Date parsing error:', error);
        }
      }
      return value;
    };

    // Custom XAxis Tick Component that includes secondary labels
    const CustomXAxisTick = (props: any) => {
      const { x, y, payload } = props;
      
      // Get the x-axis key and secondary key
      const xAxisKey = dataset.fields[0]?.key || 'month';
      const secondaryKey = `${xAxisKey}_secondary`;
      
      // Find the corresponding data row for this tick
      const dataRow = data.find(row => row[xAxisKey] === payload.value);
      const secondaryLabel = dataRow?.[secondaryKey];
      
      // Format the primary label value
      const formattedValue = formatXAxisValue(payload.value);
      
      return (
        <g transform={`translate(${x},${y})`}>
          {/* Primary label */}
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor="middle" 
            fill={textColor}
            fontSize="12"
            fontFamily="NVIDIA"
            fontWeight="700"
          >
            {formattedValue}
          </text>
          {/* Secondary label if exists */}
          {secondaryLabel && (
            <text 
              x={0} 
              y={-10} 
              dy={48} // 2em below primary label (48px = ~2em at 12px font)
              textAnchor="middle" 
              fill={secondaryTextColor}
              fontSize="12"
              fontFamily="NVIDIA"
              fontWeight="400"
            >
              {String(secondaryLabel)}
            </text>
          )}
        </g>
      );
    };

    // Enhanced tooltip formatters for shadcn variants
    const getTooltipLabelFormatter = () => {
      const variant = config.tooltip?.variant;
      
      if (variant === "no-label" || config.tooltip?.showLabel === false) {
        return undefined;
      }
      
      if (variant === "label-formatter") {
        return (label: any) => `Custom: ${formatTooltipLabel(label)}`;
      }
      
      if (variant === "custom-label" && xKey && fieldLabelMap[xKey]) {
        return (label: any) => fieldLabelMap[xKey];
      }
      
      return (label: any) => {
        if (xKey && fieldLabelMap[xKey]) {
          return fieldLabelMap[xKey];
        }
        return formatTooltipLabel(label);
      };
    };

    const getTooltipFormatter = () => {
      const variant = config.tooltip?.variant;
      
      if (variant === "formatter" || config.tooltip?.customFormatter) {
        return (value: any, name: string) => {
          const label = fieldLabelMap[name] || name;
          if (typeof value === 'number') {
            return [`${value.toLocaleString()} units`, label];
          }
          return [value, label];
        };
      }
      
      if (variant === "advanced" && config.tooltip?.showTotal) {
        return (value: any, name: string) => {
          const label = fieldLabelMap[name] || name;
          return [`${value.toLocaleString()}`, label];
        };
      }
      
      return (value: any, name: string) => {
        const label = fieldLabelMap[name] || name;
        return [value, label];
      };
    };


    const tooltipLabelFormatter = getTooltipLabelFormatter();
    const tooltipFormatter = getTooltipFormatter();

    // Icon mapping for tooltip icons variant
    const getTooltipIcon = (name: string) => {
      if (config.tooltip?.variant === "icons" || config.tooltip?.showIcons) {
        const iconMap: Record<string, React.ReactNode> = {
          running: <Activity className="h-3 w-3" />,
          swimming: <Waves className="h-3 w-3" />,
          desktop: <Activity className="h-3 w-3" />,
          mobile: <Waves className="h-3 w-3" />,
        };
        return iconMap[name] || null;
      }
      return null;
    };

    // Custom tooltip content for advanced variants
    const CustomTooltipContent = ({ active, payload, label }: any) => {
      if (!active || !payload || !payload.length) return null;

      const variant = config.tooltip?.variant;
      
      return (
        <div className="bg-background border border-border p-3 shadow-md">
          {label && tooltipLabelFormatter && (
            <div className="font-medium mb-2 text-foreground">
              {tooltipLabelFormatter(label)}
            </div>
          )}
          
          {payload.map((entry: any, index: number) => {
            const icon = getTooltipIcon(entry.dataKey);
            const [value, name] = tooltipFormatter(entry.value, entry.dataKey);
            
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span className="text-muted-foreground">{name}:</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            );
          })}

          {variant === "advanced" && config.tooltip?.showTotal && payload.length > 1 && (
            <div className="mt-2 pt-2 border-t border-border text-sm font-medium text-foreground">
              Total: {payload.reduce((sum: number, entry: any) => sum + entry.value, 0).toLocaleString()}
            </div>
          )}
        </div>
      );
    };

    const renderAreaChart = () => {
      const [yMin, yMax] = calculateSmartYDomain(data, yKeys);
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 5, right: 30, left: 5, bottom: 80 }}
            stackOffset={config.stackedExpanded ? "expand" : undefined}
          >
            <CartesianGrid strokeDasharray="3 3" verticalPoints={[]} stroke={gridColor} />
            <XAxis 
              dataKey={xKey} 
              type="category"
              scale="point"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              padding={{ left: 0, right: 0 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: textColor, fontFamily: 'NVIDIA' }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={[yMin, yMax]}
            />
          {config.tooltip?.enabled !== false && (
            config.tooltip?.variant === "icons" || config.tooltip?.variant === "advanced" ? (
              <Tooltip 
                content={<CustomTooltipContent />}
                wrapperStyle={{ outline: "none" }}
              />
            ) : (
              <Tooltip 
                content={<CustomTooltip 
                  config={config} 
                  fieldLabelMap={fieldLabelMap}
                  formatTooltipLabel={formatTooltipLabel}
                />}
                wrapperStyle={{ outline: "none" }}
              />
            )
          )}
          {yKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId={config.stacked ? "1" : undefined}
              stroke={colors[key]}
              fill={config.gradient ? `url(#gradient-${key})` : colors[key]}
              fillOpacity={0.6}
              strokeWidth={2}
            />
          ))}
          {config.gradient && (
            <defs>
              {yKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`gradient-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={colors[key]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[key]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
          )}
            {renderSVGLegend()}
          </AreaChart>
        </ResponsiveContainer>
      );
    };

    const renderBarChart = () => {
      const isHorizontal = config.barLayout === "horizontal";
      const lineKeys = config.lineKeys || [];
      const [yMin, yMax] = calculateSmartYDomain(data, yKeys);
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{ top: 6, right: 30, left: 6, bottom: 80 }}
            barCategoryGap="20%"
            barGap={4}
          >
            {/* Only show grid lines if NOT a tooltip chart */}
            {!isTooltipChart && (isHorizontal ? (
              // Horizontal bar chart: Show vertical lines only (hide horizontal)
              <CartesianGrid 
                strokeDasharray="3 3"
                horizontalCoordinatesGenerator={() => []}
                stroke={gridColor}
              />
            ) : (
              // Vertical bar chart: Show horizontal lines only (hide vertical)  
              <CartesianGrid 
                strokeDasharray="3 3"
                verticalCoordinatesGenerator={() => []}
                stroke={gridColor}
              />
            ))}
            {isHorizontal ? (
              <>
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12, fill: textColor, fontFamily: 'NVIDIA' }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  domain={[yMin, yMax]}
                />
                <YAxis 
                  dataKey={xKey}
                  type="category"
                  tick={isTooltipChart ? false : { fontSize: 12, fill: textColor, fontFamily: 'NVIDIA', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey={xKey} 
                  type="category"
                  tick={<CustomXAxisTick />}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tick={isTooltipChart ? false : { fontSize: 12, fill: textColor, fontFamily: 'NVIDIA' }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  domain={[yMin, yMax]}
                  allowDataOverflow={false}
                />
              </>
            )}
            {config.tooltip?.enabled !== false && (
              <Tooltip 
                content={<CustomTooltip 
                  config={config} 
                  fieldLabelMap={fieldLabelMap}
                  formatTooltipLabel={formatTooltipLabel}
                />}
                cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                wrapperStyle={{ outline: "none" }}
              />
            )}
            {yKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[key]}
                radius={0}
              >
                {config.barLabel && (
                  <LabelList 
                    dataKey={key} 
                    position={isHorizontal ? "right" : "top"} 
                    className="fill-foreground"
                    formatter={(value: number) => `${value}`}
                  />
                )}
              </Bar>
            ))}
            {lineKeys.map((key) => (
              <Line
                key={`line-${key}`}
                type="monotone"
                dataKey={key}
                stroke={colors[key] || getChartColor(0)}
                strokeWidth={2}
                dot={false}
                yAxisId={0}
              />
            ))}
            {renderSVGLegend()}
          </BarChart>
        </ResponsiveContainer>
      );
    };

    const renderLineChart = () => {
      const [yMin, yMax] = calculateSmartYDomain(data, yKeys);
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" verticalPoints={[]} stroke={gridColor} />
            <XAxis 
              dataKey={xKey} 
              type="category"
              scale="point"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              padding={{ left: 0, right: 0 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: textColor, fontFamily: 'NVIDIA' }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={[yMin, yMax]}
            />
          {config.tooltip?.enabled !== false && (
            config.tooltip?.variant === "icons" || config.tooltip?.variant === "advanced" ? (
              <Tooltip 
                content={<CustomTooltipContent />}
                wrapperStyle={{ outline: "none" }}
              />
            ) : (
              <Tooltip 
                content={<CustomTooltip 
                  config={config} 
                  fieldLabelMap={fieldLabelMap}
                  formatTooltipLabel={formatTooltipLabel}
                />}
                wrapperStyle={{ outline: "none" }}
              />
            )
          )}
          {yKeys.map((key) => (
            <Line
              key={key}
              type={config.stepped ? "stepAfter" : "monotone"}
              dataKey={key}
              stroke={colors[key]}
              strokeWidth={2}
              dot={config.showDots ? { fill: colors[key], strokeWidth: 2, r: 4 } : false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
            {renderSVGLegend()}
          </LineChart>
        </ResponsiveContainer>
      );
    };

    const renderPieChart = () => (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 5, right: 30, left: 5, bottom: 60 }}>
          <Pie
            data={data}
            dataKey={yKeys[0]}
            nameKey={xKey}
            cx="50%"
            cy="45%"
            innerRadius={config.donut ? "35%" : 0}
            outerRadius="65%"
            paddingAngle={2}
            activeIndex={config.activeIndex}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getChartColor(index)}
                stroke={config.activeIndex === index ? getChartColor(index) : undefined}
                strokeWidth={config.activeIndex === index ? 3 : 0}
              />
            ))}
            {config.showLabels && (
              <LabelList 
                dataKey={yKeys[0]} 
                position="outside" 
                fill={textColor}
                fontSize={12}
              />
            )}
          </Pie>
          {config.centerText && config.donut && (
            <text 
              x="50%" 
              y="45%" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontSize="24"
              fontWeight="bold"
              fontFamily="NVIDIA"
              fill={textColor}
            >
              {data.reduce((sum, item) => sum + (item[yKeys[0]] as number), 0).toLocaleString()}
            </text>
          )}
          {config.tooltip?.enabled !== false && (
            config.tooltip?.variant === "icons" || config.tooltip?.variant === "advanced" ? (
              <Tooltip 
                content={<CustomTooltipContent />}
                wrapperStyle={{ outline: "none" }}
              />
            ) : (
              <Tooltip 
                content={<CustomTooltip 
                  config={config} 
                  fieldLabelMap={fieldLabelMap}
                  formatTooltipLabel={formatTooltipLabel}
                />}
                wrapperStyle={{ outline: "none" }}
              />
            )
          )}
          {renderSVGLegend()}
        </PieChart>
      </ResponsiveContainer>
    );



    const renderChart = () => {
      try {
        switch (type) {
          case "area":
            return renderAreaChart();
          case "bar":
            return renderBarChart();
          case "line":
            return renderLineChart();
          case "pie":
            return renderPieChart();
          default:
            return <div className="flex items-center justify-center h-full text-muted-foreground">Unsupported chart type: {type}</div>;
        }
      } catch (error) {
        console.error('Chart rendering error:', error);
        return (
          <div className="flex items-center justify-center h-full text-red-500">
            Chart rendering error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        );
      }
    };

    // FlexBox Legend Component for Display
    const FlexLegend = () => {
      if (config.legend === false || !yKeys?.length) return null;
      
      // Dynamic positioning based on secondary labels
      // No secondary labels: 30px below main labels 
      // With secondary labels: 30px below secondary labels
      const baseMargin = -46; // Adjusted to achieve 30px distance from main labels
      const adjustment = hasSecondaryLabels() ? 22 : 0; // Adjusted to achieve exactly 30px from secondary labels
      const legendMargin = baseMargin + adjustment;
      
      return (
        <div className="flex flex-wrap justify-center gap-4" style={{ marginTop: `${legendMargin}px` }}>
          {yKeys.map((key) => {
            const label = fieldLabelMap[key] || key;
            return (
              <div key={key} className="flex items-center gap-1" style={{ gap: '4px' }}>
                <div
                  className="w-3 h-3"
                  style={{
                    backgroundColor: colors[key] || '#666',
                    borderRadius: '2px'
                  }}
                />
                <span 
                  className="text-xs font-bold"
                  style={{ 
                    fontFamily: 'NVIDIA',
                    color: textColor,
                    fontSize: '12px'
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      );
    };


    // Hybrid SVG Legend: Proper SVG elements positioned exactly like FlexLegend
    const renderSVGLegend = () => {
      if (config.legend === false || !yKeys?.length) return null;
      
      const chartHeight = config.size?.height || 400;
      const chartWidth = config.size?.width || 600;
      
      // Dynamic positioning based on secondary labels
      // No secondary labels: 30px below main labels 
      // With secondary labels: 30px below secondary labels
      const baseLegendY = chartHeight - 46; // Base position matching FlexLegend (-46px margin)
      const adjustment = hasSecondaryLabels() ? 22 : 0; // Adjusted to achieve exactly 30px from secondary labels
      const legendY = baseLegendY + adjustment;
      
      // Calculate item dimensions exactly like FlexLegend flexbox
      const itemGap = 16; // Same as flexbox gap-4 (16px)  
      const colorBoxWidth = 12; // Same as w-3 h-3 (12px)
      const colorLabelGap = 4; // Same as gap-1 override (4px)
      
      // Measure text widths and calculate total width (client-side only)
      let context: CanvasRenderingContext2D | null = null;
      if (typeof window !== 'undefined') {
        const canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        if (context) {
          context.font = 'bold 12px NVIDIA, sans-serif';
        }
      }
      
      const items = yKeys.map((key) => {
        const label = fieldLabelMap[key] || key;
        const textWidth = context ? context.measureText(label).width : label.length * 7; // Fallback estimate
        const itemWidth = colorBoxWidth + colorLabelGap + textWidth;
        return { key, label, textWidth, itemWidth };
      });
      
      const totalWidth = items.reduce((sum, item, index) => {
        return sum + item.itemWidth + (index < items.length - 1 ? itemGap : 0);
      }, 0);
      
      // Center the entire group like flexbox justify-content: center
      const startX = (chartWidth - totalWidth) / 2;
      
      let currentX = startX;
      
      return items.map((item) => {
        const rectX = currentX;
        const textX = currentX + colorBoxWidth + colorLabelGap;
        
        const legendGroup = (
          <g key={`svg-legend-export-${item.key}`} className="export-legend">
            <rect
              x={rectX}
              y={legendY}
              width={colorBoxWidth}
              height="12"
              fill={colors[item.key] || '#666'}
            />
             <text
               x={textX}
               y={legendY + 11}
               fontSize="12"
               fill={textColor}
               fontFamily="NVIDIA"
               fontWeight="bold"
               dominantBaseline="middle"
               textAnchor="start"
             >
              {item.label}
            </text>
          </g>
        );
        
        // Move to next item position
        currentX += item.itemWidth + itemGap;
        
        return legendGroup;
      });
    };

    const containerHeight = config.size?.height || 400;
    const containerWidth = config.size?.width || 600;
    
    return (
      <div 
        className={`${className || ""} w-full h-full flex flex-col items-center justify-center`} 
        style={{ minHeight: `${containerHeight + (hasSecondaryLabels() ? 90 : 60)}px` }}
        ref={ref}
      >
        <div 
          className="w-full" 
          style={{ 
            height: `${containerHeight}px`,
            maxWidth: `${containerWidth}px`
          }}
        >
          {renderChart()}
        </div>
        <FlexLegend />
      </div>
    );
  }
);

ChartCanvas.displayName = "ChartCanvas";

export { ChartCanvas };
