"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataGrid } from "./data-grid";
import { FileImporter } from "./file-importer";
import { JsonEditor } from "./json-editor";
import { Dataset } from "@/lib/schema";
import { Table, Upload, Code } from "lucide-react";

interface DataEditorProps {
  dataset: Dataset | null;
  onChange: (dataset: Dataset) => void;
  disabled?: boolean;
}

export function DataEditor({ dataset, onChange, disabled }: DataEditorProps) {
  const [activeTab, setActiveTab] = useState("manual");

  if (disabled) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="text-muted-foreground">
          Select a chart preset first
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 py-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-1 text-xs">
              <Table className="h-3 w-3" />
              <span>Manual</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-1 text-xs">
              <Upload className="h-3 w-3" />
              <span>Import</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-1 text-xs">
              <Code className="h-3 w-3" />
              <span>JSON</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="manual" className="h-full m-0 p-4">
            <DataGrid 
              dataset={dataset} 
              onChange={onChange}
            />
          </TabsContent>

          <TabsContent value="import" className="h-full m-0 p-4">
            <FileImporter 
              onDataImported={onChange}
              currentDataset={dataset}
            />
          </TabsContent>

          <TabsContent value="json" className="h-full m-0 p-4">
            <JsonEditor 
              dataset={dataset}
              onChange={onChange}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
