/**
 * Backend Service - Modular Architecture
 * Combines all modular services into a single service interface
 * Organized by domain for better maintainability
 */

import { userAuthService } from "./auth";
import { userManagementService } from "./user";
import { physicalArtSessionService } from "./physical";
import { storageService } from "./storage";
import { subscriptionManagementService } from "./subscription";
import { nftCertificateService, nftTokenService } from "./nft";
import { aiVerificationService } from "./verification";
import { dashboardStatsService } from "./dashboard";
import {
  getBackendActor,
  isBackendAvailable,
  getBackendCanisterId,
} from "./core";

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
  getUserInfo: userManagementService.getUserInfo,
  getUserCount: userManagementService.getUserCount,
  getUserAvatar: userManagementService.getUserAvatar,
  updateUserAvatar: userManagementService.updateUserAvatar,
  updateUsername: userManagementService.updateUsername,

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

  // ===== VERIFICATION METHODS =====
  createVerificationRequest: aiVerificationService.createVerificationRequest,
  getVerificationResult: aiVerificationService.getVerificationResult,
  updateVerificationResult: aiVerificationService.updateVerificationResult,
  getPendingVerifications: aiVerificationService.getPendingVerifications,
  manualVerificationOverride: aiVerificationService.manualVerificationOverride,

  // ===== DASHBOARD METHODS =====
  getMarketplaceStats: dashboardStatsService.getMarketplaceStats,
  getTopCreators: dashboardStatsService.getTopCreators,

  // ===== UTILITY METHODS =====
  isAvailable: isBackendAvailable,
  getCanisterId: getBackendCanisterId,
  getBackendActor,

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
};

/**
 * Backward compatible exports
 */
// Alias exports removed - use backendService directly
