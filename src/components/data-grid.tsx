"use client";

import React, { useMemo, useState } from "react";
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
import { Plus, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const data = dataset?.rows || [];
  const fields = dataset?.fields || [];

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    return fields.map((field) => ({
      accessorKey: field.key,
      header: field.label || field.key,
      cell: ({ row, column }) => (
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
      ),
    }));
  }, [fields, data, onChange]);

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
    
    const newRows = data.map((row) => ({
      ...row,
      [newKey]: "",
    }));

    onChange({
      fields: [...fields, newField],
      rows: newRows,
    });
  };

  const updateFieldLabel = (fieldKey: string, newLabel: string) => {
    const newFields = fields.map((field) =>
      field.key === fieldKey ? { ...field, label: newLabel } : field
    );
    const newDataset = {
      fields: newFields,
      rows: data,
    };
    onChange(newDataset);
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
      <div className="flex-1 border rounded-md overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-2 border-b">
                    <Input
                      value={
                        fields.find((f) => f.key === header.id)?.label ||
                        header.id
                      }
                      onChange={(e) =>
                        updateFieldLabel(header.id, e.target.value)
                      }
                      className="h-8 text-sm font-medium bg-transparent border-none p-1"
                      placeholder="Column name..."
                    />
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
                  <td key={cell.id} className="p-1 border-b">
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
