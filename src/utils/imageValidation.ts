import { VALIDATION_CONSTANTS } from "../constants/validation";

/**
 * 画像バリデーションエラーの種類
 */
export type ImageValidationError = "INVALID_TYPE" | "SIZE_EXCEEDED" | "NONE"; // エラーなしを明示的に表現

/**
 * 画像ファイル形式が有効かどうかを判定
 */
export const isValidImageType = (file: File): boolean => {
  return VALIDATION_CONSTANTS.IMAGE_VALID_TYPES.includes(
    file.type as (typeof VALIDATION_CONSTANTS.IMAGE_VALID_TYPES)[number]
  );
};

/**
 * 画像ファイルサイズが有効かどうかを判定
 */
export const isValidImageSize = (file: File): boolean => {
  return file.size <= VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES;
};

/**
 * 画像ファイルのバリデーション
 *
 * @param file - 検証するファイル
 * @returns エラーの種類（エラーがない場合は"NONE"）
 */
export const validateImage = (file: File | null): ImageValidationError => {
  if (!file) return "NONE";

  if (!isValidImageType(file)) {
    return "INVALID_TYPE";
  }

  if (!isValidImageSize(file)) {
    return "SIZE_EXCEEDED";
  }

  return "NONE";
};
