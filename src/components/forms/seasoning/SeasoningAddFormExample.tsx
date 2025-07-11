import React from 'react';
import { SeasoningAddForm } from '@/components/forms/seasoning/SeasoningAddForm';

interface FormData {
  name: string;
  type: string;
  image: File | null;
}

export const SeasoningAddFormExample = (): React.JSX.Element => {
  const handleSubmit = async (data: FormData) => {
    // This would typically call an API
    console.log('Form submitted with data:', data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example: Check for duplicate name
    // This would be an API call in a real application
    if (data.name === 'salt') {
      throw new Error('この調味料名は既に登録されています');
    }
    
    // If successful, the form will be reset
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">調味料追加</h2>
      <SeasoningAddForm onSubmit={handleSubmit} />
    </div>
  );
};