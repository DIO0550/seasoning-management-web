/**
 * データベース関連のエラークラス群
 * クリーンアーキテクチャに基づき、具体的なDB実装に依存しない抽象的なエラー型を定義
 */

/**
 * データベース操作の基底エラークラス
 */
export class DatabaseError extends Error {
  public readonly name: string = 'DatabaseError';
  public readonly code: string;
  public readonly cause?: Error;

  constructor(message: string, code: string, cause?: Error) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}

/**
 * データベース接続関連のエラー
 */
export class ConnectionError extends DatabaseError {
  public readonly name: string = 'ConnectionError';

  constructor(message: string, code: string, cause?: Error) {
    super(message, code, cause);
  }
}

/**
 * トランザクション関連のエラー
 */
export class TransactionError extends DatabaseError {
  public readonly name: string = 'TransactionError';

  constructor(message: string, code: string, cause?: Error) {
    super(message, code, cause);
  }
}

/**
 * クエリ実行関連のエラー
 */
export class QueryError extends DatabaseError {
  public readonly name: string = 'QueryError';
  public readonly sql?: string;

  constructor(message: string, code: string, cause?: Error, sql?: string) {
    super(message, code, cause);
    this.sql = sql;
  }
}

/**
 * 型ガード関数群
 */

export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return error instanceof DatabaseError;
};

export const isConnectionError = (error: unknown): error is ConnectionError => {
  return error instanceof ConnectionError;
};

export const isTransactionError = (error: unknown): error is TransactionError => {
  return error instanceof TransactionError;
};

export const isQueryError = (error: unknown): error is QueryError => {
  return error instanceof QueryError;
};

/**
 * 一般的なエラーコード定数
 */
export const DATABASE_ERROR_CODES = {
  // 接続エラー
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',
  
  // トランザクションエラー
  TRANSACTION_BEGIN_FAILED: 'TRANSACTION_BEGIN_FAILED',
  TRANSACTION_COMMIT_FAILED: 'TRANSACTION_COMMIT_FAILED',
  TRANSACTION_ROLLBACK_FAILED: 'TRANSACTION_ROLLBACK_FAILED',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',
  
  // クエリエラー
  SQL_SYNTAX_ERROR: 'SQL_SYNTAX_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT',
  
  // 一般的なエラー
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  TIMEOUT: 'TIMEOUT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

export type DatabaseErrorCode = typeof DATABASE_ERROR_CODES[keyof typeof DATABASE_ERROR_CODES];
