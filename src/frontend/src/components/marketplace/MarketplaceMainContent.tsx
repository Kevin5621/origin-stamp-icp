import React, { ReactNode } from "react";

interface MarketplaceMainContentProps {
  children: ReactNode;
}

export const MarketplaceMainContent: React.FC<MarketplaceMainContentProps> = ({
  children,
}) => {
  return (
    <main className="marketplace-main-content">
      <div className="marketplace-main-content__container">{children}</div>
    </main>
  );
};
