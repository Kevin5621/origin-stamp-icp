import React from 'react';
import { useICPBalance } from '@/hooks/useICPBalance';
import { Wallet } from 'lucide-react';

interface BalanceDisplayProps {
  variant?: 'compact' | 'full' | 'minimal';
  showIcon?: boolean;
  className?: string;
}

/**
 * Reusable component to display ICP balance
 */
export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  variant = 'compact',
  showIcon = true,
  className = ''
}) => {
  const { formattedBalance, isLoading, error } = useICPBalance();

  const getDisplayText = () => {
    if (error) return 'Error';
    if (isLoading) return '...';
    return `${formattedBalance} ICP`;
  };

  const getStatusText = () => {
    if (error) return 'Failed to load';
    if (isLoading) return 'Loading...';
    return 'Available';
  };

  if (variant === 'minimal') {
    return (
      <span className={`font-mono text-sm ${className}`}>
        {getDisplayText()}
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Wallet className="h-4 w-4 text-muted-foreground" />}
        <div className="text-right">
          <p className="text-sm font-mono font-medium">{getDisplayText()}</p>
          <p className="text-xs text-muted-foreground">{getStatusText()}</p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-lg bg-primary/5 border border-primary/20 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showIcon && <Wallet className="h-4 w-4 text-primary" />}
          <span className="text-sm font-medium text-muted-foreground">ICP Balance</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono font-bold">{getDisplayText()}</p>
          <p className="text-xs text-muted-foreground">{getStatusText()}</p>
        </div>
      </div>
    </div>
  );
};