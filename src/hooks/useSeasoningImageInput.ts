import { useState } from "react";
import {
  validateImage,
  type ImageValidationError,
} from "@/utils/imageValidation";
import type { ValidationErrorState } from "@/types/validationErrorState";
import { VALIDATION_ERROR_STATES } from "@/types/validationErrorState";

export interface UseSeasoningImageInputReturn {
  value: File | null;
  error: ValidationErrorState;
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
  const [error, setError] = useState<ValidationErrorState>(
    VALIDATION_ERROR_STATES.NONE
  );

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
    const errorState = convertValidationError(validationError);
    setError(errorState);
  };

  /**
   * 値とエラーをリセット
   */
  const reset = () => {
    setValue(null);
    setError(VALIDATION_ERROR_STATES.NONE);
  };

  return {
    value,
    error,
    onChange,
    reset,
    setError,
  };
};
