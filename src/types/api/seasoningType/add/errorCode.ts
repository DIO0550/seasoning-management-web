import { ZodError, ZodIssue, ZodIssueCode } from "zod";

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
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningTypeAddErrorCode.DEFAULT;
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
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * nameフィールドのZodエラーコードに対応する調味料種類APIエラーコード
 */
const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningTypeAddErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return SeasoningTypeAddErrorCode.NAME_REQUIRED;
    case "too_big":
      return SeasoningTypeAddErrorCode.NAME_TOO_LONG;
    case "custom":
      return SeasoningTypeAddErrorCode.NAME_INVALID_FORMAT;
    default:
      return SeasoningTypeAddErrorCode.NAME_REQUIRED;
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
 * ZodIssueをSeasoningTypeAddErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): SeasoningTypeAddErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return SeasoningTypeAddErrorCode.DEFAULT;
};
