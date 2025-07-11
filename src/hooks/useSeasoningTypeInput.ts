import { useState, ChangeEvent, FocusEvent } from "react";
import {
  validateType,
  type TypeValidationError,
} from "@/utils/typeValidation";
import type { ValidationErrorState } from "@/types/validationErrorState";
import { VALIDATION_ERROR_STATES } from "@/types/validationErrorState";

export interface UseSeasoningTypeInputReturn {
  value: string;
  error: ValidationErrorState;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: FocusEvent<HTMLSelectElement>) => void;
  reset: () => void;
}

/**
 * 調味料の種類選択フィールドを管理するカスタムフック
 * バリデーション、状態管理、イベントハンドラーを処理する
 */
export const useSeasoningTypeInput = (): UseSeasoningTypeInputReturn => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<ValidationErrorState>(
    VALIDATION_ERROR_STATES.NONE
  );

  // バリデーション結果をValidationErrorStateに変換
  const convertValidationError = (
    validationError: TypeValidationError
  ): ValidationErrorState => {
    switch (validationError) {
      case "REQUIRED":
        return VALIDATION_ERROR_STATES.REQUIRED;
      case "NONE":
      default:
        return VALIDATION_ERROR_STATES.NONE;
    }
  };

  // 入力変更の処理
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 変更時にフィールドをバリデーション
    const validationError = validateType(newValue);
    const errorState = convertValidationError(validationError);
    setError(errorState);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLSelectElement>) => {
    const currentValue = e.target.value;

    // ブラー時にフィールドをバリデーション
    const validationError = validateType(currentValue);
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
