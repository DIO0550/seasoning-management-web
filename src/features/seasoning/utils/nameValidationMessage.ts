import type { NameValidationError } from "@/utils/nameValidation";
import {
  VALIDATION_CONSTANTS,
  VALIDATION_ERROR_MESSAGES,
} from "@/features/seasoning/../../constants/validation";

/**
 * 調味料名バリデーションエラーのメッセージ表示
 * seasoning機能専用の表示ロジック
 */
export const nameValidationErrorMessage = (
  error: NameValidationError
): string => {
  switch (error) {
    case "REQUIRED":
      return VALIDATION_ERROR_MESSAGES.NAME.REQUIRED;
    case "LENGTH_EXCEEDED":
      return VALIDATION_ERROR_MESSAGES.NAME.LENGTH_EXCEEDED(
        VALIDATION_CONSTANTS.NAME_MAX_LENGTH
      );
    case "INVALID_FORMAT":
      return VALIDATION_ERROR_MESSAGES.NAME.INVALID_FORMAT;
    case "NONE":
      return "";
    default:
      return "";
  }
};
