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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
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

interface ChartCanvasProps {
  config: ChartConfig;
  dataset: Dataset;
  className?: string;
}

const ChartCanvas = forwardRef<HTMLDivElement, ChartCanvasProps>(
  ({ config, dataset, className }, ref) => {
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

    const colors = mapSeriesToColors(yKeys, true, config.colors); // Use actual colors for better SVG export
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
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        } catch (error) {
          console.warn('Date parsing error:', error);
        }
      }
      return value;
    };

    // Custom tooltip formatter to use field labels instead of keys
    const tooltipLabelFormatter = (label: any) => {
      if (xKey && fieldLabelMap[xKey]) {
        return fieldLabelMap[xKey];
      }
      return formatXAxisValue(label);
    };

    const tooltipFormatter = (value: any, name: string) => {
      const label = fieldLabelMap[name] || name;
      return [value, label];
    };

    const renderAreaChart = () => (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 5, bottom: 60 }}
          stackOffset={config.stackedExpanded ? "expand" : undefined}
        >
          <CartesianGrid strokeDasharray="3 3" verticalPoints={[]} stroke={gridColor} />
          <XAxis 
            dataKey={xKey} 
            type="category"
            scale="point"
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            padding={{ left: 0, right: 0 }}
            tickFormatter={formatXAxisValue}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          {config.tooltip?.enabled !== false && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
            />
          )}
          {/* SVG Legend - renders inside chart SVG for proper export */}
          {config.legend !== false && yKeys.map((key, index) => {
            try {
              const chartHeight = config.size?.height || 400;
              const legendY = chartHeight - 30; // Position legend 30px from bottom
              const itemWidth = 80; // Space between legend items (80px = ~15px gap + text)
              const totalWidth = yKeys.length * itemWidth;
              const chartWidth = config.size?.width || 600;
              const startX = (chartWidth - totalWidth) / 2; // Center horizontally based on actual chart width
              const x = startX + (index * itemWidth);
              const label = legendFormatter ? legendFormatter(key) : key;
              
              return (
                <g key={`svg-legend-${key}`}>
                  <rect
                    x={x}
                    y={legendY}
                    width="12"
                    height="12"
                    fill={colors[key] || '#666'}
                    rx="2"
                    ry="2"
                  />
                  <text
                    x={x + 18}
                    y={legendY + 9}
                    fontSize="12"
                    fill={textColor}
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    {label}
                  </text>
                </g>
              );
            } catch (error) {
              console.error('Legend rendering error:', error);
              return null;
            }
          })}
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
        </AreaChart>
      </ResponsiveContainer>
    );

    const renderBarChart = () => {
      const isHorizontal = config.barLayout === "horizontal";
      const lineKeys = config.lineKeys || [];
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{ top: 6, right: 30, left: 6, bottom: 60 }}
            barCategoryGap="20%"
            barGap={0}
          >
            {isHorizontal ? (
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
            )}
            {isHorizontal ? (
              <>
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12, fill: textColor }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  domain={[0, "dataMax + 10"]}
                />
                <YAxis 
                  dataKey={xKey}
                  type="category"
                  tick={{ fontSize: 12, fill: textColor }}
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
                  tick={{ fontSize: 12, fill: textColor }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: textColor }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  domain={["dataMin - 5", "dataMax + 5"]}
                  allowDataOverflow={false}
                />
              </>
            )}
            {config.tooltip?.enabled !== false && (
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={tooltipFormatter}
                labelFormatter={tooltipLabelFormatter}
                cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                wrapperStyle={{ outline: "none" }}
              />
            )}
            {/* SVG Legend - renders inside chart SVG for proper export */}
          {config.legend !== false && yKeys.map((key, index) => {
            try {
              const chartHeight = config.size?.height || 400;
              const legendY = chartHeight - 30; // Position legend 30px from bottom
              const itemWidth = 80; // Space between legend items (80px = ~15px gap + text)
              const totalWidth = yKeys.length * itemWidth;
              const chartWidth = config.size?.width || 600;
              const startX = (chartWidth - totalWidth) / 2; // Center horizontally based on actual chart width
              const x = startX + (index * itemWidth);
              const label = legendFormatter ? legendFormatter(key) : key;
              
              return (
                <g key={`svg-legend-${key}`}>
                  <rect
                    x={x}
                    y={legendY}
                    width="12"
                    height="12"
                    fill={colors[key] || '#666'}
                    rx="2"
                    ry="2"
                  />
                  <text
                    x={x + 18}
                    y={legendY + 9}
                    fontSize="12"
                    fill={textColor}
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    {label}
                  </text>
                </g>
              );
            } catch (error) {
              console.error('Legend rendering error:', error);
              return null;
            }
          })}
            {yKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[key]}
                radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
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
          </BarChart>
        </ResponsiveContainer>
      );
    };

    const renderLineChart = () => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" verticalPoints={[]} stroke={gridColor} />
          <XAxis 
            dataKey={xKey} 
            type="category"
            scale="point"
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            padding={{ left: 0, right: 0 }}
            tickFormatter={formatXAxisValue}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          {config.tooltip?.enabled !== false && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
            />
          )}
          {/* SVG Legend - renders inside chart SVG for proper export */}
          {config.legend !== false && yKeys.map((key, index) => {
            try {
              const chartHeight = config.size?.height || 400;
              const legendY = chartHeight - 30; // Position legend 30px from bottom
              const itemWidth = 80; // Space between legend items (80px = ~15px gap + text)
              const totalWidth = yKeys.length * itemWidth;
              const chartWidth = config.size?.width || 600;
              const startX = (chartWidth - totalWidth) / 2; // Center horizontally based on actual chart width
              const x = startX + (index * itemWidth);
              const label = legendFormatter ? legendFormatter(key) : key;
              
              return (
                <g key={`svg-legend-${key}`}>
                  <rect
                    x={x}
                    y={legendY}
                    width="12"
                    height="12"
                    fill={colors[key] || '#666'}
                    rx="2"
                    ry="2"
                  />
                  <text
                    x={x + 18}
                    y={legendY + 9}
                    fontSize="12"
                    fill={textColor}
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    {label}
                  </text>
                </g>
              );
            } catch (error) {
              console.error('Legend rendering error:', error);
              return null;
            }
          })}
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
        </LineChart>
      </ResponsiveContainer>
    );

    const renderPieChart = () => (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
          <Pie
            data={data}
            dataKey={yKeys[0]}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            innerRadius={config.donut ? "30%" : 0}
            outerRadius="40%"
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getChartColor(index)} />
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
          {config.tooltip?.enabled !== false && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
            />
          )}
          {/* SVG Legend - renders inside chart SVG for proper export */}
          {config.legend !== false && yKeys.map((key, index) => {
            try {
              const chartHeight = config.size?.height || 400;
              const legendY = chartHeight - 30; // Position legend 30px from bottom
              const itemWidth = 80; // Space between legend items (80px = ~15px gap + text)
              const totalWidth = yKeys.length * itemWidth;
              const chartWidth = config.size?.width || 600;
              const startX = (chartWidth - totalWidth) / 2; // Center horizontally based on actual chart width
              const x = startX + (index * itemWidth);
              const label = legendFormatter ? legendFormatter(key) : key;
              
              return (
                <g key={`svg-legend-${key}`}>
                  <rect
                    x={x}
                    y={legendY}
                    width="12"
                    height="12"
                    fill={colors[key] || '#666'}
                    rx="2"
                    ry="2"
                  />
                  <text
                    x={x + 18}
                    y={legendY + 9}
                    fontSize="12"
                    fill={textColor}
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    {label}
                  </text>
                </g>
              );
            } catch (error) {
              console.error('Legend rendering error:', error);
              return null;
            }
          })}
        </PieChart>
      </ResponsiveContainer>
    );

    const renderRadarChart = () => (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey={xKey} tick={{ fontSize: 12, fill: textColor }} />
          <PolarRadiusAxis tick={{ fontSize: 12, fill: textColor }} />
          {config.tooltip?.enabled !== false && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
            />
          )}
          {/* SVG Legend - renders inside chart SVG for proper export */}
          {config.legend !== false && yKeys.map((key, index) => {
            try {
              const chartHeight = config.size?.height || 400;
              const legendY = chartHeight - 30; // Position legend 30px from bottom
              const itemWidth = 80; // Space between legend items (80px = ~15px gap + text)
              const totalWidth = yKeys.length * itemWidth;
              const chartWidth = config.size?.width || 600;
              const startX = (chartWidth - totalWidth) / 2; // Center horizontally based on actual chart width
              const x = startX + (index * itemWidth);
              const label = legendFormatter ? legendFormatter(key) : key;
              
              return (
                <g key={`svg-legend-${key}`}>
                  <rect
                    x={x}
                    y={legendY}
                    width="12"
                    height="12"
                    fill={colors[key] || '#666'}
                    rx="2"
                    ry="2"
                  />
                  <text
                    x={x + 18}
                    y={legendY + 9}
                    fontSize="12"
                    fill={textColor}
                    dominantBaseline="middle"
                    textAnchor="start"
                  >
                    {label}
                  </text>
                </g>
              );
            } catch (error) {
              console.error('Legend rendering error:', error);
              return null;
            }
          })}
          {yKeys.map((key) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[key]}
              fill={colors[key]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    );

    const renderRadialChart = () => {
      const value = data[0]?.[yKeys[0]] as number || 0;
      const maxValue = 100; // Assuming percentage
      
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              data={[{ name: "Progress", value, fill: getChartColor(0) }]} 
              innerRadius="60%" 
              outerRadius="90%" 
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
            <RadialBar dataKey="value" cornerRadius={10} />
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="text-2xl font-bold fill-foreground"
            >
              {`${value}%`}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      );
    };

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
          case "radar":
            return renderRadarChart();
          case "radial":
            return renderRadialChart();
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

    const containerHeight = config.size?.height || 400;
    const containerWidth = config.size?.width || 600;
    
    return (
      <div 
        className={`${className || ""} w-full h-full flex items-center justify-center`} 
        style={{ minHeight: `${containerHeight}px` }}
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
      </div>
    );
  }
);

ChartCanvas.displayName = "ChartCanvas";

export { ChartCanvas };
