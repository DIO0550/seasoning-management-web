import { useState } from "react";
import { VALIDATION_CONSTANTS } from "../constants/validation";

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
   * 画像ファイルのバリデーション
   *
   * @param file - 検証するファイル
   * @returns エラーメッセージ（エラーがない場合は空文字）
   */
  const validateImage = (file: File | null): string => {
    if (!file) return "";

    if (
      !(VALIDATION_CONSTANTS.IMAGE_VALID_TYPES as readonly string[]).includes(
        file.type
      )
    ) {
      return "JPEG、PNG 形式のファイルを選択してください";
    }

    if (file.size > VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES) {
      return `ファイルサイズは ${VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB}MB 以下にしてください`;
    }

    return "";
  };

  /**
   * ファイル変更時のハンドラー
   *
   * @param file - 設定するファイル
   */
  const onChange = (file: File | null) => {
    setValue(file);
    const validationError = validateImage(file);
    setError(validationError);
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
