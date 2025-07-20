interface FormInputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function FormInput({
  id,
  type = "text",
  value,
  onChange,
  label,
  placeholder = "",
  required = false,
  className = "",
}: FormInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted"
        required={required}
      />
    </div>
  );
}