"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, ExternalLink, Palette, Download, Settings, Grid3X3, LineChart, BarChart3, PieChart, AreaChart } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const embedCode = `<iframe src="https://your-domain.com/embed/chart-id" width="600" height="400" style="border:0"></iframe>`;
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart Embed Example</title>
    
    <!-- Required for proper styling - Choose one: -->
    
    <!-- Option 1: CDN (Development only - not for production) -->
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    
    <!-- Option 2: Self-hosted CSS (Recommended for production) -->
    <link href="/path/to/tailwind.css" rel="stylesheet">
    
    <!-- Optional: Custom theme variables -->
    <style>
        :root {
            --chart-1: #76B900;           /* NVIDIA Green */
            --chart-2: #A7A7A7;          /* Gray 300 */
            --chart-3: #858585;          /* Gray 400 */
            --chart-4: #666666;          /* Gray 500 */
            --chart-5: #525252;          /* Gray 600 */
            --background: 0, 0%, 100%;
            --foreground: 222.2, 84%, 4.9%;
            --border: 214.3, 31.8%, 91.4%;
        }
        
        .dark {
            --chart-1: #76B900;          /* NVIDIA Green */
            --chart-2: #A7A7A7;          /* Gray 300 */
            --chart-3: #858585;          /* Gray 400 */
            --chart-4: #666666;          /* Gray 500 */
            --chart-5: #525252;          /* Gray 600 */
            --background: 222.2, 84%, 4.9%;
            --foreground: 210, 40%, 98%;
            --border: 217.2, 32.6%, 17.5%;
        }
        
        /* Ensure chart container is responsive */
        .chart-container {
            width: 100%;
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto p-8">
        <h1 class="text-2xl font-bold mb-6">My Dashboard</h1>
        
        <!-- Chart Embed -->
        <div class="chart-container bg-white rounded-lg shadow p-4">
            <iframe 
                src="https://your-domain.com/embed/chart-id" 
                width="100%" 
                height="400" 
                style="border:0;"
                loading="lazy">
            </iframe>
        </div>
    </div>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chart Builder
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Documentation</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5" />
                Chart Builder Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A powerful, flexible chart building platform designed for creating beautiful, interactive data visualizations. 
                Built with Next.js, TypeScript, and Recharts, featuring NVIDIA-themed styling and professional design standards.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">✨ Key Features</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 20+ chart templates across multiple types</li>
                    <li>• Interactive data editing with CSV import</li>
                    <li>• Real-time preview and customization</li>
                    <li>• SVG export functionality</li>
                    <li>• Responsive embed system</li>
                    <li>• NVIDIA Green color scheme</li>
                    <li>• Light/dark theme support</li>
                    <li>• Professional typography with NVIDIA fonts</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">🎯 Use Cases</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Business dashboards and reports</li>
                    <li>• Website analytics displays</li>
                    <li>• Presentation graphics</li>
                    <li>• Data storytelling</li>
                    <li>• Marketing materials</li>
                    <li>• Academic research visualization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Available Chart Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AreaChart className="h-4 w-4 text-emerald-600" />
                    <h3 className="font-semibold">Area Charts</h3>
                    <Badge variant="secondary">8 variants</Badge>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-6">
                    <li>• Basic filled areas</li>
                    <li>• Stacked area displays</li>
                    <li>• Gradient backgrounds</li>
                    <li>• Step-based progressions</li>
                    <li>• Multi-series comparisons</li>
                    <li>• Percentage stacked views</li>
                    <li>• Icon-enhanced displays</li>
                    <li>• Custom axis configurations</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold">Bar Charts</h3>
                    <Badge variant="secondary">7 variants</Badge>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-6">
                    <li>• Vertical and horizontal bars</li>
                    <li>• Multi-series comparisons</li>
                    <li>• Stacked bar displays</li>
                    <li>• Data labels and annotations</li>
                    <li>• Mixed bar + line combos</li>
                    <li>• Negative value support</li>
                    <li>• Custom bar spacing</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold">Line Charts</h3>
                    <Badge variant="secondary">4 variants</Badge>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-6">
                    <li>• Single and multi-line plots</li>
                    <li>• Dot markers and smooth curves</li>
                    <li>• Step-based progressions</li>
                    <li>• Trend analysis displays</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-orange-600" />
                    <h3 className="font-semibold">Pie Charts</h3>
                    <Badge variant="secondary">4 variants</Badge>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-6">
                    <li>• Traditional pie slices</li>
                    <li>• Donut charts with center text</li>
                    <li>• Interactive hover states</li>
                    <li>• Custom slice highlighting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Styling & Theming
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• NVIDIA Green primary color</li>
                    <li>• Grayscale secondary palette</li>
                    <li>• Light/dark theme support</li>
                    <li>• Custom axis labels</li>
                    <li>• Secondary x-axis labels</li>
                    <li>• Top-right legend positioning</li>
                    <li>• 12px tooltips with color indicators</li>
                    <li>• Professional typography</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Data Management
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Interactive data grid editor</li>
                    <li>• CSV file import support</li>
                    <li>• Dynamic column management</li>
                    <li>• Add/remove data columns</li>
                    <li>• Real-time data validation</li>
                    <li>• Smart data type detection</li>
                    <li>• Bulk data operations</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export & Embed
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• High-quality SVG export</li>
                    <li>• Responsive iframe embeds</li>
                    <li>• Pixel-perfect legend export</li>
                    <li>• Theme-consistent exports</li>
                    <li>• 400px default chart height</li>
                    <li>• Mobile-optimized displays</li>
                    <li>• Copy embed code functionality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Choose a Chart Template</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Browse through 20+ professionally designed chart templates organized by type (Area, Bar, Line, Pie).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Customize Your Data</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click any chart to open the editor. Import CSV files, edit data directly in the grid, or use sample data to get started.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Configure Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Adjust chart dimensions (200-1200px width, 200-800px height), add axis labels for context, and customize colors.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Export or Embed</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Download as SVG for presentations or copy the embed code for websites. All exports maintain pixel-perfect quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embedding */}
          <Card>
            <CardHeader>
              <CardTitle>Embedding Charts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Embed your charts into external websites and applications with responsive, mobile-optimized displays.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Basic Embed Code</h3>
                <div className="bg-slate-50 dark:bg-slate-800 border rounded p-3 relative group">
                  <code className="text-sm font-mono block text-slate-800 dark:text-slate-200">{embedCode}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(embedCode)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dependencies */}
          <Card>
            <CardHeader>
              <CardTitle>Required Dependencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div>
                <h3 className="font-semibold mb-3">CSS Framework (Required)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Charts require Tailwind CSS for proper styling and responsiveness.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Recommended</Badge>
                      <Badge variant="secondary">NPM Install</Badge>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded p-3">
                      <code className="text-sm text-slate-800 dark:text-slate-200">{`npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`}</code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Build your own CSS file for production use
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">Development Only</Badge>
                      <Badge variant="secondary">CDN</Badge>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded p-3">
                      <code className="text-sm text-slate-800 dark:text-slate-200">{`<script src="https://cdn.tailwindcss.com"></script>`}</code>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      ⚠️ Not recommended for production - may show console warnings
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">NVIDIA Color Theme Variables</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For consistent NVIDIA Green theming and grayscale secondary colors:
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-800 dark:text-slate-200">
{`:root {
    --chart-1: #76B900;      /* NVIDIA Green */
    --chart-2: #A7A7A7;      /* Gray 300 */
    --chart-3: #858585;      /* Gray 400 */
    --chart-4: #666666;      /* Gray 500 */
    --chart-5: #525252;      /* Gray 600 */
    
    --background: 0, 0%, 100%;
    --foreground: 222.2, 84%, 4.9%;
    --border: 214.3, 31.8%, 91.4%;
}

.dark {
    --chart-1: #76B900;      /* NVIDIA Green */
    --chart-2: #A7A7A7;      /* Gray 300 */
    --chart-3: #858585;      /* Gray 400 */
    --chart-4: #666666;      /* Gray 500 */
    --chart-5: #525252;      /* Gray 600 */
    
    --background: 222.2, 84%, 4.9%;
    --foreground: 210, 40%, 98%;
    --border: 217.2, 32.6%, 17.5%;
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Complete HTML Example 
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A complete HTML page showing how to properly embed charts with NVIDIA theming and all dependencies:
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded p-4 overflow-x-auto relative group max-h-96 overflow-y-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => copyToClipboard(htmlTemplate)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <pre className="text-sm">
                  <code className="text-slate-800 dark:text-slate-200">{htmlTemplate}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Do</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Include Tailwind CSS for proper styling</li>
                    <li>• Use 400px height for optimal display</li>
                    <li>• Add axis labels for data context</li>
                    <li>• Test responsive behavior on mobile</li>
                    <li>• Include NVIDIA theme variables</li>
                    <li>• Use loading=&quot;lazy&quot; for performance</li>
                    <li>• Maintain consistent color schemes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Don&apos;t</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Forget Tailwind CSS dependency</li>
                    <li>• Set fixed heights that break responsiveness</li>
                    <li>• Override NVIDIA Green with other colors</li>
                    <li>• Mix conflicting CSS frameworks</li>
                    <li>• Ignore secondary axis label positioning</li>
                    <li>• Use non-standard font weights on axis ticks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Chart not displaying properly?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Ensure Tailwind CSS is loaded and functional</li>
                    <li>• Check that the iframe URL is accessible</li>
                    <li>• Verify container has proper dimensions (400px height recommended)</li>
                    <li>• Check browser console for JavaScript errors</li>
                    <li>• Confirm embed URL is correct and chart ID exists</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Colors not matching NVIDIA theme?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Include the NVIDIA CSS variables shown above</li>
                    <li>• Ensure no conflicting CSS is overriding chart colors</li>
                    <li>• Check if dark mode class is applied correctly</li>
                    <li>• Verify NVIDIA Green (#76B900) is displaying as primary color</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Legend or labels positioning issues?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Legend should appear in top-right corner</li>
                    <li>• Axis labels should be centered on chart grid area</li>
                    <li>• Secondary labels should appear 30px below primary labels</li>
                    <li>• Check that chart margins accommodate all labels</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}