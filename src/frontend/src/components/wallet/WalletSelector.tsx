/**
 * WalletSelector Component
 * Production-ready: Only Internet Identity for security and reliability
 */

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, WifiOff, Wifi } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WalletType, WalletInfo } from "@/services/wallet/types";
import { OriginStampWalletManager } from "@/services/wallet/manager";

interface WalletSelectorProps {
  onWalletSelect: (walletType: WalletType) => void;
  onWalletConnected: (walletInfo: WalletInfo) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  selectedWallet?: WalletType | null;
  disabled?: boolean;
  showStatus?: boolean;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  onWalletSelect,
  onWalletConnected,
  onError,
  isLoading = false,
  selectedWallet = null,
  disabled = false,
  showStatus = true,
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(true);

  const walletManager = new OriginStampWalletManager();

  useEffect(() => {
    const checkWalletStatus = async () => {
      setCheckingAvailability(true);

      try {
        // Check if Internet Identity is available
        const available = await walletManager.isWalletAvailable(
          WalletType.INTERNET_IDENTITY,
        );
        setIsAvailable(available);

        // Check if already connected
        const currentWallet = walletManager.getCurrentWalletInfo();
        setIsConnected(currentWallet?.isConnected ?? false);
      } catch (error) {
        onError("Failed to check wallet availability");
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkWalletStatus();
  }, [onError]);

  const handleWalletClick = async () => {
    if (disabled || isLoading || !isAvailable) {
      return;
    }

    try {
      onWalletSelect(WalletType.INTERNET_IDENTITY);

      if (isConnected) {
        const walletInfo = walletManager.getCurrentWalletInfo();
        if (walletInfo) {
          onWalletConnected(walletInfo);
        }
      }
    } catch (error) {
      onError("Failed to select Internet Identity");
    }
  };

  const getStatusIcon = () => {
    if (!isAvailable) {
      return <WifiOff className="text-muted-foreground h-4 w-4" />;
    }

    if (isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    return <Wifi className="text-muted-foreground h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!isAvailable) {
      return "Not available";
    }

    if (isConnected) {
      return "Connected";
    }

    return "Available";
  };

  const getButtonVariant = () => {
    if (!isAvailable) {
      return "outline";
    }

    if (isConnected || selectedWallet === WalletType.INTERNET_IDENTITY) {
      return "primary";
    }

    return "outline";
  };

  if (checkingAvailability) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="md" variant="infinite" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleWalletClick}
        disabled={disabled || isLoading || !isAvailable}
        variant={getButtonVariant()}
        className="h-16 w-full justify-between p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <img
              src="/ii-logo.svg"
              alt="Internet Identity"
              className="h-6 w-6"
            />
          </div>
          <div className="text-left">
            <p className="font-medium">Internet Identity</p>
            <p className="text-muted-foreground text-xs">
              DFINITY&apos;s secure identity solution
            </p>
          </div>
        </div>

        {showStatus && (
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-xs">
              {getStatusText()}
            </span>
            {getStatusIcon()}
          </div>
        )}
      </Button>

      {!isAvailable && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-700">
            Internet Identity is not available. Please check your browser
            settings.
          </p>
        </div>
      )}
    </div>
  );
};
