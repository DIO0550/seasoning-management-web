import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

/**
 * 調味料の種類名バリデーションエラーの種類
 */
export type SeasoningTypeNameValidationError =
  | "REQUIRED"
  | "LENGTH_EXCEEDED"
  | "NONE";

/**
 * 調味料の種類名のバリデーション
 *
 * @param name - 検証する調味料の種類名
 * @returns エラーの種類（エラーがない場合は"NONE"）
 */
export const validateSeasoningTypeName = (
  name: string
): SeasoningTypeNameValidationError => {
  if (!name || name.trim() === "") {
    return "REQUIRED";
  }

  if (name.trim().length > SEASONING_TYPE_NAME_MAX_LENGTH) {
    return "LENGTH_EXCEEDED";
  }

  return "NONE";
};
