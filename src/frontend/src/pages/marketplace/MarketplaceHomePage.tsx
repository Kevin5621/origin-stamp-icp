import React from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { HomeMarketplace } from "../../components/marketplace";

export const MarketplaceHomePage: React.FC = () => {
  return (
    <AppLayout variant="marketplace">
      <HomeMarketplace />
    </AppLayout>
  );
};

export default MarketplaceHomePage;
