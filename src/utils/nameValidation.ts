import { VALIDATION_CONSTANTS } from "../constants/validation";

/**
 * 調味料名バリデーションエラーの種類
 */
export type NameValidationError =
  | "REQUIRED"
  | "LENGTH_EXCEEDED"
  | "INVALID_FORMAT"
  | "NONE";

/**
 * 調味料名のバリデーション
 *
 * @param name - 検証する調味料名
 * @returns エラーの種類（エラーがない場合は"NONE"）
 */
export const validateSeasoningName = (name: string): NameValidationError => {
  if (!name) {
    return "REQUIRED";
  }

  if (name.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
    return "LENGTH_EXCEEDED";
  }

  if (!/^[a-zA-Z0-9]*$/.test(name)) {
    return "INVALID_FORMAT";
  }

  return "NONE";
};
