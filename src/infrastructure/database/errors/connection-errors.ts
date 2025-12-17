/**
 * データベース接続関連のエラー型定義
 */

import { DatabaseError } from "./database-error";

/**
 * データベース接続エラー
 */
export class ConnectionError extends DatabaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "DB_CONNECTION_ERROR", context);
  }
}

/**
 * データベース設定エラー
 */
export class ConfigurationError extends DatabaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "DB_CONFIGURATION_ERROR", context);
  }
}

/**
 * データベースタイムアウトエラー
 */
export class TimeoutError extends DatabaseError {
  public readonly timeoutMs: number;

  constructor(
    message: string,
    timeoutMs: number,
    context?: Record<string, unknown>
  ) {
    super(message, "DB_TIMEOUT_ERROR", context);
    this.timeoutMs = timeoutMs;
  }
}

/**
 * データベースプールエラー
 */
export class PoolError extends DatabaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "DB_POOL_ERROR", context);
  }
}

/**
 * 接続関連エラーの型判定ユーティリティ
 */
export const isConnectionError = (error: unknown): error is ConnectionError => {
  return error instanceof ConnectionError;
};

export const isConfigurationError = (
  error: unknown
): error is ConfigurationError => {
  return error instanceof ConfigurationError;
};

export const isTimeoutError = (error: unknown): error is TimeoutError => {
  return error instanceof TimeoutError;
};

export const isPoolError = (error: unknown): error is PoolError => {
  return error instanceof PoolError;
};
