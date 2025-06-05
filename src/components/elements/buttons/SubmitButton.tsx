import React from 'react';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SubmitButton = ({
  label,
  loadingLabel,
  isSubmitting = false,
  disabled = false,
  className = '',
  onClick,
}: SubmitButtonProps): React.JSX.Element => {
  const baseClassName = "w-full font-medium rounded focus:outline-none transition-colors bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-base";
  
  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={disabled || isSubmitting}
      className={`${baseClassName} ${className}`}
      onClick={onClick}
    >
      {isSubmitting ? (loadingLabel || `${label}中...`) : label}
    </button>
  );
};