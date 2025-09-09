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
} from "recharts";
import { ChartConfig, Dataset } from "@/lib/schema";
import { getChartColor, mapSeriesToColors } from "@/lib/colors";

interface ChartCanvasProps {
  config: ChartConfig;
  dataset: Dataset;
  className?: string;
}

const ChartCanvas = forwardRef<SVGSVGElement, ChartCanvasProps>(
  ({ config, dataset, className }, ref) => {
    const { type, xKey, yKeys = [], size = { width: 600, height: 400 } } = config;


    if (!dataset?.rows?.length) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data to display
        </div>
      );
    }

    const colors = mapSeriesToColors(yKeys);
    const data = dataset.rows;

    // Create a mapping from field keys to labels for the legend
    const fieldLabelMap = dataset.fields.reduce((acc, field) => {
      acc[field.key] = field.label || field.key;
      return acc;
    }, {} as Record<string, string>);


    // Custom legend formatter to use field labels instead of keys
    const legendFormatter = (value: string) => {
      return fieldLabelMap[value] || value;
    };

    // Custom tooltip formatter to use field labels instead of keys
    const tooltipLabelFormatter = (label: any) => {
      if (xKey && fieldLabelMap[xKey]) {
        return fieldLabelMap[xKey];
      }
      return label;
    };

    const tooltipFormatter = (value: any, name: string) => {
      const label = fieldLabelMap[name] || name;
      return [value, label];
    };

    const renderAreaChart = () => (
      <ResponsiveContainer width="100%" height={size.height}>
        <AreaChart data={data} ref={ref}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
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
          {config.legend && <Legend formatter={legendFormatter} />}
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

    const renderBarChart = () => (
      <ResponsiveContainer width="100%" height={size.height}>
        <BarChart data={data} ref={ref}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
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
          {config.legend && <Legend formatter={legendFormatter} />}
          {yKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[key]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );

    const renderLineChart = () => (
      <ResponsiveContainer width="100%" height={size.height}>
        <LineChart data={data} ref={ref}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
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
          {config.legend && <Legend formatter={legendFormatter} />}
          {yKeys.map((key) => (
            <Line
              key={key}
              type={config.stepped ? "stepAfter" : "monotone"}
              dataKey={key}
              stroke={colors[key]}
              strokeWidth={2}
              dot={{ fill: colors[key], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );

    const renderPieChart = () => (
      <ResponsiveContainer width="100%" height={size.height}>
        <PieChart ref={ref}>
          <Pie
            data={data}
            dataKey={yKeys[0]}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={Math.min(size.width, size.height) * 0.3}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getChartColor(index)} />
            ))}
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
          {config.legend && <Legend formatter={legendFormatter} />}
        </PieChart>
      </ResponsiveContainer>
    );

    const renderRadarChart = () => (
      <ResponsiveContainer width="100%" height={size.height}>
        <RadarChart data={data} ref={ref}>
          <PolarGrid />
          <PolarAngleAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fontSize: 12 }} />
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
          {config.legend && <Legend formatter={legendFormatter} />}
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
        <ResponsiveContainer width="100%" height={size.height}>
          <RadialBarChart 
            data={[{ name: "Progress", value, fill: getChartColor(0) }]} 
            innerRadius="60%" 
            outerRadius="90%" 
            ref={ref}
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
          return <div>Unsupported chart type</div>;
      }
    };

    return (
      <div className={className} style={{ width: "100%", height: size.height }}>
        {renderChart()}
      </div>
    );
  }
);

ChartCanvas.displayName = "ChartCanvas";

export { ChartCanvas };
