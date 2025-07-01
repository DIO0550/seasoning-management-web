import { useState, useEffect, useCallback } from "react";
import type { SubmitErrorState } from "../types/submitErrorState";
import type { ValidationErrorState } from "../types/validationErrorState";
import { SUBMIT_ERROR_STATES } from "../types/submitErrorState";
import { VALIDATION_ERROR_STATES } from "../types/validationErrorState";
import { UseSeasoningNameInputReturn } from "./useSeasoningNameInput";
import { UseSeasoningTypeInputReturn } from "./useSeasoningTypeInput";
import { validateImage } from "../utils/imageValidation";

export interface FormData {
  name: string;
  type: string;
  image: File | null;
}

export interface FormErrors {
  image: ValidationErrorState;
  general: SubmitErrorState;
}

export interface UseSeasoningSubmitReturn {
  submit: () => Promise<void>;
  isSubmitting: boolean;
  errors: FormErrors;
  isFormValid: boolean;
  setImageError: (error: ValidationErrorState) => void;
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
    image: VALIDATION_ERROR_STATES.NONE,
    general: SUBMIT_ERROR_STATES.NONE,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // 画像エラーを設定する関数
  const setImageError = (error: ValidationErrorState) => {
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
      image: VALIDATION_ERROR_STATES.NONE,
      general: SUBMIT_ERROR_STATES.NONE,
    });
  };

  // 送信エラーを処理する内部関数
  const handleSubmitError = (error: unknown) => {
    let errorType: SubmitErrorState = SUBMIT_ERROR_STATES.UNKNOWN_ERROR;

    if (error instanceof Error) {
      if (error.name === "NetworkError") {
        errorType = SUBMIT_ERROR_STATES.NETWORK_ERROR;
      } else if (error.name === "ValidationError") {
        errorType = SUBMIT_ERROR_STATES.VALIDATION_ERROR;
      } else if (error.message?.includes("Server Error")) {
        errorType = SUBMIT_ERROR_STATES.SERVER_ERROR;
      }
    }

    setErrors((prev) => ({
      ...prev,
      general: errorType,
    }));
  };

  // バリデーションエラーをチェックする内部関数
  const validateFormFields = (): { hasErrors: boolean; errors: FormErrors } => {
    const nameError = seasoningName.error;
    const typeError = seasoningType.error;
    const imageValidationResult = validateImage(formData.image);

    // 画像バリデーション結果をValidationErrorStateに変換
    let imageError: ValidationErrorState = VALIDATION_ERROR_STATES.NONE;
    if (imageValidationResult === "INVALID_TYPE") {
      imageError = VALIDATION_ERROR_STATES.INVALID_FILE_TYPE;
    } else if (imageValidationResult === "SIZE_EXCEEDED") {
      imageError = VALIDATION_ERROR_STATES.FILE_TOO_LARGE;
    }

    const errors: FormErrors = {
      image: imageError,
      general: SUBMIT_ERROR_STATES.NONE,
    };

    return {
      hasErrors: Boolean(
        nameError !== VALIDATION_ERROR_STATES.NONE ||
          typeError !== VALIDATION_ERROR_STATES.NONE ||
          imageError !== VALIDATION_ERROR_STATES.NONE
      ),
      errors,
    };
  };

  // フォーム有効性をチェックする内部関数
  const canSubmitForm = useCallback((): boolean => {
    const fields = [
      { value: seasoningName.value, error: seasoningName.error },
      { value: seasoningType.value, error: seasoningType.error },
    ];

    // すべてのフィールドが入力され、エラーがないかチェック
    const hasAllValues = fields.every((field) => field.value.trim() !== "");
    const hasNoErrors =
      fields.every((field) => field.error === VALIDATION_ERROR_STATES.NONE) &&
      errors.image === VALIDATION_ERROR_STATES.NONE &&
      errors.general === SUBMIT_ERROR_STATES.NONE;

    return hasAllValues && hasNoErrors;
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
