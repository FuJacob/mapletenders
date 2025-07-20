import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  label = "Password",
  placeholder = "••••••••",
  required = false,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted pr-12"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
        >
          {showPassword ? (
            <EyeSlash className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}