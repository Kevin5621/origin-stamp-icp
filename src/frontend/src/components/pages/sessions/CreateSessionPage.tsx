"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Camera,
  AlertCircle,
  Lightbulb,
  Image as ImageIcon,
  Palette,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import { backendService } from "@/services";

export const CreateSessionPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToastContext();
  const { maxPhotos, canGenerateNFT } = useSubscription();

  const [artTitle, setArtTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [s3Configured, setS3Configured] = useState<boolean | null>(null);

  React.useEffect(() => {
    checkS3Configuration();
  }, []);

  const checkS3Configuration = async () => {
    try {
      const configured = await backendService.isS3Configured();
      setS3Configured(configured);
    } catch (error) {
      console.error("Failed to check S3 configuration:", error);
      setS3Configured(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Title validation
    const sanitizedTitle = artTitle.trim();
    if (!sanitizedTitle) {
      newErrors.title = "Artwork title is required";
    } else if (sanitizedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (sanitizedTitle.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(sanitizedTitle)) {
      newErrors.title = "Title contains invalid characters";
    }

    // Description validation
    if (description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSession = async () => {
    if (!user?.username) {
      showError("Please log in to create a session");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    try {
      showSuccess("Creating your art session...");

      const sessionId = await backendService.createPhysicalArtSession(
        user.username,
        artTitle.trim(),
        description.trim() || "No description provided",
      );

      showSuccess(
        `Session "${artTitle.trim()}" created successfully! You can now start documenting your artwork.`,
      );

      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push(`/dashboard/sessions/${sessionId}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to create session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create session";
      showError(`Failed to create session: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (s3Configured === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <LoadingSpinner variant="infinite" size="md" />
          <p className="text-muted-foreground mt-4">
            Checking S3 configuration...
          </p>
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
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={checkS3Configuration} variant="secondary">
              <Camera className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Create Art Session
            </h1>
            <p className="text-muted-foreground">
              Document your artwork creation process to get certified NFTs
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Subscription Info Card - Spans 4 columns */}
          <div className="lg:col-span-4">
            <Card className="border-primary/20 bg-primary/5 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-primary flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Your Plan Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-primary/80 text-sm font-medium">
                      Maximum photos per session
                    </p>
                    <p className="text-primary text-xl font-bold">
                      {maxPhotos} photos
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-primary/80 text-sm font-medium">
                      NFT generation
                    </p>
                    <p className="text-primary text-lg font-semibold">
                      {canGenerateNFT ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  {!canGenerateNFT && (
                    <div className="border-accent bg-accent/10 rounded-lg border p-3">
                      <p className="text-accent-foreground text-xs">
                        Upgrade to enable NFT generation for your artwork
                        sessions
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Session Form - Spans 8 columns */}
          <div className="lg:col-span-8">
            <Card className="border-border h-full">
              <CardHeader className="border-border border-b">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="text-primary h-5 w-5" />
                  Session Details
                </CardTitle>
                <CardDescription>
                  Provide information about your artwork to create a new session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Artwork Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="artTitle"
                    className="text-foreground font-medium"
                  >
                    Artwork Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="artTitle"
                    type="text"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="Enter your artwork title"
                    disabled={isCreating}
                    className={`transition-colors ${
                      errors.title
                        ? "border-destructive focus:border-destructive"
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-destructive flex items-center gap-1 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-foreground font-medium"
                  >
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your artwork, materials used, inspiration, etc."
                    rows={4}
                    disabled={isCreating}
                    className={`resize-none transition-colors ${
                      errors.description
                        ? "border-destructive focus:border-destructive"
                        : "border-input focus:border-primary"
                    }`}
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>{description.length}/500 characters</span>
                    {errors.description && (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Create Button */}
                <div className="border-border flex gap-4 border-t pt-4">
                  <Button
                    onClick={handleCreateSession}
                    disabled={isCreating || !artTitle.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                    size="lg"
                  >
                    {isCreating ? (
                      <LoadingSpinner
                        variant="infinite"
                        size="sm"
                        className="mr-2"
                      />
                    ) : (
                      <Camera className="mr-2 h-4 w-4" />
                    )}
                    {isCreating ? "Creating Session..." : "Create Session"}
                  </Button>
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    disabled={isCreating}
                    size="lg"
                    className="border-border hover:bg-muted"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Text Card - Full width with bento grid */}
        <Card className="border-muted bg-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-foreground flex items-center text-sm font-semibold">
                  <Lightbulb className="text-primary mr-2 h-4 w-4" />
                  Getting Started
                </h4>
                <p className="text-muted-foreground text-xs">
                  Create a session to document your artistic process from start
                  to finish
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-foreground flex items-center text-sm font-semibold">
                  <ImageIcon className="text-primary mr-2 h-4 w-4" />
                  Photo Documentation
                </h4>
                <p className="text-muted-foreground text-xs">
                  Upload photos showing your creation process, materials, and
                  progress
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-foreground flex items-center text-sm font-semibold">
                  <Palette className="text-primary mr-2 h-4 w-4" />
                  {canGenerateNFT ? "NFT Certificate" : "Documentation"}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {canGenerateNFT
                    ? "Complete the session to generate a verified certificate of authenticity"
                    : "Create a documented record of your artwork creation process"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
