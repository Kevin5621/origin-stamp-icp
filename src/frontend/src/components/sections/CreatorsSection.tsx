"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { backendService, type CreatorStats } from "@/services/backendService";

export function CreatorsSection() {
  const [creators, setCreators] = useState<CreatorStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendService
      .getTopCreators()
      .then(setCreators)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-light md:text-5xl">
              Creators of the week
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "creator1",
              "creator2",
              "creator3",
              "creator4",
              "creator5",
              "creator6",
              "creator7",
              "creator8",
            ].map((id) => (
              <Card key={id} className="bg-card animate-pulse border">
                <CardContent className="p-6">
                  <div className="bg-muted h-32 rounded border"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-light md:text-5xl">
            Creators of the week
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {creators.map((creator, index) => (
            <Card
              key={creator.username}
              className="bg-card border transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-foreground text-lg font-light">
                    {index + 1}
                  </div>
                  {creator.hasSubscription && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      ✓
                    </Badge>
                  )}
                </div>

                <div className="mb-4 flex items-center space-x-3">
                  <Avatar className="ring-border h-12 w-12 ring-1">
                    <AvatarImage
                      src={`/api/placeholder/48/48`}
                      alt={creator.username}
                    />
                    <AvatarFallback className="bg-muted text-foreground">
                      {creator.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground font-medium">
                      {creator.username}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                      {creator.subscriptionType || "Free"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificates:</span>
                    <span className="text-foreground font-medium">
                      {creator.certificateCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sessions:</span>
                    <span className="text-foreground font-medium">
                      {creator.sessionCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="px-8">
            View All Creators
          </Button>
        </div>
      </div>
    </section>
  );
}
