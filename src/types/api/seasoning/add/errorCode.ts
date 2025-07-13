import { ZodError } from "zod";

// Zodエラーコードの型定義
type ZodErrorCode = "too_small" | "too_big" | "custom" | "invalid_type";

// フィールド名の型定義
type FieldName = "name" | "seasoningTypeId" | "image";

/**
 * 調味料追加APIのエラーコード
 */
export type SeasoningAddErrorCode =
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "VALIDATION_ERROR_TYPE_REQUIRED"
  | "VALIDATION_ERROR_IMAGE_INVALID_TYPE"
  | "VALIDATION_ERROR_IMAGE_TOO_LARGE"
  | "DUPLICATE_NAME"
  | "INTERNAL_ERROR";

/**
 * SeasoningAddErrorCodeのコンパニオンオブジェクト
 */
export const SeasoningAddErrorCode = {
  /**
   * ZodのバリデーションエラーからSeasoningAddErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するSeasoningAddErrorCode
   */
  fromValidationError: (zodError: ZodError): SeasoningAddErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningAddErrorCode.DEFAULT;
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
  TYPE_REQUIRED: "VALIDATION_ERROR_TYPE_REQUIRED" as const,
  IMAGE_INVALID_TYPE: "VALIDATION_ERROR_IMAGE_INVALID_TYPE" as const,
  IMAGE_TOO_LARGE: "VALIDATION_ERROR_IMAGE_TOO_LARGE" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * nameフィールドのZodエラーコードに対応する調味料APIエラーコード
 */
const nameFieldErrorCode = (
  zodErrorCode: ZodErrorCode
): SeasoningAddErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return SeasoningAddErrorCode.NAME_REQUIRED;
    case "too_big":
      return SeasoningAddErrorCode.NAME_TOO_LONG;
    case "custom":
      return SeasoningAddErrorCode.NAME_INVALID_FORMAT;
    default:
      return SeasoningAddErrorCode.NAME_REQUIRED;
  }
};

/**
 * seasoningTypeIdフィールドのZodエラーコードに対応する調味料APIエラーコード
 */
const seasoningTypeIdFieldErrorCode = (
  zodErrorCode: ZodErrorCode
): SeasoningAddErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningAddErrorCode.TYPE_REQUIRED;
    default:
      return SeasoningAddErrorCode.TYPE_REQUIRED;
  }
};

/**
 * imageフィールドのZodエラーコードに対応する調味料APIエラーコード
 */
const imageFieldErrorCode = (
  zodErrorCode: ZodErrorCode
): SeasoningAddErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
      return SeasoningAddErrorCode.IMAGE_INVALID_TYPE;
    case "too_big":
      return SeasoningAddErrorCode.IMAGE_TOO_LARGE;
    default:
      return SeasoningAddErrorCode.IMAGE_INVALID_TYPE;
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
 * ZodIssueをSeasoningAddErrorCodeに変換
 */
const issueToErrorCode = (
  issue: ZodError["issues"][0]
): SeasoningAddErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code as ZodErrorCode);
  }

  if (isFieldName(issue.path, "seasoningTypeId")) {
    return seasoningTypeIdFieldErrorCode(issue.code as ZodErrorCode);
  }

  if (isFieldName(issue.path, "image")) {
    return imageFieldErrorCode(issue.code as ZodErrorCode);
  }

  // ガード節: 未知のフィールドの場合
  return SeasoningAddErrorCode.DEFAULT;
};
