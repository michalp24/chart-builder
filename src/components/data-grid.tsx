"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Table as TableType,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dataset, ChartField } from "@/lib/schema";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Separate component for secondary label input to prevent focus loss
const SecondaryLabelInput = ({ 
  initialValue, 
  onUpdate, 
  onRemove 
}: { 
  initialValue: string;
  onUpdate: (value: string) => void;
  onRemove: () => void;
}) => {
  const [value, setValue] = React.useState(initialValue);
  
  // Keep local state synchronized with external updates
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  const handleBlur = () => {
    onUpdate(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUpdate(value);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="flex items-center gap-1 flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="text-xs px-1 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded flex-1"
        placeholder="Secondary label..."
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
        onClick={onRemove}
        title="Remove secondary label"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

interface DataGridProps {
  dataset: Dataset | null;
  onChange: (dataset: Dataset) => void;
}

interface EditableCell {
  value: string | number | Date;
  onChange: (value: string | number | Date) => void;
  type?: "text" | "number";
}

function EditableCell({ value, onChange, type = "text" }: EditableCell) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ""));

  const handleSave = () => {
    const newValue = type === "number" ? Number(editValue) : editValue;
    onChange(newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value || ""));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
        className="h-8 text-sm"
        autoFocus
        type={type}
      />
    );
  }

  return (
    <div
      className="h-8 flex items-center px-2 cursor-pointer hover:bg-accent/50 rounded"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-sm">{String(value || "")}</span>
      <Edit2 className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100" />
    </div>
  );
}

export function DataGrid({ dataset, onChange }: DataGridProps) {
  const data = useMemo(() => dataset?.rows || [], [dataset?.rows]);
  const fields = useMemo(() => dataset?.fields || [], [dataset?.fields]);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if we have the first column (x-axis) for secondary labels
  const xKey = fields[0]?.key || 'month';

  const updateFieldLabel = useCallback((fieldKey: string, newLabel: string) => {
    const newFields = fields.map((field) =>
      field.key === fieldKey ? { ...field, label: newLabel } : field
    );
    const newDataset = {
      fields: newFields,
      rows: data,
    };
    onChange(newDataset);
  }, [fields, data, onChange]);

  const removeColumn = useCallback((fieldKey: string) => {
    // Don't allow deleting if there's only one column left
    if (fields.length <= 1) return;
    
    const newFields = fields.filter((field) => field.key !== fieldKey);
    const newRows = data.map((row) => {
      const newRow = { ...row };
      delete newRow[fieldKey];
      return newRow;
    });

    onChange({
      fields: newFields,
      rows: newRows,
    });
  }, [fields, data, onChange]);

  const addSecondaryLabel = useCallback((rowIndex: number) => {
    const newRows = data.map((row, index) => {
      if (index === rowIndex) {
        const xKey = fields[0]?.key || 'month';
        return {
          ...row,
          [`${xKey}_secondary`]: row[`${xKey}_secondary`] || 'Secondary label'
        };
      }
      return row;
    });

    onChange({
      fields: fields,
      rows: newRows,
    });
  }, [fields, data, onChange]);

  const updateSecondaryLabel = useCallback((rowIndex: number, value: string) => {
    const newRows = data.map((row, index) => {
      if (index === rowIndex) {
        const xKey = fields[0]?.key || 'month';
        return {
          ...row,
          [`${xKey}_secondary`]: value
        };
      }
      return row;
    });

    onChange({
      fields: fields,
      rows: newRows,
    });
  }, [fields, data, onChange]);

  const removeSecondaryLabel = useCallback((rowIndex: number) => {
    const newRows = data.map((row, index) => {
      if (index === rowIndex) {
        const xKey = fields[0]?.key || 'month';
        const { [`${xKey}_secondary`]: removed, ...rest } = row;
        return rest;
      }
      return row;
    });

    onChange({
      fields: fields,
      rows: newRows,
    });
  }, [fields, data, onChange]);

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    return fields.map((field, fieldIndex) => ({
      accessorKey: field.key,
      header: ({ column }) => (
        <div className="flex items-center justify-between group">
          <input
            type="text"
            defaultValue={field.label || field.key}
            className="bg-transparent border-none outline-none font-medium text-sm min-w-0 flex-1"
            onBlur={(e) => updateFieldLabel(field.key, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
          />
          {fields.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity ml-1"
              onClick={() => removeColumn(field.key)}
              title="Delete column"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
      cell: ({ row, column }) => {
        const isFirstColumn = fieldIndex === 0;
        const rowIndex = row.index;
        const hasSecondary = row.original[`${column.id}_secondary`];
        
        return (
          <div className="group">
            <EditableCell
              value={row.getValue(column.id)}
              onChange={(newValue) => {
                const newData = [...data];
                newData[row.index] = {
                  ...newData[row.index],
                  [column.id]: newValue,
                };
                const newDataset = {
                  fields,
                  rows: newData,
                };
                onChange(newDataset);
              }}
              type={typeof row.original[column.id] === "number" ? "number" : "text"}
            />
            {isFirstColumn && (
              <div className="flex items-center justify-between mt-1">
                {hasSecondary ? (
                  <SecondaryLabelInput
                    initialValue={hasSecondary}
                    onUpdate={(value) => updateSecondaryLabel(rowIndex, value)}
                    onRemove={() => removeSecondaryLabel(rowIndex)}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700"
                    onClick={() => addSecondaryLabel(rowIndex)}
                    title="Add secondary label"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      },
    }));
  }, [fields, data, onChange, updateFieldLabel, removeColumn, addSecondaryLabel, updateSecondaryLabel, removeSecondaryLabel]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const addRow = () => {
    const newRow: Record<string, any> = {};
    fields.forEach((field) => {
      newRow[field.key] = "";
    });
    onChange({
      fields,
      rows: [...data, newRow],
    });
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange({
      fields,
      rows: newData,
    });
  };

  const addColumn = () => {
    const newKey = `column_${fields.length + 1}`;
    const newField: ChartField = {
      key: newKey,
      label: `Column ${fields.length + 1}`,
    };
    
    // Initialize new column with numeric values (0) to make it chart-ready
    const newRows = data.map((row) => ({
      ...row,
      [newKey]: 0,
    }));

    const newDataset = {
      fields: [...fields, newField],
      rows: newRows,
    };

    onChange(newDataset);

    // Scroll to the new column after a brief delay to ensure DOM update
    setTimeout(() => {
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({
          left: tableContainerRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 100);
  };


  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <Button onClick={addRow} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
        <Button onClick={addColumn} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>

      {/* Table */}
      <div ref={tableContainerRef} className="flex-1 border rounded-md overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-2 border-b min-w-[100px] max-w-[150px] w-[120px]">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                <th className="w-12 p-2 border-b"></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group hover:bg-accent/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-1 border-b min-w-[100px] max-w-[150px] w-[120px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="p-1 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => removeRow(row.index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>No data rows yet</p>
            <Button onClick={addRow} size="sm" className="mt-2">
              Add your first row
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
