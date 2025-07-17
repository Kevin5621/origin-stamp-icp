import { ChangeEvent } from "react";

interface InputFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  type?: string;
  label?: string;
}

/**
 * Reusable input field component with semantic Neumorphic classes
 */
export function InputField({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  type = "text",
  label,
}: InputFieldProps) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`.trim()}
      />
    </div>
  );
}
