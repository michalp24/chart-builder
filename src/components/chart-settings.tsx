"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartConfig } from "@/lib/schema";
import { Settings } from "lucide-react";


interface ChartSettingsProps {
  config: ChartConfig;
  onChange: (config: ChartConfig) => void;
}

export function ChartSettings({ config, onChange }: ChartSettingsProps) {
  
  const handleHeightChange = (value: string) => {
    const height = parseInt(value) || 400; // Default to 400 if invalid
    onChange({
      ...config,
      size: {
        width: config.size?.width || 600,
        height: height
      }
    });
  };


  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Chart Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="chart-width" className="text-xs font-medium">
              Width (px)
            </Label>
            <Input
              id="chart-width"
              type="number"
              min="200"
              max="1200"
              value={config.size?.width || 600}
              onChange={(e) => onChange({
                ...config,
                size: {
                  width: parseInt(e.target.value) || 600,
                  height: config.size?.height || 400
                }
              })}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="chart-height" className="text-xs font-medium">
              Height (px)
            </Label>
            <Input
              id="chart-height"
              type="number"
              min="200"
              max="800"
              value={config.size?.height || 400}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Axis Labels */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Axis Labels</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="x-axis-label" className="text-xs font-medium">
                X-Axis Label
              </Label>
              <Input
                id="x-axis-label"
                type="text"
                placeholder="e.g., Month, Category, etc."
                value={config.axisLabels?.xAxis || ""}
                onChange={(e) => onChange({
                  ...config,
                  axisLabels: {
                    ...config.axisLabels,
                    xAxis: e.target.value || undefined
                  }
                })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="y-axis-label" className="text-xs font-medium">
                Y-Axis Label
              </Label>
              <Input
                id="y-axis-label"
                type="text"
                placeholder="e.g., Revenue, Users, Count, etc."
                value={config.axisLabels?.yAxis || ""}
                onChange={(e) => onChange({
                  ...config,
                  axisLabels: {
                    ...config.axisLabels,
                    yAxis: e.target.value || undefined
                  }
                })}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
