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
          .embed-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
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
          
          /* Responsive breakpoints */
          @media (max-width: 640px) {
            .embed-container {
              min-height: 250px;
            }
          }
          
          @media (max-height: 400px) {
            .embed-container {
              height: 90vh;
              aspect-ratio: unset !important;
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
