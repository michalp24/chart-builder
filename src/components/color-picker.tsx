"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { ChartConfig } from "@/lib/schema";
import { mapSeriesToColors } from "@/lib/colors";

// NVIDIA Color Palette organized by categories
const NVIDIA_COLOR_CATEGORIES = {
  "Green": {
    "NVIDIA Green": "#76B900",
    "Green 700": "#265600",
    "Green 500": "#3F8500", 
    "Green 100": "#BFF230",
    "Green 050": "#CFFF40",
  },
  "Teal": {
    "Teal 700": "#04554B",
    "Teal 500": "#0D8473",
    "Teal 300": "#1DBBA4",
    "Teal 100": "#9AEEF5",
    "Teal 050": "#ADDCF8",
  },
  "Blue": {
    "Blue 800": "#002781",
    "Blue 700": "#0046A4",
    "Blue 500": "#0740DF",
    "Blue 200": "#7CD7FE",
    "Blue 050": "#CBF5FF",
  },
  "Purple": {
    "Purple 800": "#4D1368",
    "Purple 700": "#7419D9",
    "Purple 600": "#952F6C",
    "Purple 400": "#C359EF",
    "Purple 100": "#F9D4FF",
  },
  "Fuchsia": {
    "Fuchsia 800": "#5D1337",
    "Fuchsia 700": "#8C1555",
    "Fuchsia 500": "#D23082",
    "Fuchsia 300": "#FC79CA",
    "Fuchsia 100": "#FFD3F2",
  },
  "Red": {
    "Red 800": "#650B0B",
    "Red 700": "#951615",
    "Red 500": "#E52020",
    "Red 300": "#FF7181",
    "Red 100": "#FFD7D1",
  },
  "Yellow": {
    "Yellow 400": "#FD6500",
    "Yellow 300": "#EF9100",
    "Yellow 200": "#F9C500",
    "Yellow 100": "#FCED7B",
    "Yellow 050": "#FEEEED",
  },
  "Gray": {
    "Gray 700": "#4B4B4B",
    "Gray 600": "#636363",
    "Gray 500": "#757575",
    "Gray 400": "#989898",
    "Gray 300": "#A7A7A7"
  }
} as const;

// Default colors (300-series + NVIDIA Green)
const DEFAULT_COLORS = [
  "#76B900", // NVIDIA Green
  "#1DBBA4", // Teal 300
  "#FC79CA", // Fuchsia 300 
  "#FF7181", // Red 300
  "#EF9100", // Yellow 300
];

// Helper function to find color name by hex value
const getColorName = (hexValue: string): string => {
  for (const [category, colors] of Object.entries(NVIDIA_COLOR_CATEGORIES)) {
    for (const [name, hex] of Object.entries(colors)) {
      if (hex === hexValue) {
        return name;
      }
    }
  }
  return hexValue; // Fallback to hex value if name not found
};

interface ColorPickerProps {
  config: ChartConfig;
  onConfigChange: (newConfig: ChartConfig) => void;
  yKeys: string[];
}

export function ColorPicker({ config, onConfigChange, yKeys }: ColorPickerProps) {
  const currentColors = config.colors || {};

  const handleColorChange = (yKey: string, color: string) => {
    const newColors = { ...currentColors, [yKey]: color };
    onConfigChange({ ...config, colors: newColors });
  };

  const resetToDefaults = () => {
    // Use the stable color assignment logic from colors.ts
    const defaultColorMap = mapSeriesToColors(yKeys, true, {});
    onConfigChange({ ...config, colors: defaultColorMap });
  };

  const getColorForKey = (yKey: string, index: number): string => {
    // First check if user has set a custom color
    if (currentColors[yKey]) {
      return currentColors[yKey];
    }
    
    // Otherwise use stable color assignment logic
    const stableColors = mapSeriesToColors(yKeys, true, {});
    return stableColors[yKey];
  };

  if (yKeys.length === 0) {
    return null;
  }

  return (
    <Card className="p-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          Category Colors
        </CardTitle>
        <Button
          onClick={resetToDefaults}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          Reset
        </Button>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {yKeys.map((yKey, index) => {
            const currentColor = getColorForKey(yKey, index);
            const currentColorName = getColorName(currentColor);
            
            return (
              <div key={yKey} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: currentColor }}
                  />
                  <span className="text-sm font-medium truncate">{yKey}</span>
                </div>
                
                {/* Color Dropdown */}
                <Select 
                  value={currentColor} 
                  onValueChange={(color) => handleColorChange(yKey, color)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded border border-gray-300"
                          style={{ backgroundColor: currentColor }}
                        />
                        <span className="truncate">{currentColorName}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(NVIDIA_COLOR_CATEGORIES).map(([categoryName, colors]) => (
                      <div key={categoryName}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {categoryName}
                        </div>
                        {Object.entries(colors).map(([colorName, colorValue]) => (
                          <SelectItem key={colorName} value={colorValue}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded border border-gray-300"
                                style={{ backgroundColor: colorValue }}
                              />
                              <span>{colorName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
