"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  Tooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { UserChartData } from "@/types/dashboard";

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
              <div className="flex items-center gap-2 leading-none font-medium">
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
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart
              accessibilityLayer
              data={chartDataToRender}
              margin={{
                left: 12,
                right: 12,
              }}
              height={300}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const dayNumber = value.replace("Day ", "");
                  return dayNumber;
                }}
                interval={4} // Show every 5th day to avoid crowding
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={hasData ? [0, "dataMax + 1"] : [-1, 1]}
                ticks={hasData ? undefined : [-1, 0, 1]}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#f97316"
                    stopOpacity={hasData ? 0.8 : 0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="#f97316"
                    stopOpacity={hasData ? 0.1 : 0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillCertificates"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#f97316"
                    stopOpacity={hasData ? 0.6 : 0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#f97316"
                    stopOpacity={hasData ? 0.05 : 0.05}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="certificates_created"
                type="natural"
                fill="url(#fillCertificates)"
                fillOpacity={hasData ? 0.3 : 0.15}
                stroke="#f97316"
                strokeWidth={hasData ? 2 : 2}
                stackId="a"
              />
              <Area
                dataKey="portfolio_value"
                type="natural"
                fill="url(#fillPortfolio)"
                fillOpacity={hasData ? 0.4 : 0.2}
                stroke="#f97316"
                strokeWidth={hasData ? 2 : 2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
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
