/**
 * データベースクエリ関連のエラー型定義
 */

import { DatabaseError } from "./DatabaseError";

/**
 * クエリ実行エラー
 */
export class QueryError extends DatabaseError {
  public readonly sql?: string;
  public readonly params?: unknown[];

  constructor(
    message: string,
    sql?: string,
    params?: unknown[],
    context?: Record<string, unknown>
  ) {
    super(message, "DB_QUERY_ERROR", context);
    this.sql = sql;
    this.params = params;
  }
}

/**
 * クエリ関連エラーの型判定ユーティリティ
 */
export const isQueryError = (error: unknown): error is QueryError => {
  return error instanceof QueryError;
};
