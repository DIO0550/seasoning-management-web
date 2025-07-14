import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "id" | "name";

/**
 * 調味料種類更新APIのエラーコード
 */
export type SeasoningTypeUpdateErrorCode =
  | "VALIDATION_ERROR_ID_REQUIRED"
  | "VALIDATION_ERROR_ID_INVALID"
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "SEASONING_TYPE_NOT_FOUND"
  | "DUPLICATE_NAME"
  | "SEASONING_TYPE_IN_USE"
  | "PERMISSION_DENIED"
  | "INTERNAL_ERROR";

/**
 * SeasoningTypeUpdateErrorCodeのコンパニオンオブジェクト
 */
export const SeasoningTypeUpdateErrorCode = {
  /**
   * ZodのバリデーションエラーからSeasoningTypeUpdateErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するSeasoningTypeUpdateErrorCode
   */
  fromValidationError: (zodError: ZodError): SeasoningTypeUpdateErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningTypeUpdateErrorCode.DEFAULT;
    }

    // 変数のインライン化: 中間変数を削除して直接変換
    return issueToErrorCode(zodError.issues[0]);
  },

  /**
   * デフォルトエラーコード
   */
  DEFAULT: "VALIDATION_ERROR_ID_REQUIRED" as const,

  // 公開エラーコード定数 - 外部でのエラーハンドリングやテストで使用
  ID_REQUIRED: "VALIDATION_ERROR_ID_REQUIRED" as const,
  ID_INVALID: "VALIDATION_ERROR_ID_INVALID" as const,
  NAME_REQUIRED: "VALIDATION_ERROR_NAME_REQUIRED" as const,
  NAME_TOO_LONG: "VALIDATION_ERROR_NAME_TOO_LONG" as const,
  NAME_INVALID_FORMAT: "VALIDATION_ERROR_NAME_INVALID_FORMAT" as const,
  SEASONING_TYPE_NOT_FOUND: "SEASONING_TYPE_NOT_FOUND" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  SEASONING_TYPE_IN_USE: "SEASONING_TYPE_IN_USE" as const,
  PERMISSION_DENIED: "PERMISSION_DENIED" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * idフィールドのZodエラーコードに対応する調味料種類更新APIエラーコード
 */
const idFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningTypeUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningTypeUpdateErrorCode.ID_REQUIRED;
    default:
      return SeasoningTypeUpdateErrorCode.ID_INVALID;
  }
};

/**
 * nameフィールドのZodエラーコードに対応する調味料種類更新APIエラーコード
 */
const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningTypeUpdateErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return SeasoningTypeUpdateErrorCode.NAME_REQUIRED;
    case "too_big":
      return SeasoningTypeUpdateErrorCode.NAME_TOO_LONG;
    case "custom":
      return SeasoningTypeUpdateErrorCode.NAME_INVALID_FORMAT;
    default:
      return SeasoningTypeUpdateErrorCode.NAME_REQUIRED;
  }
};

/**
 * フィールド名が指定されたFieldName型の値と一致するかチェック
 */
const isFieldName = (
  path: (string | number)[],
  fieldName: FieldName
): boolean => {
  return path.includes(fieldName);
};

/**
 * ZodIssueをSeasoningTypeUpdateErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): SeasoningTypeUpdateErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "id")) {
    return idFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return SeasoningTypeUpdateErrorCode.DEFAULT;
};
