export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  trend: number; // Percentage change, positive or negative
  previousValue?: string | number;
}

export interface ChartDataPoint {
  date: string;
  value?: number;
  sales?: number;
}

export interface CollectionStat {
  id: string;
  rank: number;
  name: string;
  thumbnail: string;
  volume: number;
  floorPrice: number;
  owners: number;
  items: number;
  change: number; // Percentage change in volume
}

export interface TimeRange {
  id: string;
  label: string;
}

export type TimeRangeType = "24h" | "7d" | "30d" | "all";
