import { useState, ChangeEvent, FocusEvent } from "react";
import { validateSeasoningName } from "../utils/nameValidation";
import { nameValidationErrorMessage } from "../features/seasoning/utils/nameValidationMessage";

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
  const [error, setError] = useState("");

  // 入力変更の処理
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 変更時にフィールドをバリデーション
    const validationError = validateSeasoningName(newValue);
    const errorMessage = nameValidationErrorMessage(validationError);
    setError(errorMessage);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    // ブラー時にフィールドをバリデーション
    const validationError = validateSeasoningName(currentValue);
    const errorMessage = nameValidationErrorMessage(validationError);
    setError(errorMessage);
  };

  // 値とエラーをクリアするリセット関数
  const reset = () => {
    setValue("");
    setError("");
  };

  return {
    value,
    error,
    onChange,
    onBlur,
    reset,
  };
};
