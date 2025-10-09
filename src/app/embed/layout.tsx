import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Chart Embed",
  description: "Embedded chart viewer",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
          /* Enhanced responsive embed styles */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            box-sizing: border-box;
          }
          
          *, *::before, *::after {
            box-sizing: border-box;
          }
          
          .embed-container {
            width: 100%;
            height: 100vh;
            overflow: hidden;
            position: relative;
          }
          
          /* Force responsive charts on mobile */
          @media (max-width: 768px) {
            .embed-container {
              width: 100vw !important;
              height: 100vh !important;
              max-width: none !important;
            }
            
            /* Force recharts to be responsive */
            .recharts-responsive-container {
              width: 100% !important;
              height: 100% !important;
            }
            
            .recharts-wrapper {
              width: 100% !important;
              height: 100% !important;
            }
          }
          
          /* Ensure aspect ratio works on older browsers */
          @supports not (aspect-ratio: 1) {
            .embed-container::before {
              content: '';
              width: 1px;
              margin-left: -1px;
              float: left;
              height: 0;
              padding-top: calc(var(--chart-height, 400px) / var(--chart-width, 600px) * 100%);
            }
            .embed-container::after {
              content: '';
              display: table;
              clear: both;
            }
          }
        `}</style>
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <div className="embed-container">
          {children}
        </div>
      </body>
    </html>
  );
}
