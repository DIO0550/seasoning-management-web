import { useState, ChangeEvent, FocusEvent } from "react";
import { validateType } from "../utils/typeValidation";
import { typeValidationErrorMessage } from "../features/seasoning/utils/typeValidationMessage";

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
  const [error, setError] = useState("");

  // 入力変更の処理
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 変更時にフィールドをバリデーション
    const validationError = validateType(newValue);
    const errorMessage = typeValidationErrorMessage(validationError);
    setError(errorMessage);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLSelectElement>) => {
    const currentValue = e.target.value;

    // ブラー時にフィールドをバリデーション
    const validationError = validateType(currentValue);
    const errorMessage = typeValidationErrorMessage(validationError);
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
