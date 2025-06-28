import { useState } from "react";
import { validateImage } from "../utils/imageValidation";
import { imageValidationErrorMessage } from "../features/seasoning/utils/imageValidationMessage";

export interface UseSeasoningImageInputReturn {
  value: File | null;
  error: string;
  onChange: (file: File | null) => void;
  reset: () => void;
  setError: (error: string) => void;
}

/**
 * 調味料画像入力フィールドを管理するカスタムフック
 * バリデーション、状態管理、エラーハンドリングを処理する
 */
export const useSeasoningImageInput = (): UseSeasoningImageInputReturn => {
  const [value, setValue] = useState<File | null>(null);
  const [error, setError] = useState("");

  /**
   * ファイル変更時のハンドラー
   *
   * @param file - 設定するファイル
   */
  const onChange = (file: File | null) => {
    setValue(file);
    const validationError = validateImage(file);
    const errorMessage = imageValidationErrorMessage(validationError);
    setError(errorMessage);
  };

  /**
   * 値とエラーをリセット
   */
  const reset = () => {
    setValue(null);
    setError("");
  };

  return {
    value,
    error,
    onChange,
    reset,
    setError,
  };
};
