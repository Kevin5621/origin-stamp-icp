"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  Tooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LazyChartProps {
  data: any[];
  hasData: boolean;
  config: ChartConfig;
}

export const LazyChart: React.FC<LazyChartProps> = ({
  data,
  hasData,
  config,
}) => {
  return (
    <ChartContainer config={config} className="h-[300px]">
      <AreaChart
        accessibilityLayer
        data={data}
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
          <linearGradient id="fillCertificates" x1="0" y1="0" x2="0" y2="1">
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
  );
};

export default LazyChart;
