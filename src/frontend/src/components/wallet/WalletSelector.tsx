/**
 * WalletSelector Component
 * Reusable component for selecting and connecting different wallet types
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WalletType, WalletInfo } from "@/services/wallet/types";
import { OriginStampWalletManager } from "@/services/wallet/manager";
import { CheckCircle, ExternalLink, Wifi, WifiOff } from "lucide-react";

interface WalletSelectorProps {
  onWalletSelect: (walletType: WalletType) => void;
  onWalletConnected: (walletInfo: WalletInfo) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  selectedWallet?: WalletType | null;
  disabled?: boolean;
  showStatus?: boolean;
}

interface WalletOption {
  type: WalletType;
  name: string;
  description: string;
  icon: string;
  isExtensionBased: boolean;
  downloadUrl: string;
  isAvailable: boolean;
  isConnected: boolean;
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
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(true);

  useEffect(() => {
    const initializeWallets = async () => {
      setCheckingAvailability(true);
      
      try {
        const walletManager = new OriginStampWalletManager();
        const availableWallets = await walletManager.getAvailableWallets();
        
        const walletOptions: WalletOption[] = [
          {
            type: WalletType.INTERNET_IDENTITY,
            name: "Internet Identity",
            description: "The official IC identity provider - secure and anonymous",
            icon: "/ii-logo.svg",
            isExtensionBased: false,
            downloadUrl: "https://identity.ic0.app",
            isAvailable: availableWallets.some(w => w.info.type === WalletType.INTERNET_IDENTITY),
            isConnected: false,
          },
          {
            type: WalletType.PLUG,
            name: "Plug Wallet",
            description: "Browser extension wallet for Internet Computer",
            icon: "/plug-logo.svg",
            isExtensionBased: true,
            downloadUrl: "https://plugwallet.ooo",
            isAvailable: availableWallets.some(w => w.info.type === WalletType.PLUG),
            isConnected: false,
          },
          {
            type: WalletType.STOIC,
            name: "Stoic Wallet",
            description: "Web-based wallet - no installation required",
            icon: "/stoic-logo.svg",
            isExtensionBased: false,
            downloadUrl: "https://www.stoicwallet.com",
            isAvailable: availableWallets.some(w => w.info.type === WalletType.STOIC),
            isConnected: false,
          },
          {
            type: WalletType.NFID,
            name: "NFID",
            description: "Modern identity with email and social login support",
            icon: "/nfid-logo.svg",
            isExtensionBased: false,
            downloadUrl: "https://nfid.one",
            isAvailable: availableWallets.some(w => w.info.type === WalletType.NFID),
            isConnected: false,
          },
        ];

        // Check connection status for available wallets
        for (const option of walletOptions) {
          if (option.isAvailable) {
            try {
              const connector = walletManager.getWallet(option.type);
              if (connector) {
                option.isConnected = connector.isConnected();
              }
            } catch (error) {
              console.warn(`Failed to check connection status for ${option.name}:`, error);
            }
          }
        }

        setWalletOptions(walletOptions);
      } catch (error) {
        console.error("Failed to check wallet availability:", error);
        onError("Failed to check wallet availability");
      } finally {
        setCheckingAvailability(false);
      }
    };

    initializeWallets();
  }, [onError]);

  const handleWalletClick = async (wallet: WalletOption) => {
    if (disabled || isLoading || !wallet.isAvailable) {
      return;
    }

    try {
      onWalletSelect(wallet.type);
      
      if (wallet.isConnected) {
        // Wallet is already connected, just notify
        onWalletConnected({
          type: wallet.type,
          name: wallet.name,
          isConnected: true,
          description: wallet.description,
          icon: wallet.icon,
          isExtensionBased: wallet.isExtensionBased,
          supportsSignTransaction: true,
          downloadUrl: wallet.downloadUrl,
        });
      }
    } catch (error) {
      console.error(`Error selecting ${wallet.name}:`, error);
      onError(`Failed to select ${wallet.name}`);
    }
  };

  const getWalletStatusIcon = (wallet: WalletOption) => {
    if (!wallet.isAvailable) {
      return <WifiOff className="h-4 w-4 text-muted-foreground" />;
    }
    
    if (wallet.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return <Wifi className="h-4 w-4 text-muted-foreground" />;
  };

  const getWalletStatusText = (wallet: WalletOption) => {
    if (!wallet.isAvailable) {
      return wallet.isExtensionBased ? "Extension not installed" : "Not available";
    }
    
    if (wallet.isConnected) {
      return "Connected";
    }
    
    return "Available";
  };

  const getButtonVariant = (wallet: WalletOption) => {
    if (!wallet.isAvailable) {
      return "outline";
    }
    
    if (wallet.isConnected) {
      return "primary";
    }
    
    if (selectedWallet === wallet.type) {
      return "primary";
    }
    
    return "outline";
  };

  if (checkingAvailability) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" variant="infinite" />
        <span className="ml-2 text-muted-foreground">Checking wallet availability...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {walletOptions.map((wallet) => (
        <Button
          key={wallet.type}
          onClick={() => handleWalletClick(wallet)}
          disabled={disabled || isLoading || !wallet.isAvailable}
          variant={getButtonVariant(wallet)}
          className="h-auto w-full justify-start p-4 text-left transition-all duration-200"
        >
          <div className="flex w-full items-center space-x-3">
            {/* Wallet Icon */}
            <div className="relative">
              <Image
                src={wallet.icon}
                alt={wallet.name}
                width={24}
                height={24}
                className="h-6 w-6"
                onError={(e) => {
                  // Fallback to generic wallet icon if wallet icon fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/wallet-generic.svg";
                }}
              />
              {isLoading && selectedWallet === wallet.type && (
                <LoadingSpinner
                  size="sm"
                  variant="infinite"
                  className="absolute -top-1 -right-1"
                />
              )}
            </div>

            {/* Wallet Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{wallet.name}</h3>
                {showStatus && (
                  <div className="flex items-center space-x-1 text-xs">
                    {getWalletStatusIcon(wallet)}
                    <span className="text-muted-foreground">
                      {getWalletStatusText(wallet)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {wallet.description}
              </p>
            </div>

            {/* Download Link for unavailable extension wallets */}
            {!wallet.isAvailable && wallet.isExtensionBased && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(wallet.downloadUrl, "_blank");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(wallet.downloadUrl, "_blank");
                  }
                }}
                className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
                aria-label={`Install ${wallet.name}`}
              >
                <span>Install</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        </Button>
      ))}
      
      {walletOptions.filter(w => w.isAvailable).length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No wallets are currently available. Please install a wallet extension or check your internet connection.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-sm"
          >
            Refresh Page
          </Button>
        </div>
      )}
    </div>
  );
};