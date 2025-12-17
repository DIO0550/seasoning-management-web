/**
 * データベーストランザクション関連のエラー型定義
 */

import { DatabaseError } from "./database-error";

/**
 * トランザクションエラー
 */
export class TransactionError extends DatabaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "DB_TRANSACTION_ERROR", context);
  }
}

/**
 * トランザクション関連エラーの型判定ユーティリティ
 */
export const isTransactionError = (
  error: unknown
): error is TransactionError => {
  return error instanceof TransactionError;
};
