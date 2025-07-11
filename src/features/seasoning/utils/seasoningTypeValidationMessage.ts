import type { ValidationErrorState } from "@/features/seasoning/../../types/validationErrorState";
import type { SubmitErrorState } from "@/features/seasoning/../../types/submitErrorState";

/**
 * 調味料の種類追加時のバリデーションエラーメッセージを取得
 *
 * @param error - バリデーションエラー状態
 * @returns エラーメッセージ文字列
 */
export const getSeasoningTypeValidationMessage = (
  error: ValidationErrorState
): string => {
  switch (error) {
    case "REQUIRED":
      return "調味料の種類名は必須です";
    case "TOO_LONG":
      return "調味料の種類名は50文字以内で入力してください";
    case "NONE":
    default:
      return "";
  }
};

/**
 * 調味料の種類追加時の送信エラーメッセージを取得
 *
 * @param error - 送信エラー状態
 * @returns エラーメッセージ文字列
 */
export const getSeasoningTypeSubmitMessage = (
  error: SubmitErrorState
): string => {
  switch (error) {
    case "NETWORK_ERROR":
      return "通信エラーが発生しました。しばらくしてから再度お試しください";
    case "VALIDATION_ERROR":
      return "入力内容を確認してください";
    case "SERVER_ERROR":
      return "システムエラーが発生しました。管理者にお問い合わせください";
    case "UNKNOWN_ERROR":
      return "調味料の種類の追加に失敗しました";
    case "NONE":
    default:
      return "";
  }
};
