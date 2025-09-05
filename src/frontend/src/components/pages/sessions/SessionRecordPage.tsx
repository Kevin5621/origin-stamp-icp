"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import {
  PhysicalArtService,
  type PhysicalArtSession,
} from "@/services/physicalArtService";
import { NFTService, type NFTMintingResult } from "@/services/nftService";
import { useAuth } from "@/contexts/AuthContext";
import SortableImageUpload from "@/components/file-upload/sortable";

export const SessionRecordPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToastContext();
  const { maxPhotos, canGenerateNFT } = useSubscription();
  const { user } = useAuth();

  const [session, setSession] = useState<PhysicalArtSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [s3Configured, setS3Configured] = useState<boolean | null>(null);
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [mintingResult, setMintingResult] = useState<NFTMintingResult | null>(
    null,
  );

  const sessionId = params.sessionId as string;

  const loadSessionDetails = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const sessionData = await PhysicalArtService.getSessionDetails(sessionId);
      if (sessionData) {
        setSession(sessionData);
        setIsLoading(false);
      } else {
        router.push("/not-found");
        return;
      }
    } catch (error) {
      console.error("Failed to load session:", error);
      router.push("/not-found");
      return;
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (sessionId) {
      loadSessionDetails();
      checkS3Configuration();
    }
  }, [sessionId, loadSessionDetails]);

  const checkS3Configuration = async () => {
    try {
      const configured = await PhysicalArtService.isS3Configured();
      setS3Configured(configured);
    } catch (error) {
      console.error("Failed to check S3 configuration:", error);
      setS3Configured(false);
    }
  };

  const handleUploadFiles = async () => {
    if (!sessionId || selectedFiles.length === 0) return;

    try {
      // Upload files one by one
      for (const file of selectedFiles) {
        try {
          const result = await PhysicalArtService.uploadPhoto(sessionId, file);
          if (!result.success) {
            showError(`Failed to upload ${file.name}: ${result.message}`);
          }
        } catch (error) {
          showError(
            `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`,
          );
        }
      }

      // Refresh session data
      await loadSessionDetails();

      // Clear selected files
      setSelectedFiles([]);
      showSuccess("Photos uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Failed to upload photos");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/sessions");
  };

  const handleCompleteSession = async () => {
    if (!session || !user?.principal) {
      showError("Session or user data not available");
      return;
    }

    setIsMintingNFT(true);
    setMintingResult(null);

    try {
      showSuccess("Starting NFT minting process...");

      const result = await NFTService.completeSession(session, user.principal);

      if (result.success) {
        setMintingResult(result);
        showSuccess(`🎉 NFT minted successfully! Token ID: ${result.nftId}`);

        // Update session status in local state
        setSession((prev) => (prev ? { ...prev, status: "completed" } : null));

        // Navigate to NFT detail page after a short delay
        setTimeout(() => {
          router.push(`/dashboard/collection/${result.nftId}`);
        }, 2000);
      } else {
        showError(`NFT minting failed: ${result.error}`);
        setMintingResult(result);
      }
    } catch (error) {
      console.error("Complete session failed:", error);
      showError(
        `Failed to complete session: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsMintingNFT(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-500 text-white">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Spinner variant="infinite" size="lg" />
          <p className="text-muted-foreground mt-4">
            Loading session details...
          </p>
        </div>
      </div>
    );
  }

  if (s3Configured === false) {
    return (
      <div className="container mx-auto py-6">
        <div className="mx-auto">
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="text-destructive h-4 w-4" />
            <AlertDescription className="text-destructive">
              S3 storage is not configured. Please contact administrator to set
              up file storage.
            </AlertDescription>
          </Alert>
          <Button onClick={handleBack} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const uploadedPhotosCount = session.uploaded_photos.length;
  const canUploadMore = uploadedPhotosCount < maxPhotos;
  const remainingPhotos = maxPhotos - uploadedPhotosCount;

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-foreground text-2xl font-bold">
              {session.art_title}
            </h1>
            <p className="text-muted-foreground">
              {session.description || "No description provided"}
            </p>
          </div>
          {getStatusBadge(session.status)}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Session Info - Spans 4 columns on large screens */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Session Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-sm font-medium">
                      Photos Uploaded
                    </p>
                    <p className="text-2xl font-bold">
                      {uploadedPhotosCount} / {maxPhotos}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-sm font-medium">
                      Created
                    </p>
                    <p className="text-sm">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-sm font-medium">
                      Status
                    </p>
                    <p className="text-sm capitalize">{session.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section - Spans 8 columns on large screens */}
          {canUploadMore && (
            <div className="lg:col-span-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Photos
                  </CardTitle>
                  <CardDescription>
                    Upload photos of your artwork creation process. You can
                    upload up to {remainingPhotos} more photos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SortableImageUpload
                    maxFiles={remainingPhotos}
                    maxSize={10 * 1024 * 1024} // 10MB
                    accept="image/*"
                    onImagesChange={(images) => {
                      setSelectedFiles(images.map((img) => img.file));
                    }}
                    onUploadComplete={handleUploadFiles}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Uploaded Photos Gallery - Horizontal Story Layout */}
        {uploadedPhotosCount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Uploaded Photos ({uploadedPhotosCount})
              </CardTitle>
              <CardDescription>
                Your uploaded process documentation photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Horizontal Scrollable Story Layout */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {session.uploaded_photos.map((photoUrl, index) => (
                  <div
                    key={`${session.session_id}-photo-${index}`}
                    className="group relative flex-shrink-0"
                  >
                    <div className="bg-muted hover:border-primary relative h-32 w-24 overflow-hidden rounded-lg border-2 border-transparent transition-all">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={`Process ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 96px, 96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground h-8 w-8" />
                        </div>
                      )}

                      {/* Story Number Badge */}
                      <div className="bg-primary text-primary-foreground absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-all group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Progress Step Label */}
                    <p className="text-muted-foreground mt-2 text-center text-xs">
                      Step {index + 1}
                    </p>
                  </div>
                ))}

                {/* Add More Photos Placeholder */}
                {canUploadMore && (
                  <div className="flex-shrink-0">
                    <div className="bg-muted/50 border-muted-foreground/25 flex h-32 w-24 items-center justify-center rounded-lg border-2 border-dashed">
                      <div className="text-center">
                        <Camera className="text-muted-foreground mx-auto mb-1 h-6 w-6" />
                        <p className="text-muted-foreground text-xs">
                          Add More
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-2 text-center text-xs">
                      +{remainingPhotos}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Timeline */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  {uploadedPhotosCount >= maxPhotos
                    ? "Maximum Reached"
                    : "Documentation Progress"}
                </div>
                <div className="text-muted-foreground text-sm">
                  {uploadedPhotosCount >= maxPhotos
                    ? `${uploadedPhotosCount} photos (Max: ${maxPhotos})`
                    : `${uploadedPhotosCount} of ${maxPhotos} photos`}
                </div>
              </div>
              <div className="bg-muted mt-2 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    uploadedPhotosCount >= maxPhotos
                      ? "bg-success"
                      : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min((uploadedPhotosCount / maxPhotos) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bento Grid for Action Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Complete Session Card */}
          {uploadedPhotosCount > 0 &&
            session.status !== "completed" &&
            canGenerateNFT && (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900 dark:text-green-100">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Ready to Complete Session
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    You have uploaded {uploadedPhotosCount} photos. Complete the
                    session to generate a certificate and NFT.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleCompleteSession}
                    disabled={isMintingNFT}
                    className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {isMintingNFT ? (
                      <Spinner variant="infinite" size="sm" className="mr-2" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {isMintingNFT
                      ? "Minting NFT..."
                      : "Complete Session & Generate NFT"}
                  </Button>
                </CardContent>
              </Card>
            )}

          {/* NFT Generation Disabled Card */}
          {uploadedPhotosCount > 0 &&
            session.status !== "completed" &&
            !canGenerateNFT && (
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-900 dark:text-yellow-100">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    NFT Generation Not Available
                  </CardTitle>
                  <CardDescription className="text-yellow-700 dark:text-yellow-300">
                    Upgrade your subscription to generate NFTs from your artwork
                    sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push("/dashboard/subscription")}
                    className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
                  >
                    Upgrade Subscription
                  </Button>
                </CardContent>
              </Card>
            )}

          {/* NFT Minting Result Card */}
          {mintingResult && (
            <Card
              className={`border-2 ${
                mintingResult.success
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center ${
                    mintingResult.success
                      ? "text-green-900 dark:text-green-100"
                      : "text-red-900 dark:text-red-100"
                  }`}
                >
                  {mintingResult.success ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                  ) : (
                    <AlertCircle className="mr-2 h-5 w-5" />
                  )}
                  {mintingResult.success
                    ? "NFT Minted Successfully!"
                    : "NFT Minting Failed"}
                </CardTitle>
                <CardDescription
                  className={
                    mintingResult.success
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }
                >
                  {mintingResult.success
                    ? `Your artwork has been minted as NFT with Token ID: ${mintingResult.nftId}. Redirecting to NFT details...`
                    : `Failed to mint NFT: ${mintingResult.error}`}
                </CardDescription>
              </CardHeader>
              {mintingResult.success && (
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Token ID:</span>
                      <span className="font-mono text-sm">
                        {mintingResult.nftId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Certificate ID:
                      </span>
                      <span className="font-mono text-sm">
                        {mintingResult.certificateId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Token URI:</span>
                      <span className="max-w-xs truncate font-mono text-sm">
                        {mintingResult.tokenUri}
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
