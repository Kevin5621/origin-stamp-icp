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

      <div className="relative z-10 mx-4 w-full max-w-lg">
        <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="space-y-4">
              <div className="text-primary font-mono text-xs leading-tight">
                <pre>{`
   ██╗  ██╗ ██████╗ ██╗  ██╗
   ██║  ██║██╔═══██╗██║  ██║
   ███████║██║   ██║███████║
   ╚════██║██║   ██║╚════██║
        ██║╚██████╔╝     ██║
        ╚═╝ ╚═════╝      ╚═╝
                
          ███╗   ██╗ ██████╗ ████████╗     
          ████╗  ██║██╔═══██╗╚══██╔══╝     
          ██╔██╗ ██║██║   ██║   ██║        
          ██║╚██╗██║██║   ██║   ██║        
          ██║ ╚████║╚██████╔╝   ██║        
          ╚═╝  ╚═══╝ ╚═════╝    ╚═╝        
                                     
    ███████╗ ██████╗ ██╗   ██╗███╗   ██╗███████╗
    ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██║
    █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║
    ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║
    ██║     ╚██████╔╝╚██████╔╝██║ ╚████║███████║
    ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                `}</pre>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground">
                  The session you&apos;re looking for doesn&apos;t exist or has
                  been moved.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="primary">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/sessions">Sessions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
