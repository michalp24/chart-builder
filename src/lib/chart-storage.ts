import { ChartConfig, Dataset } from "./schema";
import fs from 'fs';
import path from 'path';

// Shared storage for charts with file persistence in development
// In production, this would be replaced with a database
export interface SavedChart {
  id: string;
  config: ChartConfig;
  dataset: Dataset;
  createdAt: Date;
  updatedAt: Date;
}

// Storage file path (in development)
const STORAGE_DIR = path.join(process.cwd(), '.chart-storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'charts.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Load charts from file (development persistence)
function loadChartsFromFile(): Map<string, SavedChart> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const chartsArray = JSON.parse(data) as SavedChart[];
      const chartsMap = new Map<string, SavedChart>();
      
      chartsArray.forEach(chart => {
        // Convert date strings back to Date objects
        chart.createdAt = new Date(chart.createdAt);
        chart.updatedAt = new Date(chart.updatedAt);
        chartsMap.set(chart.id, chart);
      });
      
      console.log(`Loaded ${chartsArray.length} charts from file`);
      return chartsMap;
    }
  } catch (error) {
    console.error('Error loading charts from file:', error);
  }
  
  return new Map<string, SavedChart>();
}

// Save charts to file (development persistence)
function saveChartsToFile(charts: Map<string, SavedChart>): void {
  try {
    const chartsArray = Array.from(charts.values());
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(chartsArray, null, 2));
    console.log(`Saved ${chartsArray.length} charts to file`);
  } catch (error) {
    console.error('Error saving charts to file:', error);
  }
}

// Initialize charts with persistence
let charts = loadChartsFromFile();

// Storage functions
export const chartStorage = {
  // Get all charts
  getAll(): SavedChart[] {
    return Array.from(charts.values());
  },

  // Get chart by ID
  getById(id: string): SavedChart | undefined {
    return charts.get(id);
  },

  // Save or update chart
  save(chart: SavedChart): void {
    charts.set(chart.id, chart);
    saveChartsToFile(charts); // Persist to file
  },

  // Delete chart
  delete(id: string): boolean {
    const result = charts.delete(id);
    if (result) {
      saveChartsToFile(charts); // Persist to file
    }
    return result;
  },

  // Check if chart exists
  has(id: string): boolean {
    return charts.has(id);
  },

  // Get chart count
  size(): number {
    return charts.size;
  }
};
