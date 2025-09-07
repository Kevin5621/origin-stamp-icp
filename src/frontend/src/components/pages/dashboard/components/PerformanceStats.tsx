import React from "react";
import { Palette, Award, TrendingUp, Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserPerformanceStats } from "@/types/dashboard";

interface PerformanceStatsProps {
  performanceStats: UserPerformanceStats;
  loading?: boolean;
}

export const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  performanceStats,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="border-border bg-card border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Performance Overview
          </CardTitle>
          <CardDescription>
            Your art creation performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-8 w-16 animate-pulse rounded" />
                <div className="bg-muted h-3 w-20 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    } else if (score >= 80) {
      return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
      );
    }
  };

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 80) {
      return <Badge className="bg-green-100 text-green-800">High</Badge>;
    } else if (rate >= 60) {
      return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>;
    }
  };

  return (
    <Card className="border-border bg-card border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Performance Overview
        </CardTitle>
        <CardDescription>Your art creation performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="text-muted-foreground h-4 w-4" />
              <h4 className="text-card-foreground text-sm font-medium">
                Average Verification Score
              </h4>
            </div>
            <p className="text-card-foreground text-2xl font-bold">
              {performanceStats.avg_verification_score.toFixed(1)}
            </p>
            <div className="flex items-center gap-2">
              {getScoreBadge(performanceStats.avg_verification_score)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="text-muted-foreground h-4 w-4" />
              <h4 className="text-card-foreground text-sm font-medium">
                Total Uploads
              </h4>
            </div>
            <p className="text-card-foreground text-2xl font-bold">
              {performanceStats.total_uploads}
            </p>
            <p className="text-muted-foreground text-xs">
              Photos uploaded across all sessions
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="text-muted-foreground h-4 w-4" />
              <h4 className="text-card-foreground text-sm font-medium">
                Success Rate
              </h4>
            </div>
            <p className="text-card-foreground text-2xl font-bold">
              {performanceStats.success_rate.toFixed(1)}%
            </p>
            <div className="flex items-center gap-2">
              {getSuccessRateBadge(performanceStats.success_rate)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-muted-foreground h-4 w-4" />
              <h4 className="text-card-foreground text-sm font-medium">
                Top Artwork
              </h4>
            </div>
            <p className="text-card-foreground truncate text-sm font-medium">
              {performanceStats.top_artwork}
            </p>
            <p className="text-muted-foreground text-xs">
              Highest verification score
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
