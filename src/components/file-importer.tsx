"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dataset, ChartField, inferDataType, coerceValue } from "@/lib/schema";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileImporterProps {
  onDataImported: (dataset: Dataset) => void;
  currentDataset?: Dataset | null;
}

interface ImportResult {
  success: boolean;
  message: string;
  data?: Dataset;
}

export function FileImporter({ onDataImported, currentDataset }: FileImporterProps) {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const processCSV = useCallback((file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (results) => {
          try {
            // Filter out only critical errors, ignore minor parsing issues
            const criticalErrors = results.errors.filter(error => 
              error.type === 'Delimiter' || 
              (error.type === 'FieldMismatch' && !error.message.includes('Too few fields'))
            );
            
            if (criticalErrors.length > 0) {
              resolve({
                success: false,
                message: `CSV parsing errors: ${criticalErrors[0].message}`,
              });
              return;
            }

            const rawData = results.data as Record<string, string>[];
            if (rawData.length === 0) {
              resolve({
                success: false,
                message: "No data found in CSV file",
              });
              return;
            }

            // Get field names from the first row
            const fieldNames = Object.keys(rawData[0]);
            
            // Create fields with type inference
            const fields: ChartField[] = fieldNames.map((name) => ({
              key: name,
              label: name,
            }));

            // Process rows with type coercion
            const rows = rawData
              .filter((row) => Object.values(row).some((val) => val !== ""))
              .map((row) => {
                const processedRow: Record<string, string | number | Date> = {};
                fieldNames.forEach((fieldName) => {
                  const value = row[fieldName] || "";
                  const type = inferDataType(value);
                  processedRow[fieldName] = coerceValue(value, type);
                });
                return processedRow;
              });

            const dataset: Dataset = { fields, rows };
            
            resolve({
              success: true,
              message: `Successfully imported ${rows.length} rows with ${fields.length} columns`,
              data: dataset,
            });
          } catch (error) {
            resolve({
              success: false,
              message: `Error processing CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
            });
          }
        },
        error: (error) => {
          resolve({
            success: false,
            message: `CSV parsing error: ${error.message}`,
          });
        },
      });
    });
  }, []);

  const processXLSX = useCallback((file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          
          // Get the first worksheet
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) {
            resolve({
              success: false,
              message: "No worksheets found in the file",
            });
            return;
          }

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
          
          if (jsonData.length === 0) {
            resolve({
              success: false,
              message: "No data found in the worksheet",
            });
            return;
          }

          // Get field names from the first row
          const fieldNames = Object.keys(jsonData[0]);
          
          // Create fields
          const fields: ChartField[] = fieldNames.map((name) => ({
            key: name,
            label: name,
          }));

          // Process rows with type handling
          const rows = jsonData.map((row) => {
            const processedRow: Record<string, string | number | Date> = {};
            fieldNames.forEach((fieldName) => {
              const value = row[fieldName];
              if (value !== null && value !== undefined) {
                processedRow[fieldName] = value;
              } else {
                processedRow[fieldName] = "";
              }
            });
            return processedRow;
          });

          const dataset: Dataset = { fields, rows };
          
          resolve({
            success: true,
            message: `Successfully imported ${rows.length} rows with ${fields.length} columns from sheet "${sheetName}"`,
            data: dataset,
          });
        } catch (error) {
          resolve({
            success: false,
            message: `Error processing XLSX: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          message: "Error reading the file",
        });
      };
      
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setImporting(true);
    setResult(null);
    
    try {
      let result: ImportResult;
      
      if (file.name.endsWith('.csv')) {
        result = await processCSV(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await processXLSX(file);
      } else {
        result = {
          success: false,
          message: "Unsupported file type. Please use CSV or XLSX files.",
        };
      }
      
      setResult(result);
      
      if (result.success && result.data) {
        onDataImported(result.data);
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setImporting(false);
    }
  }, [processCSV, processXLSX, onDataImported]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    disabled: importing,
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Drag & Drop Area */}
      <Card
        {...getRootProps()}
        className={cn(
          "flex-1 border-2 border-dashed cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/10",
          importing && "cursor-not-allowed opacity-50"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <input {...getInputProps()} />
          
          <div className="text-center">
            {importing ? (
              <div className="space-y-2">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground">Processing file...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop your file here" : "Import Data File"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drop a CSV or XLSX file here, or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Result */}
      {result && (
        <Card className={cn(
          "border",
          result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  result.success ? "text-green-800" : "text-red-800"
                )}>
                  {result.success ? "Import Successful" : "Import Failed"}
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  result.success ? "text-green-700" : "text-red-700"
                )}>
                  {result.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Dataset Info */}
      {currentDataset && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium">Current: </span>
                <span className="text-muted-foreground">
                  {currentDataset.rows.length} rows, {currentDataset.fields.length} columns
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2">Supported Formats</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• CSV files with headers in the first row</li>
            <li>• Excel files (.xlsx, .xls) - uses the first sheet</li>
            <li>• Data types are automatically inferred</li>
            <li>• Empty rows and columns are filtered out</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
