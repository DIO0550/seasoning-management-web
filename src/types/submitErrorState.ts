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
