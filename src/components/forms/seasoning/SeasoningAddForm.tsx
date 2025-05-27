import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ErrorMessage } from '../../elements/errors/ErrorMessage';

// Define seasoning types - this would typically come from an API
const SEASONING_TYPES = [
  { id: 'salt', name: '塩' },
  { id: 'sugar', name: '砂糖' },
  { id: 'pepper', name: '胡椒' },
  { id: 'vinegar', name: '酢' },
  { id: 'soySauce', name: '醤油' },
  { id: 'other', name: 'その他' },
];

interface SeasoningAddFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

interface FormData {
  name: string;
  type: string;
  image: File | null;
}

interface FormErrors {
  name: string;
  type: string;
  image: string;
  general: string;
}

export const SeasoningAddForm: React.FC<SeasoningAddFormProps> = ({ onSubmit }) => {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    image: null,
  });

  // Form errors state
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    type: '',
    image: '',
    general: '',
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Update form validity whenever form data or errors change
  useEffect(() => {
    // Form is valid if required fields are filled and there are no errors
    const requiredFieldsValid = formData.name && formData.type;
    const noErrors = !errors.name && !errors.type && !errors.image && !errors.general;
    
    setIsFormValid(requiredFieldsValid && noErrors);
  }, [formData, errors]);

  // Validate name field
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

  // Validate type field
  const validateType = (type: string): string => {
    if (!type) {
      return '調味料の種類を選択してください';
    }
    return '';
  };

  // Validate image field
  const validateImage = (file: File | null): string => {
    if (!file) return '';

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return 'JPEG、PNG 形式のファイルを選択してください';
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      return 'ファイルサイズは 5MB 以下にしてください';
    }

    return '';
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate the field if it's a required field
    let validationError = '';
    if (name === 'name') {
      validationError = validateName(value);
    } else if (name === 'type') {
      validationError = validateType(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    setFormData(prev => ({
      ...prev,
      image: file
    }));
    
    const validationError = validateImage(file);
    setErrors(prev => ({
      ...prev,
      image: validationError
    }));
  };

  // Handle blur events for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate the field if it's a required field
    let validationError = '';
    if (name === 'name') {
      validationError = validateName(value);
    } else if (name === 'type') {
      validationError = validateType(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const typeError = validateType(formData.type);
    const imageError = validateImage(formData.image);
    
    const newErrors = {
      name: nameError,
      type: typeError,
      image: imageError,
      general: ''
    };
    
    setErrors(newErrors);
    
    // Check if there are any validation errors
    if (nameError || typeError || imageError) {
      return;
    }
    
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        // Reset form after successful submission
        setFormData({
          name: '',
          type: '',
          image: null
        });
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          general: '調味料の登録に失敗しました。入力内容を確認してください'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General error message */}
      {errors.general && <ErrorMessage message={errors.general} />}
      
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          調味料 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="調味料名を入力"
          maxLength={20}
        />
        <ErrorMessage message={errors.name} />
      </div>
      
      {/* Type field */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          調味料の種類 <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>選択してください</option>
          {SEASONING_TYPES.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <ErrorMessage message={errors.type} />
      </div>
      
      {/* Image field */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          調味料の画像
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-sm text-gray-500">JPEG または PNG 形式、5MB以下</p>
        <ErrorMessage message={errors.image} />
      </div>
      
      {/* Submit button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full font-medium rounded focus:outline-none transition-colors bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-base"
        >
          {isSubmitting ? '追加中...' : '追加'}
        </button>
      </div>
    </form>
  );
};