/**
 * Loading indicator component with semantic Neumorphic classes
 */
interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Loader({ size = "medium", className = "" }: LoaderProps) {
  return (
    <div
      className={`loading-container loading-container--${size} ${className}`}
    >
      <div className="loading-spinner" />
    </div>
  );
}
