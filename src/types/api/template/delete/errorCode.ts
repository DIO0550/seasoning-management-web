import { ZodError, ZodIssue, ZodIssueCode } from "zod";

// フィールド名の型定義
type FieldName = "id";

/**
 * テンプレート削除APIのエラーコード
 */
export type TemplateDeleteErrorCode =
  | "VALIDATION_ERROR_ID_REQUIRED"
  | "VALIDATION_ERROR_ID_INVALID"
  | "TEMPLATE_NOT_FOUND"
  | "PERMISSION_DENIED"
  | "INTERNAL_ERROR";

/**
 * TemplateDeleteErrorCodeのコンパニオンオブジェクト
 */
export const TemplateDeleteErrorCode = {
  /**
   * ZodのバリデーションエラーからTemplateDeleteErrorCodeにマッピング
   * @param zodError - Zodバリデーションエラー
   * @returns 対応するTemplateDeleteErrorCode
   */
  fromValidationError: (zodError: ZodError): TemplateDeleteErrorCode => {
    // ガード節: issuesが空の場合は早期return
    if (!zodError.issues || zodError.issues.length === 0) {
      return TemplateDeleteErrorCode.DEFAULT;
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
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND" as const,
  PERMISSION_DENIED: "PERMISSION_DENIED" as const,
  INTERNAL_ERROR: "INTERNAL_ERROR" as const,
} as const;

/**
 * idフィールドのZodエラーコードに対応するテンプレート削除APIエラーコード
 */
const idFieldErrorCode = (
  zodErrorCode: ZodIssueCode
): TemplateDeleteErrorCode => {
  switch (zodErrorCode) {
    case "invalid_type":
    case "too_small":
      return TemplateDeleteErrorCode.ID_REQUIRED;
    default:
      return TemplateDeleteErrorCode.ID_INVALID;
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
 * ZodIssueをTemplateDeleteErrorCodeに変換
 */
const issueToErrorCode = (issue: ZodIssue): TemplateDeleteErrorCode => {
  // 各フィールドの変換処理
  if (isFieldName(issue.path, "id")) {
    return idFieldErrorCode(issue.code);
  }

  // ガード節: 未知のフィールドの場合
  return TemplateDeleteErrorCode.DEFAULT;
};
