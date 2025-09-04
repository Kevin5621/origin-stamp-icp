import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{
          backgroundImage: "url('/bg-image-404.webp')",
        }}
      />

      <div className="relative z-10 mx-4 w-full max-w-md">
        <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="space-y-2">
              <h1 className="text-primary text-8xl font-bold">404</h1>
              <h2 className="text-foreground text-2xl font-semibold">
                Page Not Found
              </h2>
              <p className="text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="default">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
