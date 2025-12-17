/**
 * MySQL固有のエラー情報を保持するインターフェース
 */
export interface MySQLError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
  sql?: string;
  fatal?: boolean;
}

/**
 * エラーマッピング時に使用するコンテキスト情報
 */
export interface ErrorContext extends Record<string, unknown> {
  table?: string;
  operation?: string;
  query?: string;
  parameters?: unknown[];
  originalError?: {
    code?: string;
    errno?: number;
    sqlState?: string;
    message: string;
  };
}
