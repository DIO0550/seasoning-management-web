import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <p className="text-red-500 text-sm mt-1">{message}</p>
  );
};