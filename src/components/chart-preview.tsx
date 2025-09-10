"use client";

import React, { useRef } from "react";
import { ChartCanvas } from "./chart-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ChartConfig, Dataset } from "@/lib/schema";
import { exportSVG } from "@/lib/svg";
import { Download, Share, Settings } from "lucide-react";

interface ChartPreviewProps {
  config: ChartConfig | null;
  dataset: Dataset | null;
}

export function ChartPreview({ config, dataset }: ChartPreviewProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  const handleExportSVG = () => {
    if (svgRef.current && config) {
      const filename = `chart-${config.type}-${Date.now()}`;
      try {
        exportSVG(svgRef.current, filename);
      } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export chart. Please try again.');
      }
    }
  };

  const handleGetEmbed = async () => {
    if (!config || !dataset) return;
    
    try {
      // Save the chart first
      const response = await fetch("/api/charts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config,
          dataset,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save chart");
      }

      const result = await response.json();
      
      // Generate embed code
      const embedCode = `<iframe src="${window.location.origin}/embed/${result.id}" width="${config.size?.width || 600}" height="${config.size?.height || 400}" style="border:0"></iframe>`;
      
      await navigator.clipboard.writeText(embedCode);
      alert(`Chart saved! Embed code copied to clipboard.\n\nChart ID: ${result.id}`);
    } catch (error) {
      console.error("Error saving chart:", error);
      alert("Failed to save chart. Please try again.");
    }
  };

  if (!config || !dataset) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-muted-foreground mb-4">
          Select a chart preset to start building
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chart Display */}
      <div className="flex-1 min-h-0 mb-4">
        <div className="bg-muted/10 rounded-lg p-4 h-full flex items-center justify-center">
          <ChartCanvas 
            key={`${config.id}-${dataset.rows.length}-${JSON.stringify(dataset.rows[0] || {})}`}
            ref={svgRef}
            config={config} 
            dataset={dataset} 
            className="w-full max-w-full"
            isTooltipChart={config.tooltip?.variant ? true : false}
          />
        </div>
      </div>

      {/* Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Size Controls */}
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2">Chart Size</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Width</label>
              <Input
                type="number"
                value={config.size?.width || 600}
                min="200"
                max="1200"
                className="h-8 text-xs"
                onChange={(e) => {
                  // In a real app, this would update the config
                  console.log("Width changed:", e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Height</label>
              <Input
                type="number"
                value={config.size?.height || 400}
                min="200"
                max="800"
                className="h-8 text-xs"
                onChange={(e) => {
                  // In a real app, this would update the config
                  console.log("Height changed:", e.target.value);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Export Controls */}
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2">Export & Share</h3>
          <div className="space-y-2">
            <Button 
              onClick={handleExportSVG}
              variant="outline" 
              size="sm"
              className="w-full justify-start"
            >
              <Download className="h-3 w-3 mr-2" />
              Export SVG
            </Button>
            <Button 
              onClick={handleGetEmbed}
              variant="outline" 
              size="sm"
              className="w-full justify-start"
            >
              <Share className="h-3 w-3 mr-2" />
              Get Embed Code
            </Button>
          </div>
        </Card>

        {/* Chart Info */}
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2">Chart Info</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Type: <span className="font-mono text-foreground">{config.type}</span></div>
            <div>Data Points: <span className="font-mono text-foreground">{dataset.rows.length}</span></div>
            <div>Fields: <span className="font-mono text-foreground">{dataset.fields.length}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
