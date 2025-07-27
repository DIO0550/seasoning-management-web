import type { FieldPacket, SslOptions } from "mysql2/promise";

/**
 * MySQL固有の型定義
 */

/**
 * mysql2のクエリ結果型
 */
export interface MySQLQueryResult<T = unknown> {
  rows: T[];
  fields: FieldPacket[];
  affectedRows: number;
  insertId: number;
  changedRows: number;
  warningCount: number;
}

/**
 * mysql2の接続設定型
 */
export interface MySQLConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  acquireTimeout?: number;
  timeout?: number;
  connectionLimit?: number;
  ssl?: string | SslOptions;
}

/**
 * MySQLエラーの種類
 */
export type MySQLErrorType =
  | "CONNECTION_ERROR"
  | "QUERY_ERROR"
  | "TRANSACTION_ERROR"
  | "TIMEOUT_ERROR"
  | "AUTHENTICATION_ERROR"
  | "UNKNOWN_ERROR";
