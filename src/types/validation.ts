/**
 * @fileoverview バリデーション関連の共通型定義
 */

/**
 * フィールドバリデーションのエラー状態を表す型
 */
export type ValidationErrorState =
  | "NONE" // エラーなし
  | "REQUIRED" // 必須項目未入力
  | "TOO_SHORT" // 文字数不足
  | "TOO_LONG" // 文字数超過
  | "INVALID_FORMAT" // 形式不正
  | "INVALID_FILE_TYPE" // ファイル形式不正
  | "FILE_TOO_LARGE"; // ファイルサイズ超過

/**
 * バリデーションエラー状態の定数
 */
export const VALIDATION_ERROR_STATES = {
  NONE: "NONE" as const,
  REQUIRED: "REQUIRED" as const,
  TOO_SHORT: "TOO_SHORT" as const,
  TOO_LONG: "TOO_LONG" as const,
  INVALID_FORMAT: "INVALID_FORMAT" as const,
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE" as const,
  FILE_TOO_LARGE: "FILE_TOO_LARGE" as const,
} as const;

/**
 * 送信処理のエラー状態を表す型
 */
export type SubmitErrorState =
  | "NONE" // エラーなし
  | "NETWORK_ERROR" // ネットワークエラー
  | "VALIDATION_ERROR" // バリデーションエラー
  | "SERVER_ERROR" // サーバーエラー
  | "UNKNOWN_ERROR"; // 予期しないエラー

/**
 * 送信エラー状態の定数
 */
export const SUBMIT_ERROR_STATES = {
  NONE: "NONE" as const,
  NETWORK_ERROR: "NETWORK_ERROR" as const,
  VALIDATION_ERROR: "VALIDATION_ERROR" as const,
  SERVER_ERROR: "SERVER_ERROR" as const,
  UNKNOWN_ERROR: "UNKNOWN_ERROR" as const,
} as const;
