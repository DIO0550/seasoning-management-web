import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName =
  | "id"
  | "name"
  | "seasoningTypeId"
  | "imageId"
  | "bestBeforeAt"
  | "expiresAt"
  | "purchasedAt";

/**
 * 調味料更新APIのエラーコード
 */
export type SeasoningUpdateErrorCode =
  | "VALIDATION_ERROR_ID_REQUIRED"
  | "VALIDATION_ERROR_ID_INVALID"
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "VALIDATION_ERROR_TYPE_REQUIRED"
  | "VALIDATION_ERROR_IMAGE_ID_INVALID"
  | "VALIDATION_ERROR_DATE_INVALID"
  | "SEASONING_NOT_FOUND"
  | "DUPLICATE_NAME"
  | "PERMISSION_DENIED"
  | "INTERNAL_ERROR";

/**
 * SeasoningUpdateErrorCodeのコンパニオンオブジェクト
 */
export const SeasoningUpdateErrorCode = {
  /**
   * ZodのバリデーションエラーからSeasoningUpdateErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するSeasoningUpdateErrorCode
   */
  fromValidationError: (zodError: ZodError): SeasoningUpdateErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return SeasoningUpdateErrorCode.DEFAULT;
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
  TYPE_REQUIRED: "VALIDATION_ERROR_TYPE_REQUIRED" as const,
  IMAGE_ID_INVALID: "VALIDATION_ERROR_IMAGE_ID_INVALID" as const,
  DATE_INVALID: "VALIDATION_ERROR_DATE_INVALID" as const,
  SEASONING_NOT_FOUND: "SEASONING_NOT_FOUND" as const,
  DUPLICATE_NAME: "DUPLICATE_NAME" as const,
  PERMISSION_DENIED: "PERMISSION_DENIED" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * idフィールドのZodエラーコードに対応する調味料更新APIエラーコード
 */
const idFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningUpdateErrorCode.ID_REQUIRED;
    default:
      return SeasoningUpdateErrorCode.ID_INVALID;
  }
};

/**
 * nameフィールドのZodエラーコードに対応する調味料更新APIエラーコード
 */
const nameFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningUpdateErrorCode => {
  switch (zodErrorCode) {
    case "too_small":
      return SeasoningUpdateErrorCode.NAME_REQUIRED;
    case "too_big":
      return SeasoningUpdateErrorCode.NAME_TOO_LONG;
    case "custom":
      return SeasoningUpdateErrorCode.NAME_INVALID_FORMAT;
    default:
      return SeasoningUpdateErrorCode.NAME_REQUIRED;
  }
};

/**
 * seasoningTypeIdフィールドのZodエラーコードに対応する調味料更新APIエラーコード
 */
const seasoningTypeIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningUpdateErrorCode.TYPE_REQUIRED;
    default:
      return SeasoningUpdateErrorCode.TYPE_REQUIRED;
  }
};

/**
 * imageIdフィールドのZodエラーコードに対応する調味料更新APIエラーコード
 */
const imageIdFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return SeasoningUpdateErrorCode.IMAGE_ID_INVALID;
    default:
      return SeasoningUpdateErrorCode.IMAGE_ID_INVALID;
  }
};

/**
 * 日付フィールドのZodエラーコードに対応する調味料更新APIエラーコード
 */
const dateFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): SeasoningUpdateErrorCode => {
  switch (zodErrorCode) {
    case "invalid_date":
    case "invalid_string":
      return SeasoningUpdateErrorCode.DATE_INVALID;
    default:
      return SeasoningUpdateErrorCode.DATE_INVALID;
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
 * 日付フィールドかどうかをチェック
 */
const isDateField = (path: (string | number)[]): boolean => {
  return (
    isFieldName(path, "bestBeforeAt") ||
    isFieldName(path, "expiresAt") ||
    isFieldName(path, "purchasedAt")
  );
};

/**
 * ZodIssueをSeasoningUpdateErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): SeasoningUpdateErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "id")) {
    return idFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "name")) {
    return nameFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "seasoningTypeId")) {
    return seasoningTypeIdFieldErrorCode(issue.code);
  }

  if (isFieldName(issue.path, "imageId")) {
    return imageIdFieldErrorCode(issue.code);
  }

  if (isDateField(issue.path)) {
    return dateFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return SeasoningUpdateErrorCode.DEFAULT;
};
