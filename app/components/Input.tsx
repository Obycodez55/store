import React from "react";

interface InputProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label: string;
  type?: string;
  error?: string;
  disabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  id,
  onChange,
  value,
  label,
  type = "text",
  error,
  disabled
}, ref) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            rounded-lg
            border
            bg-white
            px-4
            py-3
            text-sm
            transition-all
            duration-200
            placeholder:text-transparent
            focus:border-primary-500
            focus:outline-none
            focus:ring-2
            focus:ring-primary-500/20
            dark:bg-dark-surface
            dark:border-dark-border
            dark:focus:border-primary-400
            dark:focus:ring-primary-400/20
            ${error ? 'border-error-500' : 'border-slate-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={`
            absolute
            left-4
            -top-2.5
            bg-white
            px-1
            text-xs
            font-medium
            transition-all
            duration-200
            dark:bg-dark-surface
            ${error ? 'text-error-500' : 'text-slate-500'}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="text-xs text-error-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;