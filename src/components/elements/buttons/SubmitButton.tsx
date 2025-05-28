import React from 'react';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SubmitButton = ({
  label,
  loadingLabel,
  isSubmitting = false,
  disabled = false,
  className = '',
}: SubmitButtonProps): React.JSX.Element => {
  const baseClassName = "w-full font-medium rounded focus:outline-none transition-colors bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-base";
  
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={`${baseClassName} ${className}`}
    >
      {isSubmitting ? (loadingLabel || `${label}中...`) : label}
    </button>
  );
};