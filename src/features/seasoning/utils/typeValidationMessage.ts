import type { TypeValidationError } from "../../../utils/typeValidation";

/**
 * タイプバリデーションエラーのメッセージ表示
 * seasoning機能専用の表示ロジック
 */
export const typeValidationErrorMessage = (
  error: TypeValidationError
): string => {
  switch (error) {
    case "REQUIRED":
      return "調味料の種類を選択してください";
    case "NONE":
      return "";
    default:
      return "";
  }
};
