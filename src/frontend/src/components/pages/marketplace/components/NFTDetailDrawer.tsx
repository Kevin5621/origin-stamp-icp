import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  X,
  User,
  Shield,
  Award,
  Eye,
  Heart,
  TrendingUp,
  ExternalLink,
  Copy,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { useToastContext } from "@/contexts/ToastContext";
import { backendService } from "@/services";
import { VerificationContainer } from "@/components/verification/VerificationContainer";
import { verificationService } from "@/services";
import { type VerificationResult } from "@/types/verification";
import { useAuth } from "@/contexts/AuthContext";
import { TradingService } from "@/services";

interface NFTDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nftId: string | null;
  onBuyClick?: (nftId: string) => void;
  collectionPrice?: string;
  collectionCurrency?: string;
}

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
  listing?: {
    isListed: boolean;
    price?: string;
    currency?: string;
    seller?: string;
  };
}

export const NFTDetailDrawer: React.FC<NFTDetailDrawerProps> = ({
  isOpen,
  onClose,
  nftId,
  onBuyClick,
  collectionPrice,
  collectionCurrency = "ICP",
}) => {
  const { success: showSuccess, error: showError } = useToastContext();
  const { user } = useAuth();
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingListing, setIsCheckingListing] = useState(false);

  const loadVerificationData = useCallback(async (sessionId: string) => {
    if (!sessionId) return null;

    setIsLoadingVerification(true);
    try {
      const result = await verificationService.getVerificationResult(sessionId);
      return result;
    } catch {
      return null;
    } finally {
      setIsLoadingVerification(false);
    }
  }, []);

  const loadNFTDetails = useCallback(async () => {
    if (!nftId) return;

    setIsLoading(true);
    try {
      // Validate nftId is a valid number for BigInt
      const nftIdNumber = parseInt(nftId);
      if (isNaN(nftIdNumber) || nftIdNumber <= 0) {
        console.error("Invalid NFT ID:", nftId);
        throw new Error("Invalid NFT ID");
      }

      // Get token details from backend
      const tokenDetails = await backendService.getTokenDetails(BigInt(nftIdNumber));

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

        // Check if NFT is listed for sale
        setIsCheckingListing(true);
        const listing = await TradingService.getNFTListing(nftId);

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
            final_verification: verificationData
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
                  verification_type: "final" as const,
                  is_final_verification: true,
                }
              : undefined,
          },
          listing: {
            isListed: listing.isListed,
            price: collectionPrice || listing.price || "0",
            currency: collectionCurrency || listing.currency || "ICP",
            seller: listing.seller,
          },
        };

        setNftData(nft);
      } else {
        showError("NFT not found");
        onClose();
      }
    } catch {
      showError("Failed to load NFT details");
      onClose();
    } finally {
      setIsLoading(false);
      setIsCheckingListing(false);
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

  const handleViewOnExplorer = () => {
    if (nftData) {
      window.open(`https://originstamp.ic0.app/nft/${nftData.id}`, "_blank");
    }
  };

  const handleBuyClick = () => {
    if (nftData && onBuyClick) {
      onBuyClick(nftData.id);
    }
  };

  const getRarityBadge = (verificationScore: number) => {
    if (verificationScore >= 95) {
      return (
        <Badge className="bg-purple-500 text-xs text-white">Ultra Rare</Badge>
      );
    } else if (verificationScore >= 90) {
      return <Badge className="bg-blue-500 text-xs text-white">Rare</Badge>;
    } else {
      return (
        <Badge variant="secondary" className="text-xs">
          Common
        </Badge>
      );
    }
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return "0.00";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "0.00";
    return numPrice.toFixed(2);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-4xl h-full overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">NFT Details</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <LoadingSpinner variant="infinite" size="md" />
                <p className="text-muted-foreground mt-4">Loading NFT details...</p>
              </div>
            </div>
          ) : nftData ? (
            <div className="container mx-auto p-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* NFT Image */}
                <div className="space-y-4">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <AspectRatio ratio={1} className="overflow-hidden">
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
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleViewOnExplorer}
                      className="flex-1"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Explorer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopyTokenId}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy ID
                    </Button>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Title and Badges */}
                        <div>
                          <h1 className="text-foreground text-2xl font-bold mb-3">
                            {nftData.title}
                          </h1>
                          <div className="flex items-center gap-2 mb-4">
                            {getRarityBadge(nftData.metadata.verificationScore)}
                            <Badge variant="outline" className="text-xs">
                              {nftData.metadata.blockchain}
                            </Badge>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h3 className="mb-2 font-semibold">Description</h3>
                          <p className="text-muted-foreground">
                            {nftData.description || "No description available"}
                          </p>
                        </div>

                        {/* Creator */}
                        <div>
                          <h3 className="mb-2 font-semibold">Creator</h3>
                          <div className="flex items-center space-x-3">
                            <div className="from-primary to-accent flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r">
                              <User className="h-5 w-5 text-white" />
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

                        {/* Stats */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant={isLiked ? "primary" : "outline"}
                            size="sm"
                            onClick={handleLike}
                            className="flex-1 mr-3"
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-semibold text-lg flex items-center">
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
                    </CardContent>
                  </Card>

                  {/* Blockchain Details */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-semibold text-lg flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Blockchain Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Token ID:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">
                              {nftData.id.slice(0, 8)}...{nftData.id.slice(-8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCopyTokenId}
                              className="h-6 w-6"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Verification Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">AI Verification</h3>
                    <div className="space-y-3">
                      <VerificationContainer
                        verification={nftData.verification.preview_verification || null}
                        verificationType="preview"
                        loading={isLoadingVerification}
                        onViewDetails={() => {}}
                      />
                      <VerificationContainer
                        verification={nftData.verification.final_verification || null}
                        verificationType="final"
                        loading={isLoadingVerification}
                        onViewDetails={() => {}}
                      />
                    </div>
                  </div>

                  {/* Buy Button - Only show if listed and user is connected */}
                  {nftData.listing?.isListed && user?.principal && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Available for Purchase</h3>
                            <div className="text-3xl font-bold text-primary">
                              {formatPrice(nftData.listing.price)} {nftData.listing.currency}
                            </div>
                          </div>
                          <Button
                            onClick={handleBuyClick}
                            size="lg"
                            className="w-full"
                            disabled={isCheckingListing}
                          >
                            {isCheckingListing ? (
                              <>
                                <LoadingSpinner className="mr-2 h-4 w-4" />
                                Checking...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Buy Now
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                NFT Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                The requested NFT could not be found.
              </p>
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
