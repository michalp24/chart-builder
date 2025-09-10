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
      <body className="bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
