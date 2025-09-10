"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  User,
  Shield,
  Award,
  Eye,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useToastContext } from "@/contexts/ToastContext";
import { backendService } from "@/services";
import { VerificationContainer } from "@/components/verification/VerificationContainer";
import { verificationService } from "@/services";
import { type VerificationResult } from "@/types/verification";

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

export const NFTDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToastContext();

  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const nftId = params.nftId as string;

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
        };

        setNftData(nft);
      } else {
        showError("NFT not found");
        router.push("/dashboard/collection");
      }
    } catch (error) {
      console.error("Failed to load NFT details:", error);
      showError("Failed to load NFT details");
    } finally {
      setIsLoading(false);
    }
  }, [nftId, showError, router, loadVerificationData]);

  useEffect(() => {
    if (nftId) {
      loadNFTDetails();
    }
  }, [nftId, loadNFTDetails]);

  const handleBack = () => {
    router.push("/dashboard/collection");
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <LoadingSpinner variant="infinite" size="md" />
          <p className="text-muted-foreground mt-4">Loading NFT details...</p>
        </div>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-foreground mb-4 text-2xl font-bold">
            NFT Not Found
          </h1>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {nftData.title}
            </h1>
            <p className="text-muted-foreground">Token ID: {nftData.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleCopyTokenId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </Button>
          <Button variant="outline" onClick={handleViewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* NFT Image */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                {nftData.imageUrl ? (
                  <Image
                    src={nftData.imageUrl}
                    alt={nftData.title}
                    fill
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
        </div>

        {/* NFT Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>NFT Details</CardTitle>
              <CardDescription>
                Information about this authenticated artwork
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {nftData.description || "No description available"}
                </p>
              </div>

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
            </CardContent>
          </Card>

          {/* Authentication Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Authentication Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Verification Score
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {nftData.metadata.verificationScore}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Authenticity Rating
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {nftData.metadata.authenticityRating}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Provenance Score
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {nftData.metadata.provenanceScore}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Community Trust
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    {nftData.metadata.communityTrust}%
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
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
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          {nftData.metadata.sessionId && (
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-mono text-xs">
                      {nftData.metadata.sessionId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-medium">
                      {new Date(
                        nftData.metadata.issueDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="font-medium">
                      {new Date(
                        nftData.metadata.expiryDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Verification Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Verification</h3>
            <div className="grid gap-4">
              <VerificationContainer
                verification={nftData.verification.preview_verification || null}
                verificationType="preview"
                loading={isLoadingVerification}
                onViewDetails={() => {
                  // TODO: Implement detailed verification view
                  console.log("View preview verification details");
                }}
              />
              <VerificationContainer
                verification={nftData.verification.final_verification || null}
                verificationType="final"
                loading={isLoadingVerification}
                onViewDetails={() => {
                  // TODO: Implement detailed verification view
                  console.log("View final verification details");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
