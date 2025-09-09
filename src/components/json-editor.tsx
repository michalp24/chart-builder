"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dataset, DatasetSchema } from "@/lib/schema";
import { AlertCircle, CheckCircle, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonEditorProps {
  dataset: Dataset | null;
  onChange: (dataset: Dataset) => void;
}

export function JsonEditor({ dataset, onChange }: JsonEditorProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (dataset) {
      setJsonText(JSON.stringify(dataset, null, 2));
    }
  }, [dataset]);

  const validateAndParseJson = (text: string) => {
    try {
      if (!text.trim()) {
        setError(null);
        setIsValid(false);
        return;
      }

      const parsed = JSON.parse(text);
      const result = DatasetSchema.safeParse(parsed);
      
      if (result.success) {
        setError(null);
        setIsValid(true);
        return result.data;
      } else {
        setError(`Validation error: ${result.error.issues[0].message}`);
        setIsValid(false);
        return null;
      }
    } catch (e) {
      setError(`JSON syntax error: ${e instanceof Error ? e.message : "Invalid JSON"}`);
      setIsValid(false);
      return null;
    }
  };

  const handleTextChange = (value: string) => {
    setJsonText(value);
    validateAndParseJson(value);
  };

  const handleApplyChanges = () => {
    const parsed = validateAndParseJson(jsonText);
    if (parsed) {
      onChange(parsed);
    }
  };

  const handleLoadSample = () => {
    const sampleData: Dataset = {
      fields: [
        { key: "category", label: "Category" },
        { key: "value", label: "Value" },
        { key: "percentage", label: "Percentage" },
      ],
      rows: [
        { category: "A", value: 100, percentage: 25 },
        { category: "B", value: 150, percentage: 37.5 },
        { category: "C", value: 75, percentage: 18.75 },
        { category: "D", value: 75, percentage: 18.75 },
      ],
    };
    
    const jsonString = JSON.stringify(sampleData, null, 2);
    setJsonText(jsonString);
    validateAndParseJson(jsonString);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="text-sm font-medium">JSON Data Editor</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLoadSample} variant="outline" size="sm">
            Load Sample
          </Button>
          <Button 
            onClick={handleApplyChanges} 
            disabled={!isValid}
            size="sm"
          >
            Apply Changes
          </Button>
        </div>
      </div>

      {/* Status */}
      {(error || isValid) && (
        <Card className={cn(
          "border",
          error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
        )}>
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              {error ? (
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  error ? "text-red-800" : "text-green-800"
                )}>
                  {error ? "Invalid JSON" : "Valid JSON"}
                </p>
                {error && (
                  <p className="text-xs mt-1 text-red-700">{error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <Card className="flex-1">
        <CardContent className="p-0 h-full">
          <textarea
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-full min-h-[300px] p-4 font-mono text-sm resize-none border-none outline-none bg-transparent"
            placeholder="Enter JSON data here..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">JSON Format</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground space-y-2">
            <p>Expected structure:</p>
            <pre className="bg-muted/50 p-2 rounded text-[11px] font-mono overflow-x-auto">
{`{
  "fields": [
    { "key": "string", "label": "string" }
  ],
  "rows": [
    { "key": "value", ... }
  ]
}`}
            </pre>
            <div className="space-y-1">
              <p>• <code>fields</code>: Array of column definitions</p>
              <p>• <code>rows</code>: Array of data objects</p>
              <p>• Values can be strings, numbers, or dates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
