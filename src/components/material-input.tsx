import { useState } from "react";

interface MaterialInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id: string;
  type: string;
  label: string;
  error?: string;
  registerProps?: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    name: string;
    ref: React.RefCallback<HTMLInputElement>;
  };
}

const MaterialInput = ({
  id,
  type,
  label,
  error,
  registerProps,
  ...props
}: MaterialInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    setHasValue(e.target.value.length > 0);
    // Call the register's onBlur if it exists
    if (registerProps?.onBlur) {
      registerProps.onBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    // Call the register's onChange if it exists
    if (registerProps?.onChange) {
      registerProps.onChange(e);
    }
  };

  return (
    <div className="relative mb-6">
      <input
        id={id}
        type={type}
        className={`
          peer w-full pt-6 pb-2 border-0 border-b-2 bg-transparent
          focus:outline-none focus:ring-0 transition-colors duration-200
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }
        `}
        name={registerProps?.name || id}
        ref={registerProps?.ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-0 transition-all duration-200 pointer-events-none
          ${focused || hasValue ? "top-1 text-xs" : "top-4 text-base"}
          ${
            error ? "text-red-500" : focused ? "text-blue-500" : "text-gray-500"
          }
        `}
      >
        {label}
      </label>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default MaterialInput;
