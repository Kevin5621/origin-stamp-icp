import React from "react";
import { useICPBalance } from "@/hooks/useICPBalance";
import { Wallet } from "lucide-react";

interface BalanceDisplayProps {
  variant?: "compact" | "full" | "minimal";
  showIcon?: boolean;
  className?: string;
}

/**
 * Reusable component to display ICP balance
 */
export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  variant = "compact",
  showIcon = true,
  className = "",
}) => {
  const { formattedBalance, isLoading, error } = useICPBalance();

  const getDisplayText = () => {
    if (error) return "Error";
    if (isLoading) return "...";
    return `${formattedBalance} ICP`;
  };

  const getStatusText = () => {
    if (error) return "Failed to load";
    if (isLoading) return "Loading...";
    return "Available";
  };

  if (variant === "minimal") {
    return (
      <span className={`font-mono text-sm ${className}`}>
        {getDisplayText()}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Wallet className="text-muted-foreground h-4 w-4" />}
        <div className="text-right">
          <p className="font-mono text-sm font-medium">{getDisplayText()}</p>
          <p className="text-muted-foreground text-xs">{getStatusText()}</p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={`bg-primary/5 border-primary/20 rounded-lg border p-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showIcon && <Wallet className="text-primary h-4 w-4" />}
          <span className="text-muted-foreground text-sm font-medium">
            ICP Balance
          </span>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold">{getDisplayText()}</p>
          <p className="text-muted-foreground text-xs">{getStatusText()}</p>
        </div>
      </div>
    </div>
  );
};
