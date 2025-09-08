"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { VerificationResult, VerificationType } from "@/types/verification";

interface VerificationContainerProps {
  verification: VerificationResult | null;
  verificationType: VerificationType;
  loading?: boolean;
  onRequestVerification?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export const VerificationContainer: React.FC<VerificationContainerProps> = ({
  verification,
  verificationType,
  loading = false,
  onRequestVerification,
  onViewDetails,
  className = "",
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Verified":
        return {
          icon: CheckCircle,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/20",
          label: "Verified",
        };
      case "ReviewNeeded":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          label: "Review Needed",
        };
      case "Rejected":
        return {
          icon: XCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
          label: "Rejected",
        };
      case "Pending":
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bgColor: "bg-muted/50",
          borderColor: "border-border",
          label: "Processing...",
        };
    }
  };

  const getTypeConfig = (type: VerificationType) => {
    switch (type) {
      case "preview":
        return {
          icon: Eye,
          label: "Preview Verification",
          description: "Quality check before final mint",
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
      case "final":
        return {
          icon: Award,
          label: "Final Verification",
          description: "Official NFT verification",
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/20",
        };
    }
  };

  const typeConfig = getTypeConfig(verificationType);
  const statusConfig = verification
    ? getStatusConfig(verification.status)
    : null;

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
              <div className="bg-muted h-3 w-48 animate-pulse rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-muted h-4 w-full animate-pulse rounded" />
            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!verification) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeConfig.bgColor} ${typeConfig.borderColor} border`}
            >
              <typeConfig.icon className={`h-4 w-4 ${typeConfig.color}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                {typeConfig.label}
              </CardTitle>
              <CardDescription className="text-xs">
                {typeConfig.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center">
            <Shield className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground mb-4 text-sm">
              {verificationType === "preview"
                ? "Run a preview verification to check quality before minting"
                : "Final verification will be performed after NFT minting"}
            </p>
            {onRequestVerification && verificationType === "preview" && (
              <Button
                onClick={onRequestVerification}
                size="sm"
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Run Preview Verification
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeConfig.bgColor} ${typeConfig.borderColor} border`}
            >
              <typeConfig.icon className={`h-4 w-4 ${typeConfig.color}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                {typeConfig.label}
              </CardTitle>
              <CardDescription className="text-xs">
                {typeConfig.description}
              </CardDescription>
            </div>
          </div>
          {statusConfig && (
            <Badge
              variant="outline"
              className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}
            >
              <statusConfig.icon className="mr-1 h-3 w-3" />
              {statusConfig.label}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Overall Score</span>
          </div>
          <div className="text-right">
            <div className="text-primary text-lg font-bold">
              {verification.final_score}%
            </div>
            <div className="text-muted-foreground text-xs">
              Similarity: {(verification.base_similarity * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        {Object.keys(verification.breakdown).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Score Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(verification.breakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anomalies */}
        {verification.anomaly_count > 0 && (
          <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-3">
            <div className="mb-1 flex items-center gap-2">
              <AlertCircle className="text-destructive h-4 w-4" />
              <span className="text-destructive text-sm font-medium">
                Anomalies Detected
              </span>
            </div>
            <p className="text-destructive/80 text-xs">
              {verification.anomaly_count} potential inconsistencies found in
              the creation process.
            </p>
          </div>
        )}

        {/* Notes */}
        {verification.notes.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Analysis Notes
            </h4>
            <div className="space-y-1">
              {verification.notes.map((note, index) => (
                <p key={index} className="text-muted-foreground text-xs">
                  • {note}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              <Eye className="mr-1 h-3 w-3" />
              View Details
            </Button>
          )}
          {verificationType === "preview" &&
            verification.status === "Verified" && (
              <Badge variant="secondary" className="flex-1 justify-center">
                <CheckCircle className="mr-1 h-3 w-3" />
                Ready for Mint
              </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
