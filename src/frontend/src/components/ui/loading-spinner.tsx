import { Spinner } from "./spinner";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?:
    | "default"
    | "circle"
    | "pinwheel"
    | "circle-filled"
    | "ellipsis"
    | "ring"
    | "bars"
    | "infinite";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  variant = "infinite",
}) => {
  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 24,
  };

  return (
    <Spinner variant={variant} size={sizeMap[size]} className={className} />
  );
};
