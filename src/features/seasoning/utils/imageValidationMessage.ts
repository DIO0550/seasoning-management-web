import type { ImageValidationError } from "@/features/seasoning/../../utils/imageValidation";
import {
  VALIDATION_CONSTANTS,
  VALIDATION_ERROR_MESSAGES,
} from "@/features/seasoning/../../constants/validation";

/**
 * 画像バリデーションエラーのメッセージ表示
 * seasoning機能専用の表示ロジック
 */
export const imageValidationErrorMessage = (
  error: ImageValidationError
): string => {
  switch (error) {
    case "INVALID_TYPE":
      return VALIDATION_ERROR_MESSAGES.IMAGE.INVALID_TYPE;
    case "SIZE_EXCEEDED":
      return VALIDATION_ERROR_MESSAGES.IMAGE.SIZE_EXCEEDED(
        VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB
      );
    case "NONE":
      return "";
    default:
      return "";
  }
};
