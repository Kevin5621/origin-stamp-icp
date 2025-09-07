"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// Re-export all recharts components
export const Area = RechartsPrimitive.Area;
export const AreaChart = RechartsPrimitive.AreaChart;
export const Bar = RechartsPrimitive.Bar;
export const BarChart = RechartsPrimitive.BarChart;
export const CartesianGrid = RechartsPrimitive.CartesianGrid;
export const Cell = RechartsPrimitive.Cell;
export const ComposedChart = RechartsPrimitive.ComposedChart;
export const Legend = RechartsPrimitive.Legend;
export const Line = RechartsPrimitive.Line;
export const LineChart = RechartsPrimitive.LineChart;
export const Pie = RechartsPrimitive.Pie;
export const PieChart = RechartsPrimitive.PieChart;
export const ResponsiveContainer = RechartsPrimitive.ResponsiveContainer;
export const Tooltip = RechartsPrimitive.Tooltip;
export const XAxis = RechartsPrimitive.XAxis;
export const YAxis = RechartsPrimitive.YAxis;

// Chart container component
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactNode;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ className, config, children, ...props }, ref) => {
  const cssVariables = Object.entries(config).reduce(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={cssVariables as React.CSSProperties}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

// Chart config type
export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

// Chart tooltip content
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: unknown[];
  label?: string;
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(({ active, payload, label }, ref) => {
  if (active && payload && payload.length) {
    return (
      <div ref={ref} className="bg-background rounded-lg border p-2 shadow-md">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.70rem] uppercase">
              {label}
            </span>
            {payload.map((entry, index) => {
              const typedEntry = entry as {
                color: string;
                name: string;
                value: string | number;
              };
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: typedEntry.color }}
                  />
                  <span className="text-[0.70rem] font-medium">
                    {typedEntry.name}: {typedEntry.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return null;
});
ChartTooltipContent.displayName = "ChartTooltipContent";
