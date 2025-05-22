import { ChangeEvent } from "react";

interface InputFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
}

/**
 * Reusable input field component
 */
export function InputField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: InputFieldProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="focus:border-blue-500 focus:outline-none"
    />
  );
}
