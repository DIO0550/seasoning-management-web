import { useState, useEffect, useCallback } from "react";
import { UseSeasoningNameInputReturn } from "./useSeasoningNameInput";
import { UseSeasoningTypeInputReturn } from "./useSeasoningTypeInput";
import { validateImage } from "../utils/imageValidation";
import { imageValidationErrorMessage } from "../features/seasoning/utils/imageValidationMessage";
import { VALIDATION_ERROR_MESSAGES } from "../constants/validation";
import { canSubmit } from "../utils/formValidation";

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
    image: "",
    general: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // 画像エラーを設定する関数
  const setImageError = (error: string) => {
    setErrors((prev) => ({
      ...prev,
      image: error,
    }));
  };

  // フォーム状態をリセットする内部関数
  const resetFormState = () => {
    seasoningName.reset();
    seasoningType.reset();
    onReset?.();
    setErrors({
      image: "",
      general: "",
    });
  };

  // 送信エラーを処理する内部関数
  const handleSubmitError = (error: unknown) => {
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : VALIDATION_ERROR_MESSAGES.SEASONING.SUBMIT_ERROR;
    setErrors((prev) => ({
      ...prev,
      general: errorMessage,
    }));
  };

  // バリデーションエラーをチェックする内部関数
  const validateFormFields = (): { hasErrors: boolean; errors: FormErrors } => {
    const nameError = seasoningName.error;
    const typeError = seasoningType.error;
    const imageValidationResult = validateImage(formData.image);
    const imageError = imageValidationErrorMessage(imageValidationResult);

    const errors = {
      image: imageError,
      general: "",
    };

    return {
      hasErrors: Boolean(nameError || typeError || imageError),
      errors,
    };
  };

  // フォーム有効性をチェックする内部関数
  const canSubmitForm = useCallback((): boolean => {
    const fields = [
      { value: seasoningName.value, error: seasoningName.error },
      { value: seasoningType.value, error: seasoningType.error },
    ];

    return canSubmit(fields, errors);
  }, [
    seasoningName.value,
    seasoningName.error,
    seasoningType.value,
    seasoningType.error,
    errors,
  ]);

  // フォームの有効性を計算
  useEffect(() => {
    setIsFormValid(canSubmitForm());
  }, [canSubmitForm]);

  // フォーム送信の処理
  const submit = async (): Promise<void> => {
    // 送信前にすべてのフィールドをバリデーション
    const { hasErrors, errors: validationErrors } = validateFormFields();

    setErrors(validationErrors);

    // バリデーションエラーがあるかチェック
    if (hasErrors) {
      return;
    }

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        // フックから名前と種類を含むフォームデータオブジェクトを作成
        const submitData = {
          name: seasoningName.value,
          type: seasoningType.value,
          image: formData.image,
        };
        await onSubmit(submitData);
        // 送信成功後にフォームをリセット
        resetFormState();
      } catch (error) {
        handleSubmitError(error);
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
