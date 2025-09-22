"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
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
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Verified":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-800",
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
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800",
          label: "Rejected",
        };
      case "Pending":
      default:
        return {
          icon: Clock,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-950/20",
          borderColor: "border-gray-200 dark:border-gray-800",
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
        };
      case "final":
        return {
          icon: Award,
          label: "Final Verification",
          description: "Official NFT verification",
          color: "text-purple-600 dark:text-purple-400",
        };
    }
  };

  const typeConfig = getTypeConfig(verificationType);
  const statusConfig = verification
    ? getStatusConfig(verification.status)
    : null;

  if (loading) {
    return (
      <div className={`border-border rounded-lg border ${className}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
            <div className="space-y-1">
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
              <div className="bg-muted h-3 w-48 animate-pulse rounded" />
            </div>
          </div>
          <div className="bg-muted h-6 w-16 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className={`border-border rounded-lg border ${className}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeConfig.color} bg-opacity-10`}
            >
              <typeConfig.icon className={`h-4 w-4 ${typeConfig.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium">{typeConfig.label}</h3>
              <p className="text-muted-foreground text-xs">
                {typeConfig.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Shield className="text-muted-foreground mx-auto h-6 w-6" />
            <p className="text-muted-foreground mt-1 text-xs">
              {verificationType === "preview"
                ? "Not verified"
                : "Pending verification"}
            </p>
          </div>
        </div>
        {onRequestVerification && verificationType === "preview" && (
          <div className="px-4 pb-4">
            <Button
              onClick={onRequestVerification}
              size="sm"
              className="w-full"
            >
              <Eye className="mr-2 h-4 w-4" />
              Run Preview Verification
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border-border rounded-lg border ${className}`}>
      {/* Header - Always visible */}
      <button
        className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeConfig.color} bg-opacity-10`}
          >
            <typeConfig.icon className={`h-4 w-4 ${typeConfig.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium">{typeConfig.label}</h3>
            <p className="text-muted-foreground text-xs">
              {typeConfig.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusConfig && (
            <Badge
              variant="outline"
              className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color} text-xs`}
            >
              <statusConfig.icon className="mr-1 h-3 w-3" />
              {statusConfig.label}
            </Badge>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-border space-y-4 border-t px-4 py-4">
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
              <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
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
              <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
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
        </div>
      )}
    </div>
  );
};
