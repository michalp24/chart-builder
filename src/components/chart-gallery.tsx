"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCanvas } from "./chart-canvas";
import { ChartEditorModal } from "./chart-editor-modal";
import { ChartTemplate, getTemplatesByCategory } from "@/lib/chart-templates";
import { generateChartId } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface ChartGalleryProps {
  category: "area" | "bar" | "line" | "pie" | "tooltip";
}

export function ChartGallery({ category }: ChartGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ChartTemplate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const templates = getTemplatesByCategory(category);

  const handleTemplateClick = (template: ChartTemplate) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const config = { ...template.config, id: generateChartId() };
          
          return (
            <Card 
              key={template.id}
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/20"
              onClick={() => handleTemplateClick(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="relative">
                  {/* Chart Preview */}
                  <div className="h-48 bg-muted/10 rounded-lg p-4 overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full max-w-full">
                      <ChartCanvas 
                        config={config}
                        dataset={template.dataset}
                        className="w-full h-full"
                        isTooltipChart={template.category === "tooltip"}
                      />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-center">
                      <Eye className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to Edit</p>
                    </div>
                  </div>
                </div>
                
                {/* Chart Stats */}
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>{template.dataset.rows.length} data points</span>
                  <span>{template.dataset.fields.length} fields</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ChartEditorModal 
        template={selectedTemplate}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
