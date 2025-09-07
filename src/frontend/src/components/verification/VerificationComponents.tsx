import React from "react";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import type {
  VerificationResult,
  VerificationStatus,
} from "@/services/verificationService";

interface VerificationBadgeProps {
  status: VerificationStatus;
  score?: number;
  size?: "sm" | "md" | "lg";
}

interface VerificationCardProps {
  verification: VerificationResult | null;
  loading?: boolean;
  onRequestVerification?: () => void;
  onManualOverride?: (status: VerificationStatus, notes: string) => void;
  showAdminControls?: boolean;
}

/**
 * Badge component showing verification status
 */
export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  score,
  size = "md",
}) => {
  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case "Verified":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Verified",
        };
      case "ReviewNeeded":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: "Review Needed",
        };
      case "Rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Rejected",
        };
      case "Pending":
      default:
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          label: "Pending",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${config.bgColor} ${config.borderColor} ${config.color} ${sizeClasses[size]} `}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 font-semibold">({score}%)</span>
      )}
    </div>
  );
};

/**
 * Comprehensive verification display card
 */
export const VerificationCard: React.FC<VerificationCardProps> = ({
  verification,
  loading = false,
  onRequestVerification,
  onManualOverride,
  showAdminControls = false,
}) => {
  const [overrideStatus, setOverrideStatus] =
    React.useState<VerificationStatus>("Verified");
  const [overrideNotes, setOverrideNotes] = React.useState("");
  const [showOverrideForm, setShowOverrideForm] = React.useState(false);

  const handleOverrideSubmit = () => {
    if (onManualOverride && overrideNotes.trim()) {
      onManualOverride(overrideStatus, overrideNotes);
      setShowOverrideForm(false);
      setOverrideNotes("");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-200"></div>
          <div className="h-3 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="text-center">
          <Shield className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            AI Verification Available
          </h3>
          <p className="mb-4 text-gray-600">
            Request AI verification to validate the authenticity of your art
            creation process.
          </p>
          {onRequestVerification && (
            <button
              onClick={onRequestVerification}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Request Verification
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">AI Verification</h3>
        </div>
        <VerificationBadge
          status={verification.status}
          score={verification.final_score}
        />
      </div>

      {/* Score Breakdown */}
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">
          Score Breakdown
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(verification.breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="font-medium">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies */}
      {verification.anomaly_count > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-red-700">
            Anomalies Detected ({verification.anomaly_count})
          </h4>
          <p className="text-sm text-red-600">
            Some images in the sequence may be inconsistent with the art
            creation process.
          </p>
        </div>
      )}

      {/* Notes */}
      {verification.notes.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Analysis Notes
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {verification.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Admin Controls */}
      {showAdminControls && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {!showOverrideForm ? (
            <button
              onClick={() => setShowOverrideForm(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Manual Override
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Override Status
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) =>
                    setOverrideStatus(e.target.value as VerificationStatus)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Admin Notes
                </label>
                <textarea
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Reason for manual override..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleOverrideSubmit}
                  disabled={!overrideNotes.trim()}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply Override
                </button>
                <button
                  onClick={() => {
                    setShowOverrideForm(false);
                    setOverrideNotes("");
                  }}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="mt-4 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            Processed:{" "}
            {new Date(verification.checked_at * 1000).toLocaleString()}
          </span>
          <span>Model: {verification.model_version}</span>
        </div>
      </div>
    </div>
  );
};
