import { ChangeEvent } from "react";

interface TextAreaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  disabled?: boolean;
}

/**
 * Reusable text area component
 */
export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
}: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="mb-4 w-full resize-y rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-blue-500 focus:outline-none"
    />
  );
}
