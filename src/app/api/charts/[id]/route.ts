import { NextRequest, NextResponse } from "next/server";
import { ChartConfig, Dataset, ChartConfigSchema, DatasetSchema } from "@/lib/schema";

// In-memory storage for charts (shared with main route)
interface SavedChart {
  id: string;
  config: ChartConfig;
  dataset: Dataset;
  createdAt: Date;
  updatedAt: Date;
}

// This would be shared from a database module in a real app
const charts = new Map<string, SavedChart>();

// GET /api/charts/[id] - Get a specific chart
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const chart = charts.get(id);

    if (!chart) {
      return NextResponse.json(
        { error: "Chart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: chart.id,
      config: chart.config,
      dataset: chart.dataset,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching chart:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart" },
      { status: 500 }
    );
  }
}

// PUT /api/charts/[id] - Update a specific chart
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const existingChart = charts.get(id);

    if (!existingChart) {
      return NextResponse.json(
        { error: "Chart not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { config, dataset } = body;

    // Validate the data
    const configResult = ChartConfigSchema.safeParse(config);
    const datasetResult = DatasetSchema.safeParse(dataset);

    if (!configResult.success) {
      return NextResponse.json(
        { error: "Invalid chart configuration", details: configResult.error.issues },
        { status: 400 }
      );
    }

    if (!datasetResult.success) {
      return NextResponse.json(
        { error: "Invalid dataset", details: datasetResult.error.issues },
        { status: 400 }
      );
    }

    const updatedChart: SavedChart = {
      ...existingChart,
      config: configResult.data,
      dataset: datasetResult.data,
      updatedAt: new Date(),
    };

    charts.set(id, updatedChart);

    return NextResponse.json({
      id: updatedChart.id,
      message: "Chart updated successfully",
    });
  } catch (error) {
    console.error("Error updating chart:", error);
    return NextResponse.json(
      { error: "Failed to update chart" },
      { status: 500 }
    );
  }
}

// DELETE /api/charts/[id] - Delete a specific chart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!charts.has(id)) {
      return NextResponse.json(
        { error: "Chart not found" },
        { status: 404 }
      );
    }

    charts.delete(id);

    return NextResponse.json({
      message: "Chart deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chart:", error);
    return NextResponse.json(
      { error: "Failed to delete chart" },
      { status: 500 }
    );
  }
}
