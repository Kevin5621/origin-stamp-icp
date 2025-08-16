import React from "react";
import { Loader } from "./Loader";

interface DashboardLoaderProps {
  message?: string;
  variant?: "skeleton" | "spinner" | "dots";
  size?: "small" | "medium" | "large";
}

export const DashboardLoader: React.FC<DashboardLoaderProps> = ({
  message = "Memuat data...",
  variant = "spinner",
  size = "medium",
}) => {
  if (variant === "skeleton") {
    return (
      <div className="dashboard-loader dashboard-loader--skeleton">
        <div className="dashboard-loader__header">
          <div className="dashboard-loader__title-skeleton" />
          <div className="dashboard-loader__subtitle-skeleton" />
        </div>
        <div className="dashboard-loader__content">
          <div className="dashboard-loader__card-skeleton" />
          <div className="dashboard-loader__card-skeleton" />
          <div className="dashboard-loader__card-skeleton" />
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="dashboard-loader dashboard-loader--dots">
        <div className="dashboard-loader__dots">
          <div className="dashboard-loader__dot" />
          <div className="dashboard-loader__dot" />
          <div className="dashboard-loader__dot" />
        </div>
        <p className="dashboard-loader__message">{message}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-loader dashboard-loader--spinner">
      <Loader size={size} />
      <p className="dashboard-loader__message">{message}</p>
    </div>
  );
};

export default DashboardLoader;
