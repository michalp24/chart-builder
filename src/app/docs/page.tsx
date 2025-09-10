"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
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
            --chart-1: 12, 76%, 61%;
            --chart-2: 173, 58%, 39%;
            --chart-3: 197, 37%, 24%;
            --chart-4: 43, 74%, 66%;
            --chart-5: 27, 87%, 67%;
            --background: 0, 0%, 100%;
            --foreground: 222.2, 84%, 4.9%;
            --border: 214.3, 31.8%, 91.4%;
        }
        
        .dark {
            --chart-1: 220, 70%, 50%;
            --chart-2: 160, 60%, 45%;
            --chart-3: 30, 80%, 55%;
            --chart-4: 280, 65%, 60%;
            --chart-5: 340, 75%, 55%;
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
              <CardTitle>Embedding Charts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Learn how to embed your charts into external websites and applications. 
                Our charts are designed to work seamlessly across different platforms with minimal setup.
              </p>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Create and Export Chart</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Build your chart using our editor, then click &quot;Get Embed Code&quot; to generate the iframe code.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2. Basic Embed Code</h3>
                <div className="bg-slate-50 border rounded p-3 relative group">
                  <code className="text-sm font-mono block">{embedCode}</code>
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
                    <div className="bg-slate-50 border rounded p-3">
                      <code className="text-sm">{`npm install -D tailwindcss postcss autoprefixer
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
                    <div className="bg-slate-50 border rounded p-3">
                      <code className="text-sm">{`<script src="https://cdn.tailwindcss.com"></script>`}</code>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Not recommended for production - may show console warnings
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Theme Variables (Optional)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For custom theming and colors, include these CSS variables in your page:
                </p>
                
                <div className="bg-slate-50 border rounded p-4 overflow-x-auto">
                  <pre className="text-sm">
{`:root {
    --chart-1: 12, 76%, 61%;      /* Orange-red */
    --chart-2: 173, 58%, 39%;     /* Teal */
    --chart-3: 197, 37%, 24%;     /* Dark blue */
    --chart-4: 43, 74%, 66%;      /* Yellow */
    --chart-5: 27, 87%, 67%;      /* Orange */
    
    --background: 0, 0%, 100%;    /* White */
    --foreground: 222.2, 84%, 4.9%; /* Dark text */
    --border: 214.3, 31.8%, 91.4%;  /* Light gray */
}

/* Dark theme (optional) */
.dark {
    --chart-1: 220, 70%, 50%;     /* Blue */
    --chart-2: 160, 60%, 45%;     /* Green-teal */
    --chart-3: 30, 80%, 55%;      /* Orange */
    --chart-4: 280, 65%, 60%;     /* Purple */
    --chart-5: 340, 75%, 55%;     /* Pink-red */
    
    --background: 222.2, 84%, 4.9%; /* Dark */
    --foreground: 210, 40%, 98%;    /* Light text */
    --border: 217.2, 32.6%, 17.5%;  /* Dark gray */
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
                A complete HTML page showing how to properly embed charts with all dependencies:
              </p>
              
              <div className="bg-slate-50 border rounded p-4 overflow-x-auto relative group max-h-96 overflow-y-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => copyToClipboard(htmlTemplate)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <pre className="text-sm">
                  <code>{htmlTemplate}</code>
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
                  <h3 className="font-semibold text-green-700 mb-2">✅ Do</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Include Tailwind CSS for proper styling</li>
                    <li>• Set appropriate width/height for your layout</li>
                    <li>• Use loading=&quot;lazy&quot; for better performance</li>
                    <li>• Test in different screen sizes</li>
                    <li>• Include theme variables for consistency</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">❌ Don&apos;t</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Forget to include Tailwind CSS</li>
                    <li>• Set fixed heights that break responsiveness</li>
                    <li>• Embed without proper container styling</li>
                    <li>• Mix conflicting CSS frameworks</li>
                    <li>• Ignore accessibility considerations</li>
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
                    <li>• Ensure Tailwind CSS is loaded</li>
                    <li>• Check that the iframe URL is accessible</li>
                    <li>• Verify container has proper dimensions</li>
                    <li>• Check browser console for errors</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Colors not matching?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Include the CSS variables shown above</li>
                    <li>• Ensure no conflicting CSS is overriding styles</li>
                    <li>• Check if dark mode class is applied correctly</li>
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
