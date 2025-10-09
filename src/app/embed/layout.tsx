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
        <style>{`
          /* Enhanced responsive embed styles */
          * {
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
          }
          
          .embed-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
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
          
          /* Mobile-first responsive breakpoints */
          @media (max-width: 768px) {
            .embed-container {
              min-height: 250px;
              max-height: 90vh;
            }
          }
          
          @media (max-width: 480px) {
            .embed-container {
              min-height: 200px;
              max-height: 85vh;
            }
          }
          
          @media (max-height: 500px) {
            .embed-container {
              height: 90vh !important;
              max-height: 90vh !important;
              aspect-ratio: unset !important;
            }
          }
          
          /* Prevent horizontal scrolling on small screens */
          @media (max-width: 360px) {
            .embed-container {
              min-height: 180px;
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
