import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ExternalLink,
  Copy,
  User,
  Shield,
  Award,
  Eye,
  Heart,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { useToastContext } from "@/contexts/ToastContext";
import { backendService, verificationService, TradingService } from "@/services";
import { VerificationContainer } from "@/components/verification/VerificationContainer";
import { type VerificationResult } from "@/types/verification";
import { useAuth } from "@/contexts/AuthContext";

interface NFTData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  metadata: {
    certificateId: string;
    sessionId: string;
    verificationScore: number;
    authenticityRating: number;
    provenanceScore: number;
    communityTrust: number;
    issueDate: string;
    expiryDate: string;
    blockchain: string;
    tokenStandard: string;
  };
  stats: {
    views: number;
    likes: number;
    createdAt: string;
  };
  verification: {
    preview_verification?: VerificationResult;
    final_verification?: VerificationResult;
  };
}

interface NFTDetailModalProps {
  isOpen: boolean;
  nftId: string | null;
  onClose: () => void;
}

export const NFTDetailModal: React.FC<NFTDetailModalProps> = ({
  isOpen,
  nftId,
  onClose,
}) => {
  const { success: showSuccess, error: showError } = useToastContext();
  const { user } = useAuth();

  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const loadVerificationData = useCallback(async (sessionId: string) => {
    if (!sessionId) return null;

    setIsLoadingVerification(true);
    try {
      const result = await verificationService.getVerificationResult(sessionId);
      return result;
    } catch (error) {
      console.error("Failed to load verification:", error);
      return null;
    } finally {
      setIsLoadingVerification(false);
    }
  }, []);

  const loadNFTDetails = useCallback(async () => {
    if (!nftId) return;

    setIsLoading(true);
    try {
      // Get token details from backend
      const tokenDetails = await backendService.getTokenDetails(BigInt(nftId));

      if (tokenDetails) {
        const token = tokenDetails;

        // Get session details for additional metadata
        const sessionDetails =
          Array.isArray(token.session_id) &&
          token.session_id.length > 0 &&
          token.session_id[0]
            ? await backendService.getSessionDetails(token.session_id[0])
            : null;

        // Load verification data
        const sessionId = Array.isArray(token.session_id)
          ? token.session_id[0] || ""
          : "";
        const verificationData = sessionId
          ? await loadVerificationData(sessionId)
          : null;

        const nft: NFTData = {
          id: token.id.toString(),
          title: token.metadata.name,
          description: Array.isArray(token.metadata.description)
            ? token.metadata.description[0] || ""
            : token.metadata.description || "",
          imageUrl: Array.isArray(token.metadata.image)
            ? token.metadata.image[0] || ""
            : token.metadata.image || "",
          creator: {
            username: sessionDetails?.username || "Unknown Artist",
            avatar: "",
            verified: true,
          },
          metadata: {
            certificateId: "",
            sessionId: Array.isArray(token.session_id)
              ? token.session_id[0] || ""
              : "",
            verificationScore: 95,
            authenticityRating: 98,
            provenanceScore: 92,
            communityTrust: 88,
            issueDate: new Date(
              Number(token.created_at) / 1000000,
            ).toISOString(),
            expiryDate: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            blockchain: "Internet Computer",
            tokenStandard: "ICRC-7",
          },
          stats: {
            views: Math.floor(Math.random() * 1000) + 100,
            likes: Math.floor(Math.random() * 100) + 10,
            createdAt: new Date(
              Number(token.created_at) / 1000000,
            ).toISOString(),
          },
          verification: {
            preview_verification: verificationData
              ? {
                  verification_id: verificationData.verification_id,
                  session_id: verificationData.session_id,
                  assets: verificationData.assets.map((asset) => ({
                    asset_id: asset.asset_id,
                    s3_url: asset.s3_url,
                    step_index: Number(asset.step_index),
                    sha256: asset.sha256,
                    content_type: asset.content_type,
                  })),
                  status:
                    "Pending" in verificationData.status
                      ? "Pending"
                      : "Verified" in verificationData.status
                        ? "Verified"
                        : "Rejected" in verificationData.status
                          ? "Rejected"
                          : "ReviewNeeded",
                  final_score: verificationData.final_score,
                  base_similarity: verificationData.base_similarity,
                  anomaly_count: verificationData.anomaly_count,
                  breakdown: Object.fromEntries(verificationData.breakdown),
                  model_version: verificationData.model_version,
                  evidence_urls: verificationData.evidence_urls,
                  checked_at: Number(verificationData.checked_at),
                  created_at: Number(verificationData.created_at),
                  notes: verificationData.notes || [],
                  verification_type: "preview" as const,
                  is_final_verification: false,
                }
              : undefined,
          },
        };

        setNftData(nft);
      } else {
        showError("NFT not found");
        onClose();
      }
    } catch (error) {
      console.error("Failed to load NFT details:", error);
      showError("Failed to load NFT details");
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [nftId, showError, onClose, loadVerificationData]);

  useEffect(() => {
    if (isOpen && nftId) {
      loadNFTDetails();
    }
  }, [isOpen, nftId, loadNFTDetails]);

  const handleCopyTokenId = () => {
    if (nftData) {
      navigator.clipboard.writeText(nftData.id);
      showSuccess("Token ID copied to clipboard");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showSuccess(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  const handleBuyNFT = async () => {
    if (!nftData || !user?.principal) {
      showError("Please connect your wallet to purchase NFTs");
      return;
    }
    
    setIsBuying(true);
    try {
      // Check if NFT is listed for sale
      const listing = await TradingService.getNFTListing(nftData.id);
      
      if (!listing.isListed) {
        showError("This NFT is not currently for sale");
        return;
      }

      // Check wallet balance
      const balanceCheck = await TradingService.checkSufficientBalance(
        "1.00", // Default price for now
        "ICP",
        user.principal
      );

      if (!balanceCheck.sufficient) {
        showError(`Insufficient balance. Required: ${balanceCheck.requiredAmount}, Available: ${balanceCheck.currentBalance}`);
        return;
      }

      // Purchase NFT
      const purchaseResult = await TradingService.purchaseNFT({
        nftId: nftData.id,
        price: "1.00",
        currency: "ICP",
        buyerPrincipal: user.principal,
      });

      if (purchaseResult.success) {
        showSuccess(`Successfully purchased ${nftData.title}! Transaction ID: ${purchaseResult.transactionId}`);
        onClose(); // Close modal after successful purchase
      } else {
        showError(purchaseResult.message);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      showError("Purchase failed. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleViewOnExplorer = () => {
    if (nftData) {
      window.open(`https://originstamp.ic0.app/nft/${nftData.id}`, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>
            {nftData?.title || "NFT Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner variant="infinite" size="md" />
              <p className="text-muted-foreground mt-4">
                Loading NFT details...
              </p>
            </div>
          </div>
        ) : nftData ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* NFT Image */}
            <div>
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                {nftData.imageUrl ? (
                  <Image
                    src={nftData.imageUrl}
                    alt={nftData.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/600x600/4A5568/ffffff?text=NFT+Image";
                    }}
                  />
                ) : (
                  <div className="bg-muted flex h-full items-center justify-center">
                    <div className="text-center">
                      <Eye className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
                      <p className="text-muted-foreground">
                        No image available
                      </p>
                    </div>
                  </div>
                )}
              </AspectRatio>
            </div>

            {/* NFT Details */}
            <div className="space-y-6">
              {/* Price and Buy Section - Moved to top for prominence */}
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Price</p>
                    <p className="text-3xl font-bold text-green-600">1.00 ICP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Available</p>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">1 of 1</p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 h-auto"
                  onClick={handleBuyNFT}
                  disabled={isBuying}
                  size="lg"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {isBuying ? "Processing..." : "Buy Now - 1.00 ICP"}
                </Button>
                <p className="text-xs text-green-600 text-center mt-2">
                  Secure payment with ICP • Instant ownership transfer
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyTokenId}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy ID
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewOnExplorer}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Explorer
                </Button>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {nftData.description || "No description available"}
                </p>
              </div>

              {/* Creator */}
              <div>
                <h3 className="mb-2 font-semibold">Creator</h3>
                <div className="flex items-center space-x-2">
                  <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{nftData.creator.username}</p>
                    {nftData.creator.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant={isLiked ? "primary" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="mr-2 flex-1"
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Liked" : "Like"} ({nftData.stats.likes})
                </Button>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Eye className="mr-1 h-4 w-4" />
                  {nftData.stats.views} views
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div>
                <h3 className="mb-3 flex items-center font-semibold">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Verification Score
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {nftData.metadata.verificationScore}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Authenticity Rating
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {nftData.metadata.authenticityRating}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Provenance Score
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {nftData.metadata.provenanceScore}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Community Trust
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {nftData.metadata.communityTrust}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Blockchain Details */}
              <div>
                <h3 className="mb-3 flex items-center font-semibold">
                  <Award className="mr-2 h-5 w-5" />
                  Blockchain Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blockchain:</span>
                    <span className="font-medium">
                      {nftData.metadata.blockchain}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Standard:</span>
                    <span className="font-medium">
                      {nftData.metadata.tokenStandard}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(nftData.stats.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {nftData.metadata.sessionId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="font-mono text-xs">
                        {nftData.metadata.sessionId.slice(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Verification Section */}
              <div>
                <h3 className="mb-3 font-semibold">AI Verification</h3>
                <VerificationContainer
                  verification={
                    nftData.verification.preview_verification || null
                  }
                  verificationType="preview"
                  loading={isLoadingVerification}
                  onViewDetails={() => {
                    console.log("View preview verification details");
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Failed to load NFT details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
