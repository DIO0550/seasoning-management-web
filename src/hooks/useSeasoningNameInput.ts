import { useState, ChangeEvent, FocusEvent } from "react";
import {
  validateSeasoningName,
  type NameValidationError,
} from "@/utils/nameValidation";
import { nameValidationErrorMessage } from "@/features/seasoning/utils/nameValidationMessage";
import type { ValidationErrorState } from "@/types/validationErrorState";
import { VALIDATION_ERROR_STATES } from "@/types/validationErrorState";

export interface UseSeasoningNameInputReturn {
  value: string;
  error: string;
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
  const [errorState, setErrorState] = useState<ValidationErrorState>(
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
    const newErrorState = convertValidationError(validationError);
    setErrorState(newErrorState);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    // ブラー時にフィールドをバリデーション
    const validationError = validateSeasoningName(currentValue);
    const newErrorState = convertValidationError(validationError);
    setErrorState(newErrorState);
  };

  // 値とエラーをクリアするリセット関数
  const reset = () => {
    setValue("");
    setErrorState(VALIDATION_ERROR_STATES.NONE);
  };

  // ValidationErrorStateから実際のバリデーションエラーを逆変換
  const getValidationErrorFromState = (state: ValidationErrorState): NameValidationError => {
    switch (state) {
      case VALIDATION_ERROR_STATES.REQUIRED:
        return "REQUIRED";
      case VALIDATION_ERROR_STATES.TOO_LONG:
        return "LENGTH_EXCEEDED";
      case VALIDATION_ERROR_STATES.INVALID_FORMAT:
        return "INVALID_FORMAT";
      case VALIDATION_ERROR_STATES.NONE:
      default:
        return "NONE";
    }
  };

  return {
    value,
    error: nameValidationErrorMessage(getValidationErrorFromState(errorState)),
    onChange,
    onBlur,
    reset,
  };
};
