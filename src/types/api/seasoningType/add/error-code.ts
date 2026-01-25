import { ZodError, ZodIssue } from "zod";

// フィールド名の型定義
type FieldName = "name";

/**
 * 調味料種類追加APIのエラーコード
 */
export type SeasoningTypeAddErrorCode =
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "DUPLICATE_NAME"
  | "INTERNAL_ERROR";

/**
 * SeasoningTypeAddErrorCodeのコンパニオンオブジェクト
 */
export const SeasoningTypeAddErrorCode = {
  /**
   * ZodのバリデーションエラーからSeasoningTypeAddErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するSeasoningTypeAddErrorCode
   */
  fromValidationError: (zodError: ZodError): SeasoningTypeAddErrorCode => {
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningTypeAddErrorCode.DEFAULT;
    }

    return issuesToErrorCode(zodError.issues);
  },

  /**
   * デフォルトエラーコード
   */
  DEFAULT: "VALIDATION_ERROR_NAME_REQUIRED" as const,

  // 公開エラーコード定数 - 外部でのエラーハンドリングやテストで使用
  NAME_REQUIRED: "VALIDATION_ERROR_NAME_REQUIRED" as const,
  NAME_TOO_LONG: "VALIDATION_ERROR_NAME_TOO_LONG" as const,
  NAME_INVALID_FORMAT: "VALIDATION_ERROR_NAME_INVALID_FORMAT" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * nameフィールドのZodエラーコードに対応する調味料種類APIエラーコード
 */
/**
 * フィールド名が指定されたFieldName型の値と一致するかチェック
 */
const isFieldName = (
  path: (string | number)[],
  fieldName: FieldName,
): boolean => {
  return path.includes(fieldName);
};

/**
 * ZodIssueをSeasoningTypeAddErrorCodeに変換
 */
const isRequiredIssue = (issue: ZodIssue): boolean =>
  isFieldName(issue.path, "name") && issue.code === "too_small";

const isTooLongIssue = (issue: ZodIssue): boolean =>
  isFieldName(issue.path, "name") && issue.code === "too_big";

const isInvalidFormatIssue = (issue: ZodIssue): boolean =>
  isFieldName(issue.path, "name") &&
  (issue.code === "invalid_type" || issue.code === "custom");

const issuesToErrorCode = (
  issues: readonly ZodIssue[],
): SeasoningTypeAddErrorCode => {
  if (issues.some(isRequiredIssue)) {
    return SeasoningTypeAddErrorCode.NAME_REQUIRED;
  }

  if (issues.some(isTooLongIssue)) {
    return SeasoningTypeAddErrorCode.NAME_TOO_LONG;
  }

  if (issues.some(isInvalidFormatIssue)) {
    return SeasoningTypeAddErrorCode.NAME_INVALID_FORMAT;
  }

  return SeasoningTypeAddErrorCode.DEFAULT;
};
