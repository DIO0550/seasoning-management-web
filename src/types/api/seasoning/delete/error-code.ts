import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "id";

/**
 * 調味料削除APIのエラーコード
 */
export type SeasoningDeleteErrorCode =
  | "VALIDATION_ERROR_ID_REQUIRED"
  | "VALIDATION_ERROR_ID_INVALID"
  | "SEASONING_NOT_FOUND"
  | "SEASONING_IN_USE"
  | "PERMISSION_DENIED"
  | "INTERNAL_ERROR";

/**
 * SeasoningDeleteErrorCodeのコンパニオンオブジェクト
 */
export const SeasoningDeleteErrorCode = {
  /**
   * ZodのバリデーションエラーからSeasoningDeleteErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するSeasoningDeleteErrorCode
   */
  fromValidationError: (zodError: ZodError): SeasoningDeleteErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningDeleteErrorCode.DEFAULT;
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
  SEASONING_NOT_FOUND: "SEASONING_NOT_FOUND" as const,
  SEASONING_IN_USE: "SEASONING_IN_USE" as const,
  PERMISSION_DENIED: "PERMISSION_DENIED" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * idフィールドのZodエラーコードに対応する調味料削除APIエラーコード
 */
const idFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningDeleteErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningDeleteErrorCode.ID_REQUIRED;
    default:
      return SeasoningDeleteErrorCode.ID_INVALID;
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
 * ZodIssueをSeasoningDeleteErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): SeasoningDeleteErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "id")) {
    return idFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return SeasoningDeleteErrorCode.DEFAULT;
};
