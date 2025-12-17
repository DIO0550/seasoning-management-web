import { useState } from "react";
import {
  validateImage,
  type ImageValidationError,
} from "@/utils/image-validation/image-validation";
import { imageValidationErrorMessage } from "@/features/seasoning/utils";
import type { ValidationErrorState } from "@/types/validation-error-state";
import { VALIDATION_ERROR_STATES } from "@/types/validation-error-state";

export interface UseSeasoningImageInputReturn {
  value: File | null;
  error: string;
  onChange: (file: File | null) => void;
  reset: () => void;
  setError: (error: ValidationErrorState) => void;
}

/**
 * 調味料画像入力フィールドを管理するカスタムフック
 * バリデーション、状態管理、エラーハンドリングを処理する
 */
export const useSeasoningImageInput = (): UseSeasoningImageInputReturn => {
  const [value, setValue] = useState<File | null>(null);
  const [errorState, setErrorState] = useState<ValidationErrorState>(
    VALIDATION_ERROR_STATES.NONE
  );

  // ValidationErrorStateから実際のバリデーションエラーを逆変換
  const getValidationErrorFromState = (
    state: ValidationErrorState
  ): ImageValidationError => {
    switch (state) {
      case VALIDATION_ERROR_STATES.INVALID_FILE_TYPE:
        return "INVALID_TYPE";
      case VALIDATION_ERROR_STATES.FILE_TOO_LARGE:
        return "SIZE_EXCEEDED";
      case VALIDATION_ERROR_STATES.NONE:
      default:
        return "NONE";
    }
  };

  // バリデーション結果をValidationErrorStateに変換
  const convertValidationError = (
    validationError: ImageValidationError
  ): ValidationErrorState => {
    switch (validationError) {
      case "INVALID_TYPE":
        return VALIDATION_ERROR_STATES.INVALID_FILE_TYPE;
      case "SIZE_EXCEEDED":
        return VALIDATION_ERROR_STATES.FILE_TOO_LARGE;
      case "NONE":
      default:
        return VALIDATION_ERROR_STATES.NONE;
    }
  };

  /**
   * ファイル変更時のハンドラー
   *
   * @param file - 設定するファイル
   */
  const onChange = (file: File | null) => {
    setValue(file);
    const validationError = validateImage(file);
    const newErrorState = convertValidationError(validationError);
    setErrorState(newErrorState);
  };

  /**
   * 値とエラーをリセット
   */
  const reset = () => {
    setValue(null);
    setErrorState(VALIDATION_ERROR_STATES.NONE);
  };

  /**
   * エラー状態を設定
   * @param error - 設定するエラー状態
   */
  const setError = (error: ValidationErrorState) => {
    setErrorState(error);
  };

  return {
    value,
    error: imageValidationErrorMessage(getValidationErrorFromState(errorState)),
    onChange,
    reset,
    setError,
  };
};
