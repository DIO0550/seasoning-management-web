import React from 'react';
import { ErrorMessage } from '@/components/elements/errors/ErrorMessage';

interface Option {
  id: string;
  name: string;
}

interface SelectInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
}

export const SelectInput = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = '選択してください',
  required = false,
  errorMessage = '',
}: SelectInputProps): React.JSX.Element => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
      <ErrorMessage message={errorMessage} />
    </div>
  );
};