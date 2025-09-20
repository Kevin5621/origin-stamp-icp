/**
 * Hook for fetching real ICP balance from ICP Ledger
 * Production-ready implementation with proper error handling
 * No dummy data, no random values
 */

import { useState, useEffect, useCallback } from "react";
import { Principal } from "@dfinity/principal";
import { icpLedgerService, ICPBalance } from "../services/icp/ledger";
import { useAuth } from "@/contexts/AuthContext";

interface BalanceInfo {
  balance: ICPBalance | null;
  formattedBalance: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  ledgerAvailable: boolean;
}

/**
 * Hook to fetch and manage ICP balance for the connected wallet
 */
export const useICPBalance = (): BalanceInfo => {
  const { currentWallet } = useAuth();
  const [balance, setBalance] = useState<ICPBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ledgerAvailable, setLedgerAvailable] = useState(false);

  /**
   * Fetch balance for the authenticated user's principal
   */
  const fetchBalance = useCallback(async (): Promise<void> => {
    // Only fetch if wallet is connected and has principal
    if (!currentWallet?.isConnected || !currentWallet.principal) {
      setBalance(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if ledger is available first
      const isAvailable = await icpLedgerService.isLedgerAvailable();
      setLedgerAvailable(isAvailable);

      if (!isAvailable) {
        setError("ICP Ledger is not available in this environment");
        setBalance(null);
        return;
      }

      // Parse principal from wallet info
      const principal = Principal.fromText(currentWallet.principal);

      // Fetch real balance from ICP Ledger
      const balanceResult = await icpLedgerService.getBalance(principal);
      setBalance(balanceResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch ICP balance";
      setError(errorMessage);
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentWallet?.isConnected, currentWallet?.principal]);

  /**
   * Check ledger availability on mount
   */
  useEffect(() => {
    const checkLedgerAvailability = async () => {
      try {
        const isAvailable = await icpLedgerService.isLedgerAvailable();
        setLedgerAvailable(isAvailable);
      } catch {
        setLedgerAvailable(false);
      }
    };

    checkLedgerAvailability();
  }, []);

  /**
   * Fetch balance when wallet connection changes
   */
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  /**
   * Auto-refresh balance every 30 seconds if wallet is connected
   */
  useEffect(() => {
    if (!currentWallet?.isConnected) {
      return;
    }

    const interval = setInterval(() => {
      fetchBalance();
    }, 30_000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [currentWallet?.isConnected, fetchBalance]);

  return {
    balance,
    formattedBalance: balance?.formatted || "--",
    isLoading,
    error,
    refetch: fetchBalance,
    ledgerAvailable,
  };
};
