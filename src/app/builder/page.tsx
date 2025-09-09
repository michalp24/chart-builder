"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PresetGallery } from "@/components/preset-gallery";
import { DataEditor } from "@/components/data-editor";
import { ChartPreview } from "@/components/chart-preview";
import { ChartConfig, Dataset } from "@/lib/schema";

export default function BuilderPage() {
  const [selectedConfig, setSelectedConfig] = useState<ChartConfig | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Chart Builder</h1>
          <p className="text-muted-foreground">Choose a preset, add your data, and export your chart</p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-160px)]">
          {/* Left Panel - Presets */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Chart Presets</h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <PresetGallery 
                  onSelect={(config, sampleData) => {
                    setSelectedConfig(config);
                    setDataset(sampleData);
                  }}
                  selected={selectedConfig?.type}
                />
              </div>
            </Card>
          </div>

          {/* Center Panel - Data */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Data</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <DataEditor 
                  dataset={dataset}
                  onChange={setDataset}
                  disabled={!selectedConfig}
                />
              </div>
            </Card>
          </div>

          {/* Right Panel - Preview & Export */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Preview & Export</h2>
              </div>
              <div className="flex-1 p-4 overflow-hidden">
                <ChartPreview 
                  config={selectedConfig}
                  dataset={dataset}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
