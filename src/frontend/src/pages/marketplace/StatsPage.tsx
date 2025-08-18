import React, { useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { StatsView } from "../../components/marketplace/stats";

export const StatsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <AppLayout variant="marketplace">
      <StatsView
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
    </AppLayout>
  );
};

export default StatsPage;
