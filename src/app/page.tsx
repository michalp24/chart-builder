"use client";

import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChartGallery } from "@/components/chart-gallery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart3, LineChart, PieChart, RadarIcon, Circle } from "lucide-react";

const chartCategories = [
  { id: "area", label: "Area Charts", icon: AreaChart },
  { id: "bar", label: "Bar Charts", icon: BarChart3 },
  { id: "line", label: "Line Charts", icon: LineChart },
  { id: "pie", label: "Pie Charts", icon: PieChart },
  { id: "radar", label: "Radar Charts", icon: RadarIcon },
  { id: "radial", label: "Radial Charts", icon: Circle },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"area" | "bar" | "line" | "pie" | "radar" | "radial">("area");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chart Builder</h1>
              <p className="text-sm text-muted-foreground">
                Beautiful charts & graphs built with Recharts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Beautiful Charts & Graphs
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A collection of ready-to-use chart components. From basic charts to rich data displays, 
            click any chart to customize with your own data.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm">Browse Charts</Button>
            <Button variant="outline" size="sm">Documentation</Button>
          </div>
        </div>
      </section>

      {/* Chart Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as typeof activeCategory)}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full max-w-4xl">
                {chartCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.label}</span>
                      <span className="sm:hidden">{category.id}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {chartCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-2">{category.label}</h3>
                  <p className="text-muted-foreground">
                    Click any chart to edit data and customize styling
                  </p>
                </div>
                <ChartGallery category={category.id} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Built with Next.js, TypeScript, and Recharts
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">GitHub</Button>
              <Button variant="ghost" size="sm">Documentation</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}