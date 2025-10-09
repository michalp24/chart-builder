"use client";

import React, { useEffect, useState } from "react";
import { ChartCanvas } from "@/components/chart-canvas";
import { ChartConfig, Dataset } from "@/lib/schema";

interface EmbedPageProps {
  params: { id: string };
  searchParams: { theme?: string };
}

export default function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { id } = params;
  const { theme } = searchParams;
  
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChart() {
      try {
        const response = await fetch(`/api/charts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Chart not found");
          } else {
            setError("Failed to load chart");
          }
          return;
        }

        const data = await response.json();
        setConfig(data.config);
        setDataset(data.dataset);
      } catch (err) {
        console.error("Error loading chart:", err);
        setError("Failed to load chart");
      } finally {
        setLoading(false);
      }
    }

    loadChart();
  }, [id]);

  // Apply theme if specified
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
    // "system" or undefined will use system default
  }, [theme]);

  // Calculate responsive dimensions
  const baseWidth = config?.size?.width || 600;
  const baseHeight = config?.size?.height || 400;
  const aspectRatio = baseWidth / baseHeight;

  if (loading) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  if (!config || !dataset) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted-foreground">No chart data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background relative overflow-hidden">
      {/* Responsive container that maintains aspect ratio */}
      <div 
        className="w-full relative min-h-[300px] max-h-screen"
        style={{ 
          aspectRatio: `${aspectRatio}`,
          '--chart-width': `${baseWidth}px`,
          '--chart-height': `${baseHeight}px`
        } as React.CSSProperties}
      >
        <ChartCanvas 
          config={config} 
          dataset={dataset} 
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Optional branding */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-50 z-10 pointer-events-none">
          <span className="hover:text-primary pointer-events-auto">
            Created with Chart Builder
          </span>
        </div>
      </div>
    </div>
  );
}
