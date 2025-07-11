import { useState, ChangeEvent, FocusEvent } from "react";
import {
  validateSeasoningName,
  type NameValidationError,
} from "@/utils/nameValidation";
import type { ValidationErrorState } from "@/types/validationErrorState";
import { VALIDATION_ERROR_STATES } from "@/types/validationErrorState";

export interface UseSeasoningNameInputReturn {
  value: string;
  error: ValidationErrorState;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  reset: () => void;
}

/**
 * 調味料名入力フィールドを管理するカスタムフック
 * バリデーション、状態管理、イベントハンドラーを処理する
 */
export const useSeasoningNameInput = (): UseSeasoningNameInputReturn => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<ValidationErrorState>(
    VALIDATION_ERROR_STATES.NONE
  );

  // バリデーション結果をValidationErrorStateに変換
  const convertValidationError = (
    validationError: NameValidationError
  ): ValidationErrorState => {
    switch (validationError) {
      case "REQUIRED":
        return VALIDATION_ERROR_STATES.REQUIRED;
      case "LENGTH_EXCEEDED":
        return VALIDATION_ERROR_STATES.TOO_LONG;
      case "INVALID_FORMAT":
        return VALIDATION_ERROR_STATES.INVALID_FORMAT;
      case "NONE":
      default:
        return VALIDATION_ERROR_STATES.NONE;
    }
  };

  // 入力変更の処理
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 変更時にフィールドをバリデーション
    const validationError = validateSeasoningName(newValue);
    const errorState = convertValidationError(validationError);
    setError(errorState);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    // ブラー時にフィールドをバリデーション
    const validationError = validateSeasoningName(currentValue);
    const errorState = convertValidationError(validationError);
    setError(errorState);
  };

  // 値とエラーをクリアするリセット関数
  const reset = () => {
    setValue("");
    setError(VALIDATION_ERROR_STATES.NONE);
  };

  return {
    value,
    error,
    onChange,
    onBlur,
    reset,
  };
};
