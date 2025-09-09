import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Chart Builder</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create beautiful, interactive charts with ease
        </p>
        <Link href="/builder">
          <Button size="lg">
            Start Building Charts
          </Button>
        </Link>
      </div>
    </div>
  );
}