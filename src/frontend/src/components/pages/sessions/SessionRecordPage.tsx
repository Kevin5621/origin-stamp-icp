"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  FileImage,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import {
  PhysicalArtService,
  type PhysicalArtSession,
  type UploadProgress,
} from "@/services/physicalArtService";

export const SessionRecordPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToastContext();
  const { maxPhotos, canGenerateNFT } = useSubscription();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<PhysicalArtSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, UploadProgress>
  >(new Map());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [s3Configured, setS3Configured] = useState<boolean | null>(null);

  const sessionId = params.sessionId as string;

  const loadSessionDetails = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const sessionData = await PhysicalArtService.getSessionDetails(sessionId);
      if (sessionData) {
        setSession(sessionData);
      } else {
        showError("Session not found");
        router.push("/dashboard/sessions");
      }
    } catch (error) {
      console.error("Failed to load session:", error);
      showError("Failed to load session details");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showError, router]);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file count
    const totalFiles = session?.uploaded_photos.length || 0;
    if (totalFiles + fileArray.length > maxPhotos) {
      showError(
        `You can only upload up to ${maxPhotos} photos. You have ${totalFiles} photos and trying to add ${fileArray.length} more.`,
      );
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (!validateFile(file)) {
        continue;
      }
      validFiles.push(file);
    }

    setSelectedFiles(validFiles);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      showError(
        `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`,
      );
      return false;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showError(`File too large: ${file.name}. Maximum size is 10MB.`);
      return false;
    }

    return true;
  };

  const handleUploadFiles = async () => {
    if (!sessionId || selectedFiles.length === 0) return;

    setIsUploading(true);
    const newUploadProgress = new Map<string, UploadProgress>();

    try {
      // Initialize progress for all files
      selectedFiles.forEach((file) => {
        newUploadProgress.set(file.name, {
          progress: 0,
          status: "uploading",
        });
      });
      setUploadProgress(newUploadProgress);

      // Upload files one by one
      for (const file of selectedFiles) {
        try {
          const result = await PhysicalArtService.uploadPhoto(sessionId, file);

          if (result.success) {
            newUploadProgress.set(file.name, {
              progress: 100,
              status: "completed",
              url: result.url,
            });
          } else {
            newUploadProgress.set(file.name, {
              progress: 0,
              status: "error",
              error: result.message,
            });
          }
        } catch (error) {
          newUploadProgress.set(file.name, {
            progress: 0,
            status: "error",
            error: error instanceof Error ? error.message : "Upload failed",
          });
        }

        setUploadProgress(new Map(newUploadProgress));
      }

      // Refresh session data
      await loadSessionDetails();

      // Clear selected files
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showSuccess("Photos uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadProgress((prev) => {
      const newMap = new Map(prev);
      newMap.delete(fileName);
      return newMap;
    });
  };

  const handleBack = () => {
    router.push("/dashboard/sessions");
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

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <div className="mx-auto max-w-2xl">
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="text-destructive h-4 w-4" />
            <AlertDescription className="text-destructive">
              Session not found or you don&apos;t have permission to access it.
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

  if (s3Configured === false) {
    return (
      <div className="container mx-auto py-6">
        <div className="mx-auto max-w-2xl">
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

  const uploadedPhotosCount = session.uploaded_photos.length;
  const canUploadMore = uploadedPhotosCount < maxPhotos;
  const remainingPhotos = maxPhotos - uploadedPhotosCount;

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-4xl space-y-6">
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

        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Photos Uploaded
                </p>
                <p className="text-2xl font-bold">
                  {uploadedPhotosCount} / {maxPhotos}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Created
                </p>
                <p className="text-sm">
                  {new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Status
                </p>
                <p className="text-sm">{session.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        {canUploadMore && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Photos
              </CardTitle>
              <CardDescription>
                Upload photos of your artwork creation process. You can upload
                up to {remainingPhotos} more photos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Input */}
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={isUploading}
                  className="mb-2"
                >
                  <FileImage className="mr-2 h-4 w-4" />
                  Select Photos
                </Button>
                <p className="text-muted-foreground text-sm">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Supports JPEG, PNG, WebP, GIF up to 10MB each
                </p>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  {selectedFiles.map((file) => {
                    const progress = uploadProgress.get(file.name);
                    return (
                      <div
                        key={file.name}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <ImageIcon className="text-muted-foreground h-4 w-4" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {progress && (
                            <div className="mt-2">
                              <Progress
                                value={progress.progress}
                                className="h-2"
                              />
                              <p className="text-muted-foreground mt-1 text-xs">
                                {progress.status === "uploading" &&
                                  "Uploading..."}
                                {progress.status === "completed" && "Completed"}
                                {progress.status === "error" && progress.error}
                              </p>
                            </div>
                          )}
                        </div>
                        {!isUploading && (
                          <Button
                            onClick={() => removeSelectedFile(file.name)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload Button */}
              {selectedFiles.length > 0 && (
                <Button
                  onClick={handleUploadFiles}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <Spinner variant="infinite" size="sm" className="mr-2" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {isUploading
                    ? "Uploading..."
                    : `Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? "s" : ""}`}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Uploaded Photos */}
        {uploadedPhotosCount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Uploaded Photos ({uploadedPhotosCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {session.uploaded_photos.map((photoUrl, index) => (
                  <div key={index} className="group relative">
                    <div className="bg-muted flex aspect-square items-center justify-center rounded-lg">
                      <ImageIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                    <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black opacity-0 transition-all group-hover:opacity-100">
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Session */}
        {uploadedPhotosCount > 0 &&
          session.status !== "completed" &&
          canGenerateNFT && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Ready to Complete Session
                </CardTitle>
                <CardDescription className="text-green-700">
                  You have uploaded {uploadedPhotosCount} photos. Complete the
                  session to generate a certificate and NFT.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Session & Generate NFT
                </Button>
              </CardContent>
            </Card>
          )}

        {/* NFT Generation Disabled */}
        {uploadedPhotosCount > 0 &&
          session.status !== "completed" &&
          !canGenerateNFT && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-900">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  NFT Generation Not Available
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Upgrade your subscription to generate NFTs from your artwork
                  sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/dashboard/subscription")}
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  Upgrade Subscription
                </Button>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
};
