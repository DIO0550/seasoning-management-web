import { useState, ChangeEvent, FocusEvent } from "react";
import { validateType, type TypeValidationError } from "@/utils/typeValidation";
import { typeValidationErrorMessage } from "@/features/seasoning/utils/typeValidationMessage";
import type { ValidationErrorState } from "@/types/validationErrorState";
import { VALIDATION_ERROR_STATES } from "@/types/validationErrorState";

export interface UseSeasoningTypeInputReturn {
  value: string;
  error: string;
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
  const [errorState, setErrorState] = useState<ValidationErrorState>(
    VALIDATION_ERROR_STATES.NONE
  );

  // ValidationErrorStateから実際のバリデーションエラーを逆変換
  const getValidationErrorFromState = (state: ValidationErrorState): TypeValidationError => {
    switch (state) {
      case VALIDATION_ERROR_STATES.REQUIRED:
        return "REQUIRED";
      case VALIDATION_ERROR_STATES.NONE:
      default:
        return "NONE";
    }
  };

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
    const newErrorState = convertValidationError(validationError);
    setErrorState(newErrorState);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLSelectElement>) => {
    const currentValue = e.target.value;

    // ブラー時にフィールドをバリデーション
    const validationError = validateType(currentValue);
    const newErrorState = convertValidationError(validationError);
    setErrorState(newErrorState);
  };

  // 値とエラーをクリアするリセット関数
  const reset = () => {
    setValue("");
    setErrorState(VALIDATION_ERROR_STATES.NONE);
  };

  return {
    value,
    error: typeValidationErrorMessage(getValidationErrorFromState(errorState)),
    onChange,
    onBlur,
    reset,
  };
};
