import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "page" | "limit" | "search";

/**
 * テンプレート一覧APIのエラーコード
 */
export type TemplateListErrorCode =
  | "VALIDATION_ERROR_PAGE_INVALID"
  | "VALIDATION_ERROR_PAGE_TOO_SMALL"
  | "VALIDATION_ERROR_LIMIT_INVALID"
  | "VALIDATION_ERROR_LIMIT_TOO_SMALL"
  | "VALIDATION_ERROR_LIMIT_TOO_LARGE"
  | "VALIDATION_ERROR_SEARCH_INVALID"
  | "INTERNAL_ERROR";

/**
 * TemplateListErrorCodeのコンパニオンオブジェクト
 */
export const TemplateListErrorCode = {
  /**
   * ZodのバリデーションエラーからTemplateListErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するTemplateListErrorCode
   */
  fromValidationError: (zodError: ZodError): TemplateListErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return TemplateListErrorCode.DEFAULT;
    }

    // 変数のインライン化: 中間変数を削除して直接変換
    return issueToErrorCode(zodError.issues[0]);
  },

  /**
   * デフォルトエラーコード
   */
  DEFAULT: "VALIDATION_ERROR_PAGE_INVALID" as const,

  // 公開エラーコード定数 - 外部でのエラーハンドリングやテストで使用
  PAGE_INVALID: "VALIDATION_ERROR_PAGE_INVALID" as const,
  PAGE_TOO_SMALL: "VALIDATION_ERROR_PAGE_TOO_SMALL" as const,
  LIMIT_INVALID: "VALIDATION_ERROR_LIMIT_INVALID" as const,
  LIMIT_TOO_SMALL: "VALIDATION_ERROR_LIMIT_TOO_SMALL" as const,
  LIMIT_TOO_LARGE: "VALIDATION_ERROR_LIMIT_TOO_LARGE" as const,
  SEARCH_INVALID: "VALIDATION_ERROR_SEARCH_INVALID" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * pageフィールドのZodエラーコードに対応するテンプレート一覧APIエラーコード
 */
const pageFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return TemplateListErrorCode.PAGE_INVALID;
    case "too_small":
      return TemplateListErrorCode.PAGE_TOO_SMALL;
    default:
      return TemplateListErrorCode.PAGE_INVALID;
  }
};

/**
 * limitフィールドのZodエラーコードに対応するテンプレート一覧APIエラーコード
 */
const limitFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return TemplateListErrorCode.LIMIT_INVALID;
    case "too_small":
      return TemplateListErrorCode.LIMIT_TOO_SMALL;
    case "too_big":
      return TemplateListErrorCode.LIMIT_TOO_LARGE;
    default:
      return TemplateListErrorCode.LIMIT_INVALID;
  }
};

/**
 * searchフィールドのZodエラーコードに対応するテンプレート一覧APIエラーコード
 */
const searchFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return TemplateListErrorCode.SEARCH_INVALID;
    default:
      return TemplateListErrorCode.SEARCH_INVALID;
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
 * ZodIssueをTemplateListErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): TemplateListErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "page")) {
    return pageFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "limit")) {
    return limitFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "search")) {
    return searchFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return TemplateListErrorCode.DEFAULT;
};
