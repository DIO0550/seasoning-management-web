import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ErrorMessage } from '../../elements/errors/ErrorMessage';
import { TextInput } from '../../elements/inputs/TextInput';
import { SelectInput } from '../../elements/inputs/SelectInput';
import { FileInput } from '../../elements/inputs/FileInput';
import { SubmitButton } from '../../elements/buttons/SubmitButton';

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

export const SeasoningAddForm = ({ onSubmit }: SeasoningAddFormProps): React.JSX.Element => {
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
    const requiredFieldsValid = Boolean(formData.name && formData.type);
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
        const errorMessage = error instanceof Error ? error.message : '調味料の登録に失敗しました。入力内容を確認してください';
        setErrors(prev => ({
          ...prev,
          general: errorMessage
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
      <TextInput 
        id="name"
        name="name"
        label="調味料"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="調味料名を入力"
        maxLength={20}
        required={true}
        errorMessage={errors.name}
      />
      
      {/* Type field */}
      <SelectInput 
        id="type"
        name="type"
        label="調味料の種類"
        value={formData.type}
        onChange={handleChange}
        onBlur={handleBlur}
        options={SEASONING_TYPES}
        required={true}
        errorMessage={errors.type}
      />
      
      {/* Image field */}
      <FileInput 
        id="image"
        name="image"
        label="調味料の画像"
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        errorMessage={errors.image}
        helperText="JPEG または PNG 形式、5MB以下"
      />
      
      {/* Submit button */}
      <div className="pt-4">
        <SubmitButton 
          label="追加"
          loadingLabel="追加中..."
          isSubmitting={isSubmitting}
          disabled={!isFormValid}
        />
      </div>
    </form>
  );
};