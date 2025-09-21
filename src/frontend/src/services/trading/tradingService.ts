/**
 * Trading Service
 * Handles NFT purchase, sale, and wallet integration
 */

import { Principal } from "@dfinity/principal";
import { backendService } from "../backendService";
import { icpLedgerService, type ICPBalance } from "../icp/ledger";
import { CollectionService } from "../nft/collection";
import type { Account } from "../../../../declarations/backend/backend.did";

export interface PurchaseRequest {
  nftId: string;
  price: string;
  currency: "ICP" | "USDT";
  buyerPrincipal: string;
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  message: string;
  nftId: string;
  price: string;
  currency: string;
}

export interface WalletBalance {
  icp: ICPBalance;
  isConnected: boolean;
  principal: string | null;
}

export class TradingService {
  /**
   * Get current wallet balance and connection status
   */
  static async getWalletBalance(
    userPrincipal?: string,
  ): Promise<WalletBalance> {
    try {
      if (!userPrincipal) {
        return {
          icp: {
            e8s: BigInt(0),
            formatted: "0.0000 ICP",
            decimal: 0,
          },
          isConnected: false,
          principal: null,
        };
      }

      // Check if ledger is available first
      const isLedgerAvailable = await icpLedgerService.isLedgerAvailable();

      let icpBalance: ICPBalance;

      if (!isLedgerAvailable) {
        // For local development, use mock balance (same as useICPBalance hook)
        console.log(
          "[TradingService] Ledger not available, using mock balance",
        );
        icpBalance = {
          e8s: BigInt(100000000), // 1 ICP in e8s (consistent with useICPBalance)
          formatted: "1.00 ICP",
          decimal: 8,
        };
      } else {
        // Get real ICP balance from ledger
        icpBalance = await icpLedgerService.getBalance(
          Principal.fromText(userPrincipal),
        );
      }

      return {
        icp: icpBalance,
        isConnected: true,
        principal: userPrincipal,
      };
    } catch (error) {
      console.error("[TradingService] Failed to get wallet balance:", error);

      // For local development, use mock balance on error (same as useICPBalance hook)
      return {
        icp: {
          e8s: BigInt(100000000), // 1 ICP in e8s
          formatted: "1.00 ICP",
          decimal: 1.0,
        },
        isConnected: true,
        principal: userPrincipal || null,
      };
    }
  }

  /**
   * Check if user has sufficient balance for purchase
   */
  static async checkSufficientBalance(
    price: string,
    currency: "ICP" | "USDT",
    userPrincipal?: string,
  ): Promise<{
    sufficient: boolean;
    currentBalance: string;
    requiredAmount: string;
  }> {
    try {
      const walletBalance = await this.getWalletBalance(userPrincipal);

      if (!walletBalance.isConnected) {
        return {
          sufficient: false,
          currentBalance: "0.0000 ICP",
          requiredAmount: price,
        };
      }

      const requiredAmount = parseFloat(price);
      // Convert e8s to ICP for comparison
      const currentBalanceICP = Number(walletBalance.icp.e8s) / 100000000;

      return {
        sufficient: currentBalanceICP >= requiredAmount,
        currentBalance: walletBalance.icp.formatted,
        requiredAmount: `${price} ${currency}`,
      };
    } catch (error) {
      console.error("[TradingService] Failed to check balance:", error);
      return {
        sufficient: false,
        currentBalance: "0.0000 ICP",
        requiredAmount: price,
      };
    }
  }

  /**
   * Purchase NFT with ICP
   */
  static async purchaseNFT(request: PurchaseRequest): Promise<PurchaseResult> {
    try {
      console.log("💳 [TradingService] Starting purchase process...");
      console.log("💳 [TradingService] Purchase request:", request);
      
      // Check if user is connected
      const walletBalance = await this.getWalletBalance(request.buyerPrincipal);
      console.log("💳 [TradingService] Wallet balance:", walletBalance);
      
      if (!walletBalance.isConnected) {
        console.log("❌ [TradingService] Wallet not connected");
        return {
          success: false,
          message: "Wallet not connected. Please connect your wallet first.",
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }

      // Check sufficient balance
      console.log("💳 [TradingService] Checking sufficient balance...");
      const balanceCheck = await this.checkSufficientBalance(
        request.price,
        request.currency,
        request.buyerPrincipal,
      );
      console.log("💳 [TradingService] Balance check result:", balanceCheck);

      if (!balanceCheck.sufficient) {
        console.log("❌ [TradingService] Insufficient balance");
        return {
          success: false,
          message: `Insufficient balance. Required: ${balanceCheck.requiredAmount}, Available: ${balanceCheck.currentBalance}`,
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }

      // Get backend actor
      console.log("💳 [TradingService] Getting backend actor...");
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        console.log("❌ [TradingService] Backend actor not available");
        return {
          success: false,
          message: "Backend service not available",
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }
      console.log("✅ [TradingService] Backend actor available");

      // Call backend purchase function
      console.log("💳 [TradingService] Preparing buyer account...");
      const buyerAccount: Account = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: Principal.fromText(request.buyerPrincipal) as any,
        subaccount: [],
      };
      console.log("💳 [TradingService] Buyer account:", buyerAccount);

      // Validate nftId is a valid number for BigInt
      const nftIdNumber = parseInt(request.nftId);
      if (isNaN(nftIdNumber) || nftIdNumber <= 0) {
        console.log("❌ [TradingService] Invalid NFT ID:", request.nftId);
        return {
          success: false,
          message: "Invalid NFT ID",
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }

      const priceInE8s = BigInt(Math.floor(parseFloat(request.price) * 100_000_000));
      console.log("💳 [TradingService] Purchase parameters:", {
        nftId: nftIdNumber,
        price: request.price,
        priceInE8s: priceInE8s.toString(),
        buyerPrincipal: request.buyerPrincipal,
      });

      console.log("💳 [TradingService] Calling backend purchase_nft_with_icp...");
      const result = await backendActor.purchase_nft_with_icp(
        BigInt(nftIdNumber),
        buyerAccount,
        priceInE8s,
      );
      console.log("💳 [TradingService] Backend purchase result:", result);

      if ("Ok" in result) {
        const purchaseResult = result.Ok;
        console.log("✅ [TradingService] Purchase successful:", purchaseResult);
        return {
          success: purchaseResult.success,
          transactionId: purchaseResult.transaction_id?.toString() || "unknown",
          message: purchaseResult.message,
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      } else {
        console.log("❌ [TradingService] Purchase failed with error:", result.Err);
        return {
          success: false,
          message: `Purchase failed: ${result.Err}`,
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }
    } catch (error) {
      console.error("[TradingService] Purchase failed:", error);
      return {
        success: false,
        message: `Purchase failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        nftId: request.nftId,
        price: request.price,
        currency: request.currency,
      };
    }
  }

  /**
   * Get NFT listing information
   */
  static async getNFTListing(nftId: string): Promise<{
    isListed: boolean;
    price?: string;
    currency?: string;
    seller?: string;
  }> {
    try {
      console.log("📋 [TradingService] Getting listing for NFT ID:", nftId);
      
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        console.log("❌ [TradingService] Backend actor not available");
        return { isListed: false };
      }

      // Validate nftId is a valid number for BigInt
      const nftIdNumber = parseInt(nftId);
      if (isNaN(nftIdNumber) || nftIdNumber <= 0) {
        console.error("❌ [TradingService] Invalid NFT ID:", nftId);
        return { isListed: false };
      }
      
      console.log("📋 [TradingService] Calling backend get_token_listing with BigInt:", nftIdNumber);
      const listing = await backendActor.get_token_listing(BigInt(nftIdNumber));
      console.log("📋 [TradingService] Raw listing result:", listing);

      if (listing && listing.length > 0 && listing[0]) {
        const tokenListing = listing[0];
        console.log("📋 [TradingService] Token listing details:", tokenListing);
        
        // Parse currency properly
        let currency = "ICP";
        if (tokenListing.currency && typeof tokenListing.currency === 'object') {
          if ('ICP' in tokenListing.currency) {
            currency = "ICP";
          } else if ('USDT' in tokenListing.currency) {
            currency = "USDT";
          }
        }
        
        const result = {
          isListed: tokenListing.is_active,
          price: tokenListing.price,
          currency: currency,
          seller: tokenListing.seller.owner.toString(),
        };
        
        console.log("📋 [TradingService] Parsed listing result:", result);
        return result;
      }

      console.log("📋 [TradingService] No listing found for NFT ID:", nftId);
      return { isListed: false };
    } catch (error) {
      console.error("[TradingService] Failed to get NFT listing:", error);
      return { isListed: false };
    }
  }

  /**
   * List NFT for sale
   */
  static async listNFT(
    nftId: string,
    price: string,
    currency: "ICP" | "USDT",
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await CollectionService.setNFTPrice(
        nftId,
        price,
        currency,
      );

      if (result) {
        return {
          success: true,
          message: `NFT listed for ${price} ${currency}`,
        };
      } else {
        return {
          success: false,
          message: "Failed to list NFT",
        };
      }
    } catch (error) {
      console.error("[TradingService] Failed to list NFT:", error);
      return {
        success: false,
        message: `Failed to list NFT: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Delist NFT from sale
   */
  static async delistNFT(
    nftId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await CollectionService.delistNFT(nftId);

      if (result) {
        return {
          success: true,
          message: "NFT removed from sale",
        };
      } else {
        return {
          success: false,
          message: "Failed to delist NFT",
        };
      }
    } catch (error) {
      console.error("[TradingService] Failed to delist NFT:", error);
      return {
        success: false,
        message: `Failed to delist NFT: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }
}
