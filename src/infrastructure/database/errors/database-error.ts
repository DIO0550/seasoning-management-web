/**
 * データベースエラーの基底クラス
 * すべてのデータベース関連エラーの基底となる抽象クラス
 */

/**
 * データベースエラーの基底クラス
 */
export abstract class DatabaseError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // Error.captureStackTraceが利用可能な場合のみ使用
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * データベースエラーコード
 */
export const DATABASE_ERROR_CODES = {
  CONNECTION_ERROR: "DB_CONNECTION_ERROR",
  TRANSACTION_ERROR: "DB_TRANSACTION_ERROR",
  QUERY_ERROR: "DB_QUERY_ERROR",
  CONFIGURATION_ERROR: "DB_CONFIGURATION_ERROR",
  TIMEOUT_ERROR: "DB_TIMEOUT_ERROR",
  POOL_ERROR: "DB_POOL_ERROR",
} as const;

export type DatabaseErrorCode =
  (typeof DATABASE_ERROR_CODES)[keyof typeof DATABASE_ERROR_CODES];

/**
 * エラー型判定ユーティリティ
 */
export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return error instanceof DatabaseError;
};
