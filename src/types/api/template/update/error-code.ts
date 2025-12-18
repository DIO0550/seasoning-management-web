import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "id" | "name" | "description" | "seasoningIds";

/**
 * テンプレート更新APIのエラーコード
 */
export type TemplateUpdateErrorCode =
  | "VALIDATION_ERROR_ID_REQUIRED"
  | "VALIDATION_ERROR_ID_INVALID"
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "VALIDATION_ERROR_DESCRIPTION_TOO_LONG"
  | "VALIDATION_ERROR_SEASONING_IDS_REQUIRED"
  | "VALIDATION_ERROR_SEASONING_IDS_INVALID"
  | "VALIDATION_ERROR_SEASONING_IDS_EMPTY"
  | "TEMPLATE_NOT_FOUND"
  | "DUPLICATE_NAME"
  | "SEASONING_NOT_FOUND"
  | "PERMISSION_DENIED"
  | "INTERNAL_ERROR";

/**
 * TemplateUpdateErrorCodeのコンパニオンオブジェクト
 */
export const TemplateUpdateErrorCode = {
  /**
   * ZodのバリデーションエラーからTemplateUpdateErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するTemplateUpdateErrorCode
   */
  fromValidationError: (zodError: ZodError): TemplateUpdateErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return TemplateUpdateErrorCode.DEFAULT;
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
  DESCRIPTION_TOO_LONG: "VALIDATION_ERROR_DESCRIPTION_TOO_LONG" as const,
  SEASONING_IDS_REQUIRED: "VALIDATION_ERROR_SEASONING_IDS_REQUIRED" as const,
  SEASONING_IDS_INVALID: "VALIDATION_ERROR_SEASONING_IDS_INVALID" as const,
  SEASONING_IDS_EMPTY: "VALIDATION_ERROR_SEASONING_IDS_EMPTY" as const,
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  SEASONING_NOT_FOUND: "SEASONING_NOT_FOUND" as const,
  PERMISSION_DENIED: "PERMISSION_DENIED" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * idフィールドのZodエラーコードに対応するテンプレート更新APIエラーコード
 */
const idFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return TemplateUpdateErrorCode.ID_REQUIRED;
    default:
      return TemplateUpdateErrorCode.ID_INVALID;
  }
};

/**
 * nameフィールドのZodエラーコードに対応するテンプレート更新APIエラーコード
 */
const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateUpdateErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return TemplateUpdateErrorCode.NAME_REQUIRED;
    case "too_big":
      return TemplateUpdateErrorCode.NAME_TOO_LONG;
    case "custom":
      return TemplateUpdateErrorCode.NAME_INVALID_FORMAT;
    default:
      return TemplateUpdateErrorCode.NAME_REQUIRED;
  }
};

/**
 * descriptionフィールドのZodエラーコードに対応するテンプレート更新APIエラーコード
 */
const descriptionFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateUpdateErrorCode => {
  switch (zodErrorCode) {
    case "too_big":
      return TemplateUpdateErrorCode.DESCRIPTION_TOO_LONG;
    default:
      return TemplateUpdateErrorCode.DESCRIPTION_TOO_LONG;
  }
};

/**
 * seasoningIdsフィールドのZodエラーコードに対応するテンプレート更新APIエラーコード
 */
const seasoningIdsFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return TemplateUpdateErrorCode.SEASONING_IDS_INVALID;
    case "too_small":
      return TemplateUpdateErrorCode.SEASONING_IDS_EMPTY;
    default:
      return TemplateUpdateErrorCode.SEASONING_IDS_REQUIRED;
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
 * ZodIssueをTemplateUpdateErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): TemplateUpdateErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "id")) {
    return idFieldErrorCode(issue.code);
  }

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
  return TemplateUpdateErrorCode.DEFAULT;
};
