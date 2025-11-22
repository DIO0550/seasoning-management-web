import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "page" | "limit" | "typeId" | "search";

/**
 * 調味料一覧APIのエラーコード
 */
export type SeasoningListErrorCode =
  | "VALIDATION_ERROR_PAGE_INVALID"
  | "VALIDATION_ERROR_PAGE_TOO_SMALL"
  | "VALIDATION_ERROR_LIMIT_INVALID"
  | "VALIDATION_ERROR_LIMIT_TOO_SMALL"
  | "VALIDATION_ERROR_LIMIT_TOO_LARGE"
  | "VALIDATION_ERROR_TYPE_ID_INVALID"
  | "VALIDATION_ERROR_SEARCH_INVALID"
  | "SEASONING_TYPE_NOT_FOUND"
  | "INTERNAL_ERROR";

/**
 * SeasoningListErrorCodeのコンパニオンオブジェクト
 */
export const SeasoningListErrorCode = {
  /**
   * ZodのバリデーションエラーからSeasoningListErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するSeasoningListErrorCode
   */
  fromValidationError: (zodError: ZodError): SeasoningListErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningListErrorCode.DEFAULT;
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
  TYPE_ID_INVALID: "VALIDATION_ERROR_TYPE_ID_INVALID" as const,
  SEARCH_INVALID: "VALIDATION_ERROR_SEARCH_INVALID" as const,
  SEASONING_TYPE_NOT_FOUND: "SEASONING_TYPE_NOT_FOUND" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * pageフィールドのZodエラーコードに対応する調味料一覧APIエラーコード
 */
const pageFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningListErrorCode.PAGE_INVALID;
    case "too_small":
      return SeasoningListErrorCode.PAGE_TOO_SMALL;
    default:
      return SeasoningListErrorCode.PAGE_INVALID;
  }
};

/**
 * limitフィールドのZodエラーコードに対応する調味料一覧APIエラーコード
 */
const limitFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningListErrorCode.LIMIT_INVALID;
    case "too_small":
      return SeasoningListErrorCode.LIMIT_TOO_SMALL;
    case "too_big":
      return SeasoningListErrorCode.LIMIT_TOO_LARGE;
    default:
      return SeasoningListErrorCode.LIMIT_INVALID;
  }
};

/**
 * seasoningTypeIdフィールドのZodエラーコードに対応する調味料一覧APIエラーコード
 */
const typeIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningListErrorCode.TYPE_ID_INVALID;
    default:
      return SeasoningListErrorCode.TYPE_ID_INVALID;
  }
};

/**
 * searchフィールドのZodエラーコードに対応する調味料一覧APIエラーコード
 */
const searchFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningListErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningListErrorCode.SEARCH_INVALID;
    default:
      return SeasoningListErrorCode.SEARCH_INVALID;
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
 * ZodIssueをSeasoningListErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): SeasoningListErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "page")) {
    return pageFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "limit")) {
    return limitFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "typeId")) {
    return typeIdFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "search")) {
    return searchFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return SeasoningListErrorCode.DEFAULT;
};
