import React from "react";
import { useICPBalance } from "@/hooks/useICPBalance";
import { Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface BalanceDisplayProps {
  variant?: "compact" | "full" | "minimal";
  showIcon?: boolean;
  className?: string;
}

/**
 * Production-ready component to display real ICP balance
 * Shows actual balance from ICP Ledger, no dummy data
 */
export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  variant = "compact",
  showIcon = true,
  className = "",
}) => {
  const { balance, isLoading, error, ledgerAvailable } = useICPBalance();

  const getDisplayText = () => {
    if (error) return "Error";
    if (isLoading) return "Loading...";
    if (balance) return balance.formatted;
    return "0.0000 ICP";
  };

  const getStatusText = () => {
    if (error) return error;
    if (isLoading) return "Fetching from ICP Ledger...";
    if (!ledgerAvailable) return "Ledger unavailable";
    if (balance) return `Balance: ${balance.decimal.toFixed(4)} ICP`;
    return "No balance";
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (isLoading)
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (ledgerAvailable && balance)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Wallet className="text-muted-foreground h-4 w-4" />;
  };

  if (variant === "minimal") {
    return (
      <span
        className={`font-mono text-sm ${error ? "text-red-500" : ""} ${className}`}
      >
        {getDisplayText()}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && getStatusIcon()}
        <div className="text-right">
          <p
            className={`font-mono text-sm font-medium ${error ? "text-red-500" : ""}`}
          >
            {getDisplayText()}
          </p>
          <p className="text-muted-foreground text-xs">{getStatusText()}</p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={`${
        error
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
          : "bg-primary/5 border-primary/20"
      } rounded-lg border p-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showIcon && getStatusIcon()}
          <span
            className={`text-sm font-medium ${
              error ? "text-red-700 dark:text-red-300" : "text-muted-foreground"
            }`}
          >
            ICP Balance
          </span>
        </div>
        <div className="text-right">
          <p
            className={`font-mono text-lg font-bold ${
              error ? "text-red-600 dark:text-red-400" : ""
            }`}
          >
            {getDisplayText()}
          </p>
          <p
            className={`text-xs ${
              error ? "text-red-500 dark:text-red-400" : "text-muted-foreground"
            }`}
          >
            {getStatusText()}
          </p>
        </div>
      </div>

      {!ledgerAvailable && !isLoading && (
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          Running in development mode - ICP Ledger not available
        </div>
      )}
    </div>
  );
};
