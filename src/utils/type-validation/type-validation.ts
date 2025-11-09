/**
 * タイプバリデーションエラーの種類
 */
export type TypeValidationError = "REQUIRED" | "NONE";

/**
 * 調味料タイプのバリデーション
 *
 * @param type - 検証するタイプ
 * @returns エラーの種類（エラーがない場合は"NONE"）
 */
export const validateType = (type: string): TypeValidationError => {
  if (!type || type.trim() === "") {
    return "REQUIRED";
  }
  return "NONE";
};
