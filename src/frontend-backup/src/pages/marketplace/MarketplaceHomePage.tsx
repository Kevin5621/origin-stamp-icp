import React from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { MarketplaceMain } from "../../components/marketplace/MarketplaceMain";

export const MarketplaceHomePage: React.FC = () => {
  return (
    <AppLayout variant="marketplace">
      <MarketplaceMain />
    </AppLayout>
  );
};

export default MarketplaceHomePage;
