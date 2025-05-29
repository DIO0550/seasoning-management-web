import { useState, ChangeEvent, FocusEvent } from 'react';

export interface UseSeasoningNameInputReturn {
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  reset: () => void;
}

/**
 * Custom hook for managing seasoning name input field
 * Handles validation, state management, and event handlers
 */
export const useSeasoningNameInput = (): UseSeasoningNameInputReturn => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Validate name field - extracted from SeasoningAddForm
  const validateName = (name: string): string => {
    if (!name) {
      return '調味料名は必須です';
    }
    if (name.length > 20) {
      return '調味料名は 20 文字以内で入力してください';
    }
    // Check if name contains only alphanumeric characters (半角英数字)
    if (!/^[a-zA-Z0-9]*$/.test(name)) {
      return '調味料名は半角英数字で入力してください';
    }
    
    // For duplicated check, you would typically check against an API
    // This is a placeholder for that functionality
    // In a real implementation, this would be an async call to the API
    
    return '';
  };

  // Handle input changes
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Validate the field on change
    const validationError = validateName(newValue);
    setError(validationError);
  };

  // Handle blur events for validation
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    
    // Validate the field on blur
    const validationError = validateName(currentValue);
    setError(validationError);
  };

  // Reset function to clear value and error
  const reset = () => {
    setValue('');
    setError('');
  };

  return {
    value,
    error,
    onChange,
    onBlur,
    reset,
  };
};