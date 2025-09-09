"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartConfig, Dataset, ChartType, generateChartId } from "@/lib/schema";
import { AreaChart, BarChart3, LineChart, PieChart, RadarIcon, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PresetGalleryProps {
  onSelect: (config: ChartConfig, dataset: Dataset) => void;
  selected?: ChartType;
}

interface PresetItem {
  type: ChartType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  config: Omit<ChartConfig, "id">;
  sampleData: Dataset;
}

const PRESETS: PresetItem[] = [
  {
    type: "area",
    title: "Area Chart",
    description: "Show trends over time with filled areas",
    icon: AreaChart,
    config: {
      type: "area",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      gradient: true,
      size: { width: 600, height: 400 },
    },
    sampleData: {
      fields: [
        { key: "month", label: "Month" },
        { key: "desktop", label: "Desktop" },
        { key: "mobile", label: "Mobile" },
      ],
      rows: [
        { month: "Jan", desktop: 186, mobile: 80 },
        { month: "Feb", desktop: 305, mobile: 200 },
        { month: "Mar", desktop: 237, mobile: 120 },
        { month: "Apr", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "Jun", desktop: 214, mobile: 140 },
      ],
    },
  },
  {
    type: "bar",
    title: "Bar Chart",
    description: "Compare values across categories",
    icon: BarChart3,
    config: {
      type: "bar",
      xKey: "name",
      yKeys: ["total"],
      legend: false,
      size: { width: 600, height: 400 },
    },
    sampleData: {
      fields: [
        { key: "name", label: "Category" },
        { key: "total", label: "Total" },
      ],
      rows: [
        { name: "A", total: 275 },
        { name: "B", total: 200 },
        { name: "C", total: 187 },
        { name: "D", total: 173 },
        { name: "E", total: 90 },
      ],
    },
  },
  {
    type: "line",
    title: "Line Chart",
    description: "Track changes over time",
    icon: LineChart,
    config: {
      type: "line",
      xKey: "month",
      yKeys: ["desktop", "mobile"],
      legend: true,
      size: { width: 600, height: 400 },
    },
    sampleData: {
      fields: [
        { key: "month", label: "Month" },
        { key: "desktop", label: "Desktop" },
        { key: "mobile", label: "Mobile" },
      ],
      rows: [
        { month: "Jan", desktop: 186, mobile: 80 },
        { month: "Feb", desktop: 305, mobile: 200 },
        { month: "Mar", desktop: 237, mobile: 120 },
        { month: "Apr", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "Jun", desktop: 214, mobile: 140 },
      ],
    },
  },
  {
    type: "pie",
    title: "Pie Chart",
    description: "Show proportions and percentages",
    icon: PieChart,
    config: {
      type: "pie",
      xKey: "browser",
      yKeys: ["visitors"],
      legend: true,
      size: { width: 400, height: 400 },
    },
    sampleData: {
      fields: [
        { key: "browser", label: "Browser" },
        { key: "visitors", label: "Visitors" },
      ],
      rows: [
        { browser: "chrome", visitors: 275 },
        { browser: "safari", visitors: 200 },
        { browser: "firefox", visitors: 187 },
        { browser: "edge", visitors: 173 },
        { browser: "other", visitors: 90 },
      ],
    },
  },
  {
    type: "radar",
    title: "Radar Chart",
    description: "Compare multiple variables",
    icon: RadarIcon,
    config: {
      type: "radar",
      xKey: "subject",
      yKeys: ["A", "B"],
      legend: true,
      size: { width: 500, height: 500 },
    },
    sampleData: {
      fields: [
        { key: "subject", label: "Subject" },
        { key: "A", label: "Student A" },
        { key: "B", label: "Student B" },
      ],
      rows: [
        { subject: "Math", A: 120, B: 110 },
        { subject: "Chinese", A: 98, B: 130 },
        { subject: "English", A: 86, B: 130 },
        { subject: "Geography", A: 99, B: 100 },
        { subject: "Physics", A: 85, B: 90 },
        { subject: "History", A: 65, B: 85 },
      ],
    },
  },
  {
    type: "radial",
    title: "Radial Chart",
    description: "Show progress or completion",
    icon: Circle,
    config: {
      type: "radial",
      xKey: "name",
      yKeys: ["value"],
      legend: false,
      size: { width: 400, height: 400 },
    },
    sampleData: {
      fields: [
        { key: "name", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      rows: [
        { name: "Progress", value: 72 },
      ],
    },
  },
];

export function PresetGallery({ onSelect, selected }: PresetGalleryProps) {
  const handleSelect = (preset: PresetItem) => {
    const config: ChartConfig = {
      ...preset.config,
      id: generateChartId(),
    };
    onSelect(config, preset.sampleData);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {PRESETS.map((preset) => {
        const Icon = preset.icon;
        const isSelected = selected === preset.type;
        
        return (
          <Card 
            key={preset.type} 
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent/50",
              isSelected && "ring-2 ring-primary bg-accent/30"
            )}
            onClick={() => handleSelect(preset)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <CardTitle className="text-base">{preset.title}</CardTitle>
              </div>
              <CardDescription className="text-xs">
                {preset.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant={isSelected ? "default" : "outline"} 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(preset);
                }}
              >
                {isSelected ? "Selected" : "Use Template"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
