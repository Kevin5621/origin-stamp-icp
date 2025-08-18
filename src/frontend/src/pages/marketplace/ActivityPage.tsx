import React from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Activity } from "../../components/marketplace";

export const ActivityPage: React.FC = () => {
  return (
    <AppLayout variant="marketplace">
      <Activity />
    </AppLayout>
  );
};

export default ActivityPage;
