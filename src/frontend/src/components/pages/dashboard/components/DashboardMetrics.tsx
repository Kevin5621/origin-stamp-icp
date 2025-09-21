import React from "react";
import { Award, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserDashboardMetrics } from "@/types/dashboard";

interface DashboardMetricsProps {
  metrics: UserDashboardMetrics;
  loading?: boolean;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  loading = false,
}) => {
  const dashboardCards = [
    {
      title: "My Certificates",
      value: metrics.certificates_created.toString(),
      description: "All verified",
      trend: { value: metrics.certificates_created, isPositive: true },
      icon: Award,
    },
    {
      title: "NFTs Owned",
      value: metrics.nfts_owned.toString(),
      description: "In your collection",
      trend: { value: metrics.nfts_owned, isPositive: true },
      icon: Package,
    },
    {
      title: "Portfolio Value",
      value: `${metrics.portfolio_value_icp.toFixed(2)} ICP`,
      description: `+${metrics.portfolio_growth_percentage.toFixed(1)}% this month`,
      trend: { value: metrics.portfolio_growth_percentage, isPositive: true },
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-border bg-card border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted h-4 w-4 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="bg-muted mb-2 h-8 w-16 animate-pulse rounded" />
              <div className="bg-muted h-3 w-20 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dashboardCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-border bg-card border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-card-foreground text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-card-foreground text-2xl font-bold">
                {card.value}
              </div>
              <p className="text-muted-foreground text-xs">
                {card.trend && (
                  <span
                    className={`inline-flex items-center ${
                      card.trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {card.trend.isPositive ? "+" : ""}
                    {card.trend.value}
                  </span>
                )}{" "}
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
