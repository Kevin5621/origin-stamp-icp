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
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Camera, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import { PhysicalArtService } from "@/services/physicalArtService";

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
      const configured = await PhysicalArtService.isS3Configured();
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
      const sessionId = await PhysicalArtService.createSession(
        user.username,
        artTitle.trim(),
        description.trim() || "No description provided",
      );

      showSuccess("Art session created successfully!");
      router.push(`/dashboard/sessions/${sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create session";
      showError(errorMessage);
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
          <Spinner variant="infinite" size="lg" />
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
          <Button onClick={handleBack} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-2xl space-y-6">
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

        {/* Subscription Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary flex items-center text-lg">
              <Camera className="mr-2 h-5 w-5" />
              Your Plan Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary/80 space-y-1 text-sm">
              <p>
                • Maximum photos per session: <strong>{maxPhotos}</strong>
              </p>
              <p>
                • NFT generation:{" "}
                <strong>{canGenerateNFT ? "Enabled" : "Disabled"}</strong>
              </p>
              {!canGenerateNFT && (
                <p className="text-primary/60 mt-2 text-xs">
                  Upgrade your plan to generate NFTs from your artwork
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Session Form */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>
              Provide information about your artwork to create a new session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Artwork Title */}
            <div className="space-y-2">
              <Label htmlFor="artTitle">
                Artwork Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="artTitle"
                type="text"
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                placeholder="Enter your artwork title"
                disabled={isCreating}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork, materials used, inspiration, etc."
                rows={4}
                disabled={isCreating}
                className={errors.description ? "border-red-500" : ""}
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>{description.length}/500 characters</span>
                {errors.description && (
                  <span className="text-red-500">{errors.description}</span>
                )}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleCreateSession}
                disabled={isCreating || !artTitle.trim()}
                className="flex-1"
              >
                {isCreating ? (
                  <Spinner variant="infinite" size="sm" className="mr-2" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {isCreating ? "Creating Session..." : "Create Session"}
              </Button>
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={isCreating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-gray-700">
              <h4 className="font-semibold">What happens next?</h4>
              <ul className="ml-4 list-inside list-disc space-y-1">
                <li>You&apos;ll be redirected to the session page</li>
                <li>Upload photos of your artwork creation process</li>
                <li>Complete the session to generate a certificate</li>
                {canGenerateNFT && (
                  <li>Mint an NFT representing your artwork</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
