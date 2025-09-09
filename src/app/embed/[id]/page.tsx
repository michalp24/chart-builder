"use client";

import React, { useEffect, useState } from "react";
import { ChartCanvas } from "@/components/chart-canvas";
import { ChartConfig, Dataset } from "@/lib/schema";
import { use } from "react";

interface EmbedPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ theme?: string }>;
}

export default function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const { id } = resolvedParams;
  const { theme } = resolvedSearchParams;
  
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  if (!config || !dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted-foreground">No chart data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-full mx-auto">
        <ChartCanvas 
          config={config} 
          dataset={dataset} 
          className="w-full h-full"
        />
      </div>
      
      {/* Optional branding */}
      <div className="fixed bottom-2 right-2 text-xs text-muted-foreground">
        <a 
          href={window.location.origin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary"
        >
          Created with Chart Builder
        </a>
      </div>
    </div>
  );
}
