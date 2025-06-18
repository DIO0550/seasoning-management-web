import React from 'react';
import { ErrorMessage } from '@/components/elements/errors/ErrorMessage';

interface FileInputProps {
  id: string;
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
}

export const FileInput = ({
  id,
  name,
  label,
  onChange,
  accept = 'image/jpeg,image/png',
  required = false,
  errorMessage = '',
  helperText = '',
}: FileInputProps): React.JSX.Element => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        id={id}
        name={name}
        accept={accept}
        onChange={onChange}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      <ErrorMessage message={errorMessage} />
    </div>
  );
};