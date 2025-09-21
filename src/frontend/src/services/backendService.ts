/**
 * Backend Service - Modular Architecture
 * Combines all modular services into a single service interface
 * Organized by domain for better maintainability
 * Enhanced with caching for performance optimization
 */

import { userAuthService } from "./auth";
import { userManagementService } from "./user";
import { physicalArtSessionService } from "./physical";
import { storageService } from "./storage";
import { subscriptionManagementService } from "./subscription";
import { nftCertificateService, nftTokenService } from "./nft";
import { aiVerificationService } from "./verification";
import { dashboardStatsService } from "./dashboard";
import { TradingService } from "./trading";
import {
  getBackendActor,
  isBackendAvailable,
  getBackendCanisterId,
} from "./core";
import type { LoginResult } from "../../../declarations/backend/backend.did";

// Simple in-memory cache for frequently accessed data
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

const CACHE_TTL = {
  STATS: 2 * 60 * 1000, // 2 minutes for stats
  USER_INFO: 5 * 60 * 1000, // 5 minutes for user info
  SESSION_DETAILS: 1 * 60 * 1000, // 1 minute for session details
  NFT_COLLECTION: 3 * 60 * 1000, // 3 minutes for NFT collection
};

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCachedData<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Backend Service
 * Provides all backend functionality through organized modules
 */
export const backendService = {
  // ===== AUTHENTICATION METHODS =====
  registerUser: userAuthService.registerUser,
  login: userAuthService.login,

  // ===== USER MANAGEMENT METHODS =====
  getAllUsers: userManagementService.getAllUsers,
  getUserInfo: async (username: string) => {
    const cacheKey = `user_info_${username}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const result = await userManagementService.getUserInfo(username);
    setCachedData(cacheKey, result, CACHE_TTL.USER_INFO);
    return result;
  },
  getUserCount: userManagementService.getUserCount,
  getUserAvatar: userManagementService.getUserAvatar,
  updateUserAvatar: userManagementService.updateUserAvatar,
  updateUsername: userManagementService.updateUsername,
  checkUsernameAvailability: userManagementService.checkUsernameAvailability,
  updateUserProfile: userManagementService.updateUserProfile,
  getUserProfile: userManagementService.getUserProfile,

  // ===== PHYSICAL ART SESSION METHODS =====
  createPhysicalArtSession: physicalArtSessionService.createPhysicalArtSession,
  uploadPhotoToSession: physicalArtSessionService.uploadPhotoToSession,
  getSessionDetails: physicalArtSessionService.getSessionDetails,
  getUserSessions: physicalArtSessionService.getUserSessions,
  updateSessionStatus: physicalArtSessionService.updateSessionStatus,
  removePhotoFromSession: physicalArtSessionService.removePhotoFromSession,

  // ===== STORAGE METHODS =====
  getS3Config: storageService.getS3Config,
  isS3Configured: storageService.isS3Configured,

  // ===== SUBSCRIPTION METHODS =====
  getUserSubscription: subscriptionManagementService.getUserSubscription,
  getUserSubscriptionLimits:
    subscriptionManagementService.getUserSubscriptionLimits,
  updateUserSubscription: subscriptionManagementService.updateUserSubscription,
  redeemCoupon: subscriptionManagementService.redeemCoupon,
  initializeUserSubscription:
    subscriptionManagementService.initializeUserSubscription,
  getAvailableCoupons: subscriptionManagementService.getAvailableCoupons,
  initializeDemoCoupons: subscriptionManagementService.initializeDemoCoupons,

  // ===== NFT METHODS =====
  generateCertificate: nftCertificateService.generateCertificate,
  mintCertificateNFT: nftCertificateService.mintCertificateNFT,
  mintNFTFromSession: nftCertificateService.mintNFTFromSession,
  getTokenDetails: nftTokenService.getTokenDetails,
  getUserNFTs: nftTokenService.getUserNFTs,
  getTokenListing: TradingService.getNFTListing,

  // ===== VERIFICATION METHODS =====
  createVerificationRequest: aiVerificationService.createVerificationRequest,
  getVerificationResult: aiVerificationService.getVerificationResult,
  updateVerificationResult: aiVerificationService.updateVerificationResult,
  getPendingVerifications: aiVerificationService.getPendingVerifications,
  manualVerificationOverride: aiVerificationService.manualVerificationOverride,

  // ===== DASHBOARD METHODS =====
  getMarketplaceStats: async () => {
    const cacheKey = "marketplace_stats";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const result = await dashboardStatsService.getMarketplaceStats();
    setCachedData(cacheKey, result, CACHE_TTL.STATS);
    return result;
  },
  getTopCreators: async () => {
    const cacheKey = "top_creators";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const result = await dashboardStatsService.getTopCreators();
    setCachedData(cacheKey, result, CACHE_TTL.STATS);
    return result;
  },

  // ===== MARKETPLACE METHODS =====
  getMarketplaceFeaturedCollections: async () => {
    const cacheKey = "marketplace_featured_collections";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const backendActor = await getBackendActor();
    if (!backendActor) throw new Error("Backend not available");

    const result = await backendActor.get_marketplace_featured_collections();
    setCachedData(cacheKey, result, CACHE_TTL.STATS);
    return result;
  },

  getTrendingCreators: async (limit: bigint) => {
    const cacheKey = `trending_creators_${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const backendActor = await getBackendActor();
    if (!backendActor) throw new Error("Backend not available");

    const result = await backendActor.get_trending_creators(limit);
    setCachedData(cacheKey, result, CACHE_TTL.STATS);
    return result;
  },

  getMarketplaceBanner: async () => {
    const cacheKey = "marketplace_banner";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const backendActor = await getBackendActor();
    if (!backendActor) throw new Error("Backend not available");

    const result = await backendActor.get_marketplace_banner();
    setCachedData(cacheKey, result, CACHE_TTL.STATS);
    return result;
  },

  // ===== UTILITY METHODS =====
  isAvailable: isBackendAvailable,
  getCanisterId: getBackendCanisterId,
  getBackendActor,

  // ===== CACHE MANAGEMENT =====
  clearCache: () => {
    cache.clear();
  },
  invalidateCache: (pattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  },

  // ===== MODULE ACCESS =====
  // Direct access to modules for advanced usage
  modules: {
    auth: userAuthService,
    user: userManagementService,
    physical: physicalArtSessionService,
    storage: storageService,
    subscription: subscriptionManagementService,
    nft: {
      certificate: nftCertificateService,
      token: nftTokenService,
    },
    verification: aiVerificationService,
    dashboard: dashboardStatsService,
  },

  // Direct backend methods
  async authenticateWithPrincipal(principal: string): Promise<LoginResult> {
    try {
      const actor = await getBackendActor();
      if (!actor) {
        throw new Error("Backend actor not available");
      }
      const result = await actor.authenticate_with_principal(principal);
      return result;
    } catch (error) {
      console.error("Error authenticating with principal:", error);
      throw error;
    }
  },
};

/**
 * Backward compatible exports
 */
// Alias exports removed - use backendService directly
