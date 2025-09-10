"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartCanvas } from "./chart-canvas";
import { DataEditor } from "./data-editor";
import { ChartSettings } from "./chart-settings";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartTemplate } from "@/lib/chart-templates";
import { ChartConfig, Dataset, generateChartId } from "@/lib/schema";
import { exportSVG } from "@/lib/svg";
import { Download, Share } from "lucide-react";

interface ChartEditorModalProps {
  template: ChartTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChartEditorModal({ template, open, onOpenChange }: ChartEditorModalProps) {
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const svgRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (template) {
      setConfig({
        ...template.config,
        id: generateChartId(),
      });
      setDataset(template.dataset);
    }
  }, [template]);

  // Update chart config when dataset changes (for new columns)
  useEffect(() => {
    if (config && dataset?.rows?.length) {
      try {
        const numericFields = dataset.fields.filter(field => {
          // Check if this field contains numeric data in any row
          const hasNumericData = dataset.rows.some(row => {
            const value = row[field.key];
            return typeof value === 'number' && !isNaN(value);
          });
          return hasNumericData;
        });

        // Update yKeys to include all numeric fields except the xKey
        const newYKeys = numericFields
          .filter(field => field.key !== config.xKey)
          .map(field => field.key);

        // Only update if there's actually a change and we have valid yKeys
        if (newYKeys.length > 0 && JSON.stringify(newYKeys.sort()) !== JSON.stringify((config.yKeys || []).sort())) {
          setConfig(prev => prev ? {
            ...prev,
            yKeys: newYKeys
          } : null);
        }
      } catch (error) {
        console.error('Error updating yKeys:', error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset?.fields, dataset?.rows?.length, config?.xKey]); // More specific dependencies

  const handleExportSVG = () => {
    if (svgRef.current && config) {
      const filename = `${config.type}-chart-${Date.now()}`;
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
      const embedCode = `<iframe src="${window.location.origin}/embed/${result.id}" width="${config.size?.width || 600}" height="${config.size?.height || 400}" style="border:0"></iframe>`;
      
      await navigator.clipboard.writeText(embedCode);
      alert(`Chart saved! Embed code copied to clipboard.\n\nChart ID: ${result.id}`);
    } catch (error) {
      console.error("Error saving chart:", error);
      alert("Failed to save chart. Please try again.");
    }
  };

  if (!template || !config || !dataset) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{template.title}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Left Side - Data Editor */}
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">Edit Data</h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Chart Settings */}
              <ChartSettings 
                config={config}
                onChange={setConfig}
              />
              
              {/* Color Picker */}
              <ColorPicker 
                config={config}
                onConfigChange={setConfig}
                yKeys={config.yKeys || []}
              />
              
              {/* Data Editor */}
              <Card className="flex-1 overflow-hidden min-h-[300px]">
                <DataEditor 
                  dataset={dataset}
                  onChange={setDataset}
                  disabled={false}
                />
              </Card>
            </div>
          </div>

          {/* Right Side - Chart Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="flex gap-2">
                <Button onClick={handleExportSVG} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export SVG
                </Button>
                <Button onClick={handleGetEmbed} variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Get Embed
                </Button>
              </div>
            </div>
            
            <Card className="flex-1 p-4">
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-full h-full max-w-full">
                  <ChartCanvas 
                    key={`${config.id}-${dataset.rows.length}-${JSON.stringify(dataset.rows[0] || {})}`}
                    ref={svgRef}
                    config={config} 
                    dataset={dataset} 
                    className="w-full h-full"
                    isTooltipChart={template?.category === "tooltip"}
                  />
                </div>
              </div>
            </Card>

            {/* Chart Info */}
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Type: <span className="font-mono text-foreground">{config.type}</span></div>
                <div>Data Points: <span className="font-mono text-foreground">{dataset.rows.length}</span></div>
                <div>Fields: <span className="font-mono text-foreground">{dataset.fields.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
