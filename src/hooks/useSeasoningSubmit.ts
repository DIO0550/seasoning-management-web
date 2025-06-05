import { useState, useEffect } from 'react';
import { UseSeasoningNameInputReturn } from './useSeasoningNameInput';
import { UseSeasoningTypeInputReturn } from './useSeasoningTypeInput';

export interface FormData {
  name: string;
  type: string;
  image: File | null;
}

export interface FormErrors {
  image: string;
  general: string;
}

export interface UseSeasoningSubmitReturn {
  submit: () => Promise<void>;
  isSubmitting: boolean;
  errors: FormErrors;
  isFormValid: boolean;
  setImageError: (error: string) => void;
}

/**
 * 調味料フォーム送信を管理するカスタムフック
 * バリデーション、送信処理、エラー処理を行う
 */
export const useSeasoningSubmit = (
  seasoningName: UseSeasoningNameInputReturn,
  seasoningType: UseSeasoningTypeInputReturn,
  formData: { image: File | null },
  onSubmit?: (data: FormData) => Promise<void>,
  onReset?: () => void
): UseSeasoningSubmitReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    image: '',
    general: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

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

  // 画像エラーを設定する関数
  const setImageError = (error: string) => {
    setErrors(prev => ({
      ...prev,
      image: error
    }));
  };

  // フォームの有効性を計算
  useEffect(() => {
    const requiredFieldsValid = Boolean(seasoningName.value && seasoningType.value);
    const noErrors = !seasoningName.error && !seasoningType.error && !errors.image && !errors.general;
    setIsFormValid(requiredFieldsValid && noErrors);
  }, [seasoningName.value, seasoningName.error, seasoningType.value, seasoningType.error, errors]);

  // フォーム送信の処理
  const submit = async (): Promise<void> => {
    // 送信前にすべてのフィールドをバリデーション
    const nameError = seasoningName.error;
    const typeError = seasoningType.error;
    const imageError = validateImage(formData.image);
    
    const newErrors = {
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
        // フックから名前と種類を含むフォームデータオブジェクトを作成
        const submitData = {
          name: seasoningName.value,
          type: seasoningType.value,
          image: formData.image
        };
        await onSubmit(submitData);
        // 送信成功後にフォームをリセット
        seasoningName.reset();
        seasoningType.reset();
        onReset?.();
        setErrors({
          image: '',
          general: '',
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

  return {
    submit,
    isSubmitting,
    errors,
    isFormValid,
    setImageError,
  };
};