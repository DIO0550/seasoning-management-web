import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "name" | "description" | "seasoningIds";

/**
 * テンプレート追加APIのエラーコード
 */
export type TemplateAddErrorCode =
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "VALIDATION_ERROR_DESCRIPTION_TOO_LONG"
  | "VALIDATION_ERROR_SEASONING_IDS_REQUIRED"
  | "VALIDATION_ERROR_SEASONING_IDS_INVALID"
  | "VALIDATION_ERROR_SEASONING_IDS_EMPTY"
  | "DUPLICATE_NAME"
  | "SEASONING_NOT_FOUND"
  | "INTERNAL_ERROR";

/**
 * TemplateAddErrorCodeのコンパニオンオブジェクト
 */
export const TemplateAddErrorCode = {
  /**
   * ZodのバリデーションエラーからTemplateAddErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するTemplateAddErrorCode
   */
  fromValidationError: (zodError: ZodError): TemplateAddErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return TemplateAddErrorCode.DEFAULT;
    }

    // 変数のインライン化: 中間変数を削除して直接変換
    return issueToErrorCode(zodError.issues[0]);
  },

  /**
   * デフォルトエラーコード
   */
  DEFAULT: "VALIDATION_ERROR_NAME_REQUIRED" as const,

  // 公開エラーコード定数 - 外部でのエラーハンドリングやテストで使用
  NAME_REQUIRED: "VALIDATION_ERROR_NAME_REQUIRED" as const,
  NAME_TOO_LONG: "VALIDATION_ERROR_NAME_TOO_LONG" as const,
  NAME_INVALID_FORMAT: "VALIDATION_ERROR_NAME_INVALID_FORMAT" as const,
  DESCRIPTION_TOO_LONG: "VALIDATION_ERROR_DESCRIPTION_TOO_LONG" as const,
  SEASONING_IDS_REQUIRED: "VALIDATION_ERROR_SEASONING_IDS_REQUIRED" as const,
  SEASONING_IDS_INVALID: "VALIDATION_ERROR_SEASONING_IDS_INVALID" as const,
  SEASONING_IDS_EMPTY: "VALIDATION_ERROR_SEASONING_IDS_EMPTY" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  SEASONING_NOT_FOUND: "SEASONING_NOT_FOUND" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * nameフィールドのZodエラーコードに対応するテンプレートAPIエラーコード
 */
const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateAddErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return TemplateAddErrorCode.NAME_REQUIRED;
    case "too_big":
      return TemplateAddErrorCode.NAME_TOO_LONG;
    case "custom":
      return TemplateAddErrorCode.NAME_INVALID_FORMAT;
    default:
      return TemplateAddErrorCode.NAME_REQUIRED;
  }
};

/**
 * descriptionフィールドのZodエラーコードに対応するテンプレートAPIエラーコード
 */
const descriptionFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateAddErrorCode => {
  switch (zodErrorCode) {
    case "too_big":
      return TemplateAddErrorCode.DESCRIPTION_TOO_LONG;
    default:
      return TemplateAddErrorCode.DESCRIPTION_TOO_LONG;
  }
};

/**
 * seasoningIdsフィールドのZodエラーコードに対応するテンプレートAPIエラーコード
 */
const seasoningIdsFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateAddErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return TemplateAddErrorCode.SEASONING_IDS_INVALID;
    case "too_small":
      return TemplateAddErrorCode.SEASONING_IDS_EMPTY;
    default:
      return TemplateAddErrorCode.SEASONING_IDS_REQUIRED;
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
 * ZodIssueをTemplateAddErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): TemplateAddErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "description")) {
    return descriptionFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "seasoningIds")) {
    return seasoningIdsFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return TemplateAddErrorCode.DEFAULT;
};
