"use client";

import React, { Suspense } from "react";
import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserChartData } from "@/types/dashboard";
import type { ChartConfig } from "@/components/ui/chart";

// Lazy load the heavy chart components
const LazyChart = dynamic(
  () => import("./LazyChart").then((mod) => ({ default: mod.LazyChart })),
  {
    loading: () => (
      <div className="bg-muted h-[300px] w-full animate-pulse rounded" />
    ),
    ssr: false,
  },
);

interface PortfolioChartProps {
  chartData: UserChartData;
  loading?: boolean;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  chartData,
  loading = false,
}) => {
  const chartConfig = {
    portfolio_value: {
      label: "Portfolio Value",
      color: "#f97316", // Orange hardcoded
    },
    certificates_created: {
      label: "Certificates Created",
      color: "#f97316", // Orange hardcoded
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Growth</CardTitle>
          <CardDescription>
            Showing portfolio value over the last {chartData.period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-[300px] w-full animate-pulse rounded" />
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                <div className="bg-muted h-3 w-24 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Transform data for the chart - handle case where data might be undefined
  const transformedData =
    chartData?.data?.map((point) => ({
      date: point.date,
      portfolio_value: point.portfolio_value,
      certificates_created: point.certificates_created,
    })) || [];

  // Check if real data has values > 0
  const hasData = transformedData.some(
    (point) => point.portfolio_value > 0 || point.certificates_created > 0,
  );

  // Generate proper day labels for 30 days
  const generateDayLabels = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      days.push({
        date: `Day ${i}`,
        portfolio_value: 0,
        certificates_created: 0,
      });
    }
    return days;
  };

  // Use real data or fallback with proper day labels
  const chartDataToRender =
    transformedData.length > 0 ? transformedData : generateDayLabels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth</CardTitle>
        <CardDescription>
          Showing portfolio value over the last {chartData.period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-4xl">📊</div>
              <p className="text-muted-foreground text-lg">
                No portfolio data available
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Start creating art sessions to see your growth
              </p>
            </div>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="bg-muted h-[300px] w-full animate-pulse rounded" />
            }
          >
            <LazyChart
              data={chartDataToRender}
              hasData={hasData}
              config={chartConfig}
            />
          </Suspense>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {hasData ? (
                <>
                  Portfolio growing steadily <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>No data yet - Start creating to see your growth</>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Last {chartData.period} - {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
