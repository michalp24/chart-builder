import { NextRequest, NextResponse } from "next/server";
import { ChartConfigSchema, DatasetSchema } from "@/lib/schema";
import { chartStorage, SavedChart } from "@/lib/chart-storage";

// GET /api/charts/[id] - Get a specific chart
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const chart = chartStorage.getById(id);

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
    const existingChart = chartStorage.getById(id);

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

    chartStorage.save(updatedChart);

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
    
    if (!chartStorage.has(id)) {
      return NextResponse.json(
        { error: "Chart not found" },
        { status: 404 }
      );
    }

    chartStorage.delete(id);

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
