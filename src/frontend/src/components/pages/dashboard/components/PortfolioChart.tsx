"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
      color: "hsl(var(--primary))",
    },
    certificates_created: {
      label: "Certificates Created",
      color: "hsl(var(--secondary))",
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

  // Transform data for the chart
  const transformedData = chartData.data.map((point) => ({
    date: point.date,
    portfolio_value: point.portfolio_value,
    certificates_created: point.certificates_created,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth</CardTitle>
        <CardDescription>
          Showing portfolio value over the last {chartData.period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-portfolio_value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-portfolio_value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCertificates" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-certificates_created)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-certificates_created)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="certificates_created"
              type="natural"
              fill="url(#fillCertificates)"
              fillOpacity={0.4}
              stroke="var(--color-certificates_created)"
              stackId="a"
            />
            <Area
              dataKey="portfolio_value"
              type="natural"
              fill="url(#fillPortfolio)"
              fillOpacity={0.4}
              stroke="var(--color-portfolio_value)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Portfolio growing steadily <TrendingUp className="h-4 w-4" />
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
