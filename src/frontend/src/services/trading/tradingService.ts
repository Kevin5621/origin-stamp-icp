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
  static async getWalletBalance(userPrincipal?: string): Promise<WalletBalance> {
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

      // Get ICP balance
      const icpBalance = await icpLedgerService.getBalance(
        Principal.fromText(userPrincipal)
      );

      return {
        icp: icpBalance,
        isConnected: true,
        principal: userPrincipal,
      };
    } catch (error) {
      console.error("[TradingService] Failed to get wallet balance:", error);
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
  }

  /**
   * Check if user has sufficient balance for purchase
   */
  static async checkSufficientBalance(
    price: string,
    currency: "ICP" | "USDT",
    userPrincipal?: string
  ): Promise<{ sufficient: boolean; currentBalance: string; requiredAmount: string }> {
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
      const currentBalance = walletBalance.icp.decimal;

      return {
        sufficient: currentBalance >= requiredAmount,
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
      // Check if user is connected
      const walletBalance = await this.getWalletBalance(request.buyerPrincipal);
      if (!walletBalance.isConnected) {
        return {
          success: false,
          message: "Wallet not connected. Please connect your wallet first.",
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }

      // Check sufficient balance
      const balanceCheck = await this.checkSufficientBalance(
        request.price,
        request.currency,
        request.buyerPrincipal
      );
      
      if (!balanceCheck.sufficient) {
        return {
          success: false,
          message: `Insufficient balance. Required: ${balanceCheck.requiredAmount}, Available: ${balanceCheck.currentBalance}`,
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }

      // Get backend actor
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        return {
          success: false,
          message: "Backend service not available",
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      }

      // Call backend purchase function
      const buyerAccount: Account = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: Principal.fromText(request.buyerPrincipal) as any,
        subaccount: [],
      };
      
      const result = await backendActor.purchase_nft_with_icp(
        BigInt(request.nftId),
        buyerAccount,
        BigInt(Math.floor(parseFloat(request.price) * 100_000_000)) // Convert to e8s
      );

      if ("Ok" in result) {
        const purchaseResult = result.Ok;
        return {
          success: purchaseResult.success,
          transactionId: purchaseResult.transaction_id?.toString() || "unknown",
          message: purchaseResult.message,
          nftId: request.nftId,
          price: request.price,
          currency: request.currency,
        };
      } else {
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
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        return { isListed: false };
      }

      const listing = await backendActor.get_token_listing(BigInt(nftId));
      
      if (listing && listing.length > 0 && listing[0]) {
        const tokenListing = listing[0];
        return {
          isListed: tokenListing.is_active,
          price: tokenListing.price,
          currency: Object.keys(tokenListing.currency)[0],
          seller: tokenListing.seller.owner.toString(),
        };
      }

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
    currency: "ICP" | "USDT"
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await CollectionService.setNFTPrice(nftId, price, currency);
      
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
  static async delistNFT(nftId: string): Promise<{ success: boolean; message: string }> {
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
