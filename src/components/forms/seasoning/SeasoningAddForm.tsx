import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ErrorMessage } from '../../elements/errors/ErrorMessage';
import { TextInput } from '../../elements/inputs/TextInput';
import { SelectInput } from '../../elements/inputs/SelectInput';
import { FileInput } from '../../elements/inputs/FileInput';
import { SubmitButton } from '../../elements/buttons/SubmitButton';
import { useSeasoningNameInput } from '../../../hooks/useSeasoningNameInput';

// 調味料の種類を定義 - 通常はAPIから取得する
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
  type: string;
  image: string;
  general: string;
}

export const SeasoningAddForm = ({ onSubmit }: SeasoningAddFormProps): React.JSX.Element => {
  // 調味料名入力用のカスタムフックを使用
  const seasoningName = useSeasoningNameInput();

  // フォームデータの状態（名前はフックで処理されるため除外）
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    image: null,
  });

  // フォームエラーの状態（名前はフックで処理されるため除外）
  const [errors, setErrors] = useState<FormErrors>({
    type: '',
    image: '',
    general: '',
  });

  // フォーム送信状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // フォームデータ、エラー、名前の状態が変更された時にフォームの有効性を更新
  useEffect(() => {
    // 必須フィールドが入力され、エラーがない場合にフォームが有効
    const requiredFieldsValid = Boolean(seasoningName.value && formData.type);
    const noErrors = !seasoningName.error && !errors.type && !errors.image && !errors.general;
    
    setIsFormValid(requiredFieldsValid && noErrors);
  }, [seasoningName.value, seasoningName.error, formData, errors]);

  // 種類フィールドのバリデーション
  const validateType = (type: string): string => {
    if (!type) {
      return '調味料の種類を選択してください';
    }
    return '';
  };

  // 画像フィールドのバリデーション
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

  // 入力変更の処理（名前はフックで処理されるため除外）
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 必須フィールドの場合はフィールドをバリデーション
    let validationError = '';
    if (name === 'type') {
      validationError = validateType(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  // ファイル入力変更の処理
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

  // バリデーションのためのブラーイベントの処理（名前はフックで処理されるため除外）
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 必須フィールドの場合はフィールドをバリデーション
    let validationError = '';
    if (name === 'type') {
      validationError = validateType(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  // フォーム送信の処理
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 送信前にすべてのフィールドをバリデーション
    const nameError = seasoningName.error;
    const typeError = validateType(formData.type);
    const imageError = validateImage(formData.image);
    
    const newErrors = {
      type: typeError,
      image: imageError,
      general: ''
    };
    
    setErrors(newErrors);
    
    // バリデーションエラーがあるかチェック
    if (nameError || typeError || imageError) {
      return;
    }
    
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        // フックから名前を含むフォームデータオブジェクトを作成
        const submitData = {
          name: seasoningName.value,
          type: formData.type,
          image: formData.image
        };
        await onSubmit(submitData);
        // 送信成功後にフォームをリセット
        seasoningName.reset();
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
      {/* 全般的なエラーメッセージ */}
      {errors.general && <ErrorMessage message={errors.general} />}
      
      {/* 名前フィールド */}
      <TextInput 
        id="name"
        name="name"
        label="調味料"
        value={seasoningName.value}
        onChange={seasoningName.onChange}
        onBlur={seasoningName.onBlur}
        placeholder="調味料名を入力"
        maxLength={20}
        required={true}
        errorMessage={seasoningName.error}
      />
      
      {/* 種類フィールド */}
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
      
      {/* 画像フィールド */}
      <FileInput 
        id="image"
        name="image"
        label="調味料の画像"
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        errorMessage={errors.image}
        helperText="JPEG または PNG 形式、5MB以下"
      />
      
      {/* 送信ボタン */}
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