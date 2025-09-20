import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BalanceInfo {
  balance: bigint | null;
  formattedBalance: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage ICP balance for the connected wallet
 */
export const useICPBalance = (): BalanceInfo => {
  const { currentWallet } = useAuth();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format balance from e8s (smallest ICP unit) to ICP
  const formatBalance = (balanceE8s: bigint | null): string => {
    if (balanceE8s === null) return '--';
    
    // Convert from e8s to ICP (1 ICP = 100,000,000 e8s)
    const icp = Number(balanceE8s) / 100_000_000;
    
    // Format with appropriate decimal places
    if (icp >= 1) {
      return icp.toFixed(2);
    } else if (icp >= 0.01) {
      return icp.toFixed(4);
    } else {
      return icp.toFixed(8);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!currentWallet?.isConnected || !currentWallet.principal) {
        setBalance(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Implement real ICP Ledger call
        // For now, simulate balance fetch
        console.log('Fetching balance for principal:', currentWallet.principal);
        
        // Simulated balance for development
        setTimeout(() => {
          const mockBalance = BigInt(Math.floor(Math.random() * 1000000000)); // Random balance in e8s
          setBalance(mockBalance);
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Failed to fetch ICP balance:', err);
        setError('Failed to fetch balance');
        setIsLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh balance every 30 seconds when wallet is connected
    const interval = currentWallet?.isConnected 
      ? setInterval(fetchBalance, 30000)
      : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentWallet?.isConnected, currentWallet?.principal]);

  return {
    balance,
    formattedBalance: formatBalance(balance),
    isLoading,
    error
  };
};