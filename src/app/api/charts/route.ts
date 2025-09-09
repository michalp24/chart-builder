import { NextRequest, NextResponse } from "next/server";
import { ChartConfig, Dataset, ChartConfigSchema, DatasetSchema } from "@/lib/schema";

// In-memory storage for charts
// In production, this would be replaced with a database
interface SavedChart {
  id: string;
  config: ChartConfig;
  dataset: Dataset;
  createdAt: Date;
  updatedAt: Date;
}

const charts = new Map<string, SavedChart>();

// GET /api/charts - List all charts
export async function GET() {
  try {
    const chartList = Array.from(charts.values()).map(chart => ({
      id: chart.id,
      type: chart.config.type,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
      dataPoints: chart.dataset.rows.length,
      fields: chart.dataset.fields.length,
    }));

    return NextResponse.json({ charts: chartList });
  } catch (error) {
    console.error("Error listing charts:", error);
    return NextResponse.json(
      { error: "Failed to list charts" },
      { status: 500 }
    );
  }
}

// POST /api/charts - Create a new chart
export async function POST(request: NextRequest) {
  try {
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

    const savedChart: SavedChart = {
      id: configResult.data.id,
      config: configResult.data,
      dataset: datasetResult.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    charts.set(savedChart.id, savedChart);

    return NextResponse.json({
      id: savedChart.id,
      message: "Chart saved successfully",
    });
  } catch (error) {
    console.error("Error saving chart:", error);
    return NextResponse.json(
      { error: "Failed to save chart" },
      { status: 500 }
    );
  }
}
