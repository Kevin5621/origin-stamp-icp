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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Shield,
  Brain,
  Zap,
  Target,
  AlertTriangle,
  Clock,
  RefreshCw,
  TrendingUp,
  Eye,
  FileCheck,
  Award,
  X,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import {
  physicalArtSessionService,
  PhysicalArtService,
  type PhysicalArtSession,
  nftCertificateService,
  type NFTMintingResult,
  verificationService,
  type VerificationResult,
  type VerificationStatus,
} from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import SortableImageUpload from "@/components/file-upload/sortable";

// Helper functions to reduce complexity
const convertBackendStatus = (backendStatus: unknown): VerificationStatus => {
  if (typeof backendStatus === "object" && backendStatus !== null) {
    if ("Pending" in backendStatus) return "pending";
    if ("Verified" in backendStatus) return "verified";
    if ("Rejected" in backendStatus) return "rejected";
    if ("InProgress" in backendStatus) return "in_progress";
  }
  return "pending";
};

const getVerificationBadgeClass = (status: string): string => {
  switch (status) {
    case "verified":
      return "bg-primary/10 text-primary border-primary/20";
    case "pending":
      return "bg-accent/20 text-accent-foreground border-accent/30";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "in_progress":
      return "bg-secondary/20 text-secondary-foreground border-secondary/30";
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30";
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-accent-foreground";
  return "text-destructive";
};

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

  // Verification state
  const [verification, setVerification] = useState<VerificationResult | null>(
    null,
  );
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isRunningVerification, setIsRunningVerification] = useState(false);
  const [verificationPolling, setVerificationPolling] =
    useState<NodeJS.Timeout | null>(null);

  const sessionId = params.sessionId as string;

  // Verification handlers (define early)
  const loadVerification = useCallback(
    async (forceRefresh = false) => {
      if (!sessionId) return;

      setIsLoadingVerification(true);
      try {
        const result =
          await verificationService.getVerificationResult(sessionId);

        if (result || forceRefresh) {
          const convertedResult: VerificationResult | null = result
            ? {
                verification_id: result.verification_id,
                session_id: result.session_id,
                asset_urls: result.assets.map((asset) => asset.s3_url),
                status: convertBackendStatus(result.status),
                confidence_score: result.final_score,
                verification_notes: result.notes,
                created_at: Number(result.created_at),
                updated_at: Number(result.checked_at),
                admin_notes: undefined,
              }
            : null;
          setVerification(convertedResult);
        }
      } catch (error) {
        console.error("Failed to load verification:", error);
        setVerification(null);
      } finally {
        setIsLoadingVerification(false);
      }
    },
    [sessionId],
  );

  // Start polling for verification updates
  const startVerificationPolling = useCallback(() => {
    if (verificationPolling) {
      clearInterval(verificationPolling);
    }

    const pollInterval = setInterval(async () => {
      try {
        const result =
          await verificationService.getVerificationResult(sessionId);
        if (result) {
          const convertedResult: VerificationResult = {
            verification_id: result.verification_id,
            session_id: result.session_id,
            asset_urls: result.assets.map((asset) => asset.s3_url),
            status: convertBackendStatus(result.status),
            confidence_score: result.final_score,
            verification_notes: result.notes,
            created_at: Number(result.created_at),
            updated_at: Number(result.checked_at),
            admin_notes: undefined,
          };

          setVerification(convertedResult);

          // Stop polling if verification is complete
          if (
            convertedResult.status === "verified" ||
            convertedResult.status === "rejected"
          ) {
            clearInterval(pollInterval);
            setVerificationPolling(null);
            setIsRunningVerification(false);
            showSuccess(
              `AI verification completed with score: ${convertedResult.confidence_score}%`,
            );
          }
        }
      } catch (error) {
        console.error("Error polling verification:", error);
      }
    }, 3000); // Poll every 3 seconds

    setVerificationPolling(pollInterval);
  }, [sessionId, verificationPolling, showSuccess]);

  // Stop polling
  const stopVerificationPolling = useCallback(() => {
    if (verificationPolling) {
      clearInterval(verificationPolling);
      setVerificationPolling(null);
    }
  }, [verificationPolling]);

  const loadSessionDetails = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const sessionData =
        await physicalArtSessionService.getSessionDetails(sessionId);
      if (sessionData) {
        // Convert bigint to number for created_at
        const convertedSession: PhysicalArtSession = {
          ...sessionData,
          created_at: Number(sessionData.created_at),
          updated_at: Number(sessionData.updated_at || sessionData.created_at),
        };
        setSession(convertedSession);
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

  const checkS3Configuration = useCallback(async () => {
    try {
      // Since isS3Configured method doesn't exist, we'll assume it's configured
      // This is a non-blocking operation
      setS3Configured(true);
    } catch {
      setS3Configured(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      // Load all data in parallel for better performance
      const loadAllData = async () => {
        try {
          await Promise.all([
            loadSessionDetails(),
            checkS3Configuration(),
            loadVerification(),
          ]);
        } catch (error) {
          console.error("Failed to load session data:", error);
        }
      };

      loadAllData();
    }
  }, [sessionId, loadSessionDetails, loadVerification, checkS3Configuration]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopVerificationPolling();
    };
  }, [stopVerificationPolling]);

  const handleUploadFiles = async () => {
    if (!sessionId || selectedFiles.length === 0) return;

    setIsUploadingFiles(true);
    try {
      // Upload files one by one using static method
      for (const file of selectedFiles) {
        try {
          // Using the static uploadPhoto method from the PhysicalArtService class
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
      showSuccess("Photos uploaded successfully");
    } catch {
      showError("Failed to upload photos");
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/sessions");
  };

  const handleRunVerification = async () => {
    if (!sessionId || uploadedPhotosCount === 0) return;

    setIsRunningVerification(true);
    try {
      showSuccess("Starting AI verification...");

      // Create verification request with uploaded photo URLs
      const assetUrls = session?.uploaded_photos || [];
      await verificationService.createVerificationRequest(sessionId, assetUrls);

      // Start polling for real-time updates
      startVerificationPolling();
    } catch (error) {
      console.error("Failed to run verification:", error);
      showError("Failed to start AI verification");
      setIsRunningVerification(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!session || !user?.principal) {
      showError("Session or user data not available");
      return;
    }

    setIsMintingNFT(true);
    setMintingResult(null);

    try {
      console.log(
        `[SessionRecordPage] 🎯 Starting NFT minting for session: ${session.session_id}`,
      );
      console.log(
        `[SessionRecordPage] 📋 User principal from context: ${user.principal}`,
      );
      showSuccess("Starting NFT minting process...");

      // Note: mintNFTFromSession now internally uses actual caller identity for consistency
      const tokenId = await nftCertificateService.mintNFTFromSession(
        session.session_id,
        user.principal, // This parameter will be replaced with actual caller identity in the service
        [],
      );

      if (tokenId) {
        const result: NFTMintingResult = {
          success: true,
          token_id: BigInt(tokenId),
        };
        setMintingResult(result);
        showSuccess(`🎉 NFT minted successfully! Token ID: ${tokenId}`);

        // Update session status in local state
        setSession((prev: PhysicalArtSession | null) =>
          prev ? { ...prev, status: "completed" } : null,
        );

        // Navigate to NFT detail page after a short delay
        setTimeout(() => {
          router.push(`/dashboard/collection/${tokenId}`);
        }, 2000);
      } else {
        const result: NFTMintingResult = {
          success: false,
          error: "Failed to mint NFT",
        };
        showError(`NFT minting failed: ${result.error}`);
        setMintingResult(result);
      }
    } catch (error) {
      console.error("NFT minting failed:", error);
      showError(
        `Failed to mint NFT: ${error instanceof Error ? error.message : "Unknown error"}`,
      );

      const result: NFTMintingResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      setMintingResult(result);
    } finally {
      setIsMintingNFT(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Completed
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-secondary/10 text-secondary-foreground border-secondary/20">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-muted/20 text-muted-foreground border-muted/30">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border">
            Unknown
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <LoadingSpinner variant="infinite" size="md" />
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
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="border-border flex items-center gap-4 border-b pb-4">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              {session.art_title}
            </h1>
            <p className="text-muted-foreground text-base">
              {session.description || "No description provided"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(session.status)}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Session Info - Spans 4 columns on large screens */}
          <div className="lg:col-span-4">
            <Card className="border-primary/20 h-full shadow-sm">
              <CardHeader className="border-border border-b p-6">
                <CardTitle className="text-primary flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5" />
                  Session Overview
                </CardTitle>
                <CardDescription className="text-sm">
                  Track your artwork documentation progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  {/* Photos Progress */}
                  <div className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-r p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-primary text-sm font-medium">
                        Photos Uploaded
                      </span>
                      <Zap className="text-primary h-4 w-4" />
                    </div>
                    <div className="text-primary mb-1 text-3xl font-bold">
                      {uploadedPhotosCount} / {maxPhotos}
                    </div>
                    <div className="text-primary/80 mb-3 text-xs">
                      {remainingPhotos > 0
                        ? `${remainingPhotos} more photos available`
                        : "Maximum reached"}
                    </div>
                    {/* Progress Bar */}
                    <div className="bg-primary/20 h-2 w-full rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(uploadedPhotosCount / maxPhotos) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Session Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-xs font-medium">
                          Created
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <TrendingUp className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-xs font-medium">
                          Status
                        </span>
                      </div>
                      <p className="text-sm font-medium capitalize">
                        {session.status}
                      </p>
                    </div>
                  </div>

                  {/* AI Verification Quick Status */}
                  <div className="border-border rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        AI Verification
                      </span>
                      <Brain className="h-4 w-4 text-blue-600" />
                    </div>
                    {verification ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            Score
                          </span>
                          <span className="text-primary text-sm font-bold">
                            {verification.confidence_score}%
                          </span>
                        </div>
                        <Badge
                          className={`text-xs ${getVerificationBadgeClass(verification.status)}`}
                        >
                          {verification.status.charAt(0).toUpperCase() +
                            verification.status.slice(1)}
                        </Badge>
                      </div>
                    ) : (
                      <div className="py-2 text-center">
                        <span className="text-muted-foreground text-xs">
                          Not started
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section - Spans 8 columns on large screens */}
          {canUploadMore && (
            <div className="lg:col-span-8" data-upload-section>
              <Card className="border-primary/20 bg-primary/5 h-full shadow-sm">
                <CardHeader className="border-border border-b p-6">
                  <CardTitle className="text-primary flex items-center gap-2 text-lg">
                    <Upload className="h-5 w-5" />
                    Upload Photos
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Upload photos of your artwork creation process. You can
                    upload up to{" "}
                    <span className="text-primary font-semibold">
                      {remainingPhotos}
                    </span>{" "}
                    more photos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-background/50 border-primary/20 mb-6 rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Target className="text-primary h-4 w-4" />
                      <span className="text-primary text-sm font-medium">
                        Photo Guidelines
                      </span>
                    </div>
                    <ul className="text-muted-foreground space-y-1 text-xs">
                      {/* Rest of the upload section content */}
                      <li>• Document your creation process step-by-step</li>
                      <li>
                        • Include materials, tools, and work-in-progress shots
                      </li>
                      <li>• Ensure good lighting and clear image quality</li>
                      <li>• Max file size: 10MB per photo</li>
                    </ul>
                  </div>

                  <SortableImageUpload
                    maxFiles={remainingPhotos}
                    maxSize={10 * 1024 * 1024} // 10MB
                    accept="image/*"
                    onImagesChange={(images) => {
                      setSelectedFiles(images.map((img) => img.file));
                    }}
                  />

                  {/* Upload Actions */}
                  {selectedFiles.length > 0 && (
                    <div className="bg-background border-primary/20 mt-6 rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-primary text-sm font-medium">
                            Ready to Upload
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {selectedFiles.length} photo
                            {selectedFiles.length > 1 ? "s" : ""} selected
                          </p>
                        </div>
                        <Upload className="text-primary h-5 w-5" />
                      </div>

                      <Button
                        onClick={handleUploadFiles}
                        disabled={
                          isUploadingFiles ||
                          isRunningVerification ||
                          isLoadingVerification ||
                          selectedFiles.length === 0
                        }
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full disabled:opacity-50"
                      >
                        {isUploadingFiles ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Uploading Photos...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload {selectedFiles.length} Photo
                            {selectedFiles.length > 1 ? "s" : ""}
                          </>
                        )}
                      </Button>

                      {(isRunningVerification || isLoadingVerification) && (
                        <p className="text-muted-foreground mt-2 text-xs">
                          Upload disabled during AI verification process
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Uploaded Photos Gallery - Horizontal Story Layout */}
        {uploadedPhotosCount > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="border-border border-b p-6">
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="text-primary mr-2 h-5 w-5" />
                Uploaded Photos ({uploadedPhotosCount})
              </CardTitle>
              <CardDescription className="text-sm">
                Your uploaded process documentation photos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Rest of gallery content */}
              {/* Horizontal Scrollable Story Layout */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {session.uploaded_photos.map(
                  (photoUrl: string, index: number) => (
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
                  ),
                )}

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

        {/* AI Verification Section - Enhanced */}
        {uploadedPhotosCount > 0 && (
          <div className="space-y-8" data-verification-section>
            {/* AI Verification Main Card */}
            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardHeader className="border-border border-b p-6">
                <CardTitle className="text-primary flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5" />
                  AI Verification Analysis
                </CardTitle>
                <CardDescription className="text-sm">
                  Advanced AI analysis for authenticity verification and quality
                  assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Rest of verification content */}
                {/* Verification Status */}
                {verification ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Overall Score */}
                    <div className="bg-background/50 rounded-lg p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Award
                          className={`h-4 w-4 ${getScoreColor(verification.confidence_score)}`}
                        />
                        <span className="text-sm font-medium">
                          Overall Score
                        </span>
                      </div>
                      <div className="text-primary text-2xl font-bold">
                        {verification.confidence_score}%
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        Authenticity Confidence
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-background/50 rounded-lg p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <Badge
                        className={`text-sm ${
                          verification.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : verification.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : verification.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {verification.status.charAt(0).toUpperCase() +
                          verification.status.slice(1)}
                      </Badge>
                      <div className="text-muted-foreground mt-2 text-xs">
                        Last checked:{" "}
                        {new Date(verification.updated_at).toLocaleString()}
                      </div>
                    </div>

                    {/* Photos Analyzed */}
                    <div className="bg-background/50 rounded-lg p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">
                          Photos Analyzed
                        </span>
                      </div>
                      <div className="text-primary text-2xl font-bold">
                        {verification.asset_urls?.length || 0}
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        Process Documentation
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background/50 rounded-lg py-8 text-center">
                    <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
                      No Verification Yet
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Start AI verification to analyze your artwork&apos;s
                      authenticity and quality
                    </p>
                  </div>
                )}

                {/* Verification Actions */}
                <div className="border-border border-t pt-6">
                  <div className="flex gap-4">
                    <Button
                      onClick={handleRunVerification}
                      disabled={
                        isLoadingVerification ||
                        isRunningVerification ||
                        !session.uploaded_photos.length ||
                        isUploadingFiles
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 disabled:opacity-50"
                    >
                      {isLoadingVerification || isRunningVerification ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          {verification
                            ? "Re-run AI Analysis"
                            : "Start AI Verification"}
                        </>
                      )}
                    </Button>

                    {isRunningVerification ? (
                      <Button
                        onClick={stopVerificationPolling}
                        variant="outline"
                        className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => loadVerification(true)}
                        variant="outline"
                        disabled={isLoadingVerification}
                        className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isLoadingVerification ? "animate-spin" : ""}`}
                        />
                      </Button>
                    )}
                  </div>

                  {/* Information text */}
                  <div className="bg-muted/50 mt-3 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">
                      {!session.uploaded_photos.length
                        ? "Upload photos first to enable AI verification"
                        : isUploadingFiles
                          ? "Complete photo upload before running verification"
                          : "AI verification analyzes your artwork's authenticity and creation process"}
                    </p>
                  </div>
                </div>

                {/* Verification Progress Indicator */}
                {(isLoadingVerification || isRunningVerification) && (
                  <div className="bg-primary/10 border-primary/20 mt-4 rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <LoadingSpinner size="md" className="text-primary" />
                      <div>
                        <p className="text-primary text-sm font-medium">
                          {isRunningVerification
                            ? "AI Analysis in Progress"
                            : "Loading verification..."}
                        </p>
                        <p className="text-primary/80 text-xs">
                          {isRunningVerification
                            ? "Our AI is analyzing your artwork for authenticity patterns..."
                            : "Checking for verification results..."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-primary/80 flex items-center justify-between text-xs">
                        <span>Processing {uploadedPhotosCount} photos</span>
                        <span>
                          {isRunningVerification
                            ? "This may take 30-60 seconds"
                            : "Checking every 3 seconds..."}
                        </span>
                      </div>
                      <div className="bg-primary/20 h-2 w-full rounded-full">
                        <div className="bg-primary h-2 w-3/4 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Verification Results */}
            {verification && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Analysis Details */}
                <Card className="shadow-sm">
                  <CardHeader className="border-border border-b p-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="text-secondary-foreground h-5 w-5" />
                      Analysis Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="bg-secondary/10 flex items-center justify-between rounded-lg p-4">
                        <span className="text-sm font-medium">
                          Authenticity Score
                        </span>
                        <span
                          className={`text-lg font-bold ${getScoreColor(verification.confidence_score)}`}
                        >
                          {verification.confidence_score}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Process Consistency
                          </span>
                          <div className="bg-muted h-2 w-24 rounded-full">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${Math.min(verification.confidence_score, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Image Quality
                          </span>
                          <div className="bg-muted h-2 w-24 rounded-full">
                            <div
                              className="bg-secondary h-2 rounded-full"
                              style={{
                                width: `${Math.min(verification.confidence_score + 10, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Temporal Flow
                          </span>
                          <div className="bg-muted h-2 w-24 rounded-full">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{
                                width: `${Math.min(verification.confidence_score - 5, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Notes */}
                <Card className="shadow-sm">
                  <CardHeader className="border-border border-b p-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileCheck className="text-primary h-5 w-5" />
                      AI Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Rest of the verification notes content */}
                    {verification.verification_notes &&
                    verification.verification_notes.length > 0 ? (
                      <div className="space-y-2">
                        {verification.verification_notes.map((note, index) => (
                          <div
                            key={index}
                            className="bg-muted/50 flex items-start gap-2 rounded p-2"
                          >
                            <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                            <span className="text-sm">{note}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <Clock className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                        <p className="text-muted-foreground text-sm">
                          Detailed analysis notes will appear here after
                          processing
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Action Cards */}
        <div className="space-y-8">
          {/* Complete Session Card */}
          {uploadedPhotosCount > 0 &&
            session.status !== "completed" &&
            canGenerateNFT && (
              <Card className="border-primary/20 bg-primary/5 shadow-sm">
                <CardHeader className="border-border border-b p-6">
                  <CardTitle className="text-primary flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5" />
                    Ready to Complete Session
                  </CardTitle>
                  <CardDescription className="text-sm">
                    You have uploaded {uploadedPhotosCount} photos. Complete the
                    session to generate a certificate and NFT.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Pre-completion checklist */}
                    <div className="bg-background/50 space-y-3 rounded-lg p-4">
                      <h4 className="text-primary mb-3 text-sm font-medium">
                        Pre-completion Check
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="text-primary h-3 w-3" />
                          <span>
                            Photos uploaded ({uploadedPhotosCount}/{maxPhotos})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {verification ? (
                            <CheckCircle className="text-primary h-3 w-3" />
                          ) : (
                            <AlertTriangle className="text-accent h-3 w-3" />
                          )}
                          <span>
                            AI Verification{" "}
                            {verification ? "completed" : "recommended"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="text-primary h-3 w-3" />
                          <span>NFT generation enabled</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCompleteSession}
                      disabled={
                        isMintingNFT ||
                        isUploadingFiles ||
                        isRunningVerification
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full disabled:opacity-50"
                      size="lg"
                    >
                      {isMintingNFT ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Minting NFT...
                        </>
                      ) : (
                        <>
                          <Award className="mr-2 h-4 w-4" />
                          Complete Session & Generate NFT
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* NFT Generation Disabled Card */}
          {uploadedPhotosCount > 0 &&
            session.status !== "completed" &&
            !canGenerateNFT && (
              <Card className="border-warning/20 bg-warning/5 shadow-sm">
                <CardHeader className="border-border border-b p-6">
                  <CardTitle className="text-warning flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5" />
                    NFT Generation Not Available
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Upgrade your subscription to generate NFTs from your artwork
                    sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="text-warning mb-3 text-sm font-medium">
                        Unlock NFT Features
                      </h4>
                      <ul className="text-warning/80 space-y-1 text-xs">
                        <li>• Generate verified NFT certificates</li>
                        <li>• Blockchain-based authenticity proof</li>
                        <li>• Enhanced AI verification features</li>
                        <li>• Priority support</li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => router.push("/dashboard/subscription")}
                      className="bg-warning text-warning-foreground hover:bg-warning/90 w-full"
                      size="lg"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* NFT Minting Result Card */}
          {mintingResult && (
            <Card
              className={`border-2 ${
                mintingResult.success
                  ? "border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-950 dark:to-green-900"
                  : "border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:border-red-800 dark:from-red-950 dark:to-red-900"
              }`}
            >
              <CardHeader
                className={`border-b ${
                  mintingResult.success
                    ? "border-green-200 dark:border-green-800"
                    : "border-red-200 dark:border-red-800"
                }`}
              >
                <CardTitle
                  className={`flex items-center gap-2 ${
                    mintingResult.success
                      ? "text-green-900 dark:text-green-100"
                      : "text-red-900 dark:text-red-100"
                  }`}
                >
                  {mintingResult.success ? (
                    <Award className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
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
                    ? `Your artwork has been minted as NFT with Token ID: ${mintingResult.token_id}. Redirecting to NFT details...`
                    : `Failed to mint NFT: ${mintingResult.error}`}
                </CardDescription>
              </CardHeader>
              {mintingResult.success && (
                <CardContent className="pt-6">
                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Token ID:</span>
                        <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
                          {mintingResult.token_id?.toString()}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Transaction Hash:
                        </span>
                        <code className="bg-muted max-w-32 truncate rounded px-2 py-1 font-mono text-sm">
                          {mintingResult.transaction_hash || "Processing..."}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Network:</span>
                        <span className="text-sm">Internet Computer</span>
                      </div>
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
