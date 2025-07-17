/**
 * Component for displaying error messages with semantic Neumorphic classes
 */
interface ErrorDisplayProps {
  message: string;
  className?: string;
}

export function ErrorDisplay({ message, className = "" }: ErrorDisplayProps) {
  return (
    <div className={`error-display ${className}`.trim()}>
      <div className="flex items-center">
        <div className="mr-3">
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h4 className="mb-1 text-sm font-medium text-red-800">Error</h4>
          <pre className="text-sm break-words whitespace-pre-wrap text-red-700">
            {message}
          </pre>
        </div>
      </div>
    </div>
  );
}
