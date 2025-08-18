import React from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Rankings } from "../../components/marketplace/rankings/Rankings";

export const RankingsPage: React.FC = () => {
  return (
    <AppLayout variant="marketplace">
      <Rankings />
    </AppLayout>
  );
};

export default RankingsPage;
