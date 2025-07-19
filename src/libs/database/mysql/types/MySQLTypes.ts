import type { FieldPacket, SslOptions } from "mysql2/promise";
import type {
  QueryResult,
  ConnectionConfig,
} from "@/libs/database/interfaces/IDatabaseConnection";

/**
 * MySQL固有の型定義とクリーンアーキテクチャ型の変換機能
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
 * MySQLQueryResultのコンパニオンオブジェクト
 */
export const MySQLQueryResult = {
  /**
   * mysql2の結果を独自のQueryResultに変換
   */
  toQueryResult<T>(mysqlResult: MySQLQueryResult<T>): QueryResult<T> {
    return {
      rows: mysqlResult.rows,
      rowsAffected: mysqlResult.affectedRows,
      insertId: mysqlResult.insertId === 0 ? null : mysqlResult.insertId,
      metadata: {
        changedRows: mysqlResult.changedRows,
        warningCount: mysqlResult.warningCount,
      },
    };
  },
} as const;

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
 * MySQLConnectionConfigのコンパニオンオブジェクト
 */
export const MySQLConnectionConfig = {
  /**
   * 独自のConnectionConfigからMySQL設定に変換
   */
  from(config: ConnectionConfig): MySQLConnectionConfig {
    const mysqlConfig: MySQLConnectionConfig = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
    };

    if (config.connectTimeout) {
      mysqlConfig.acquireTimeout = config.connectTimeout;
    }

    if (config.queryTimeout) {
      mysqlConfig.timeout = config.queryTimeout;
    }

    if (config.maxConnections) {
      mysqlConfig.connectionLimit = config.maxConnections;
    }

    if (config.ssl) {
      if (typeof config.ssl === "boolean") {
        // booleanの場合は文字列として扱う（mysql2の仕様に合わせる）
        mysqlConfig.ssl = config.ssl ? "Amazon RDS" : undefined;
      } else {
        // オブジェクトの場合はSslOptionsとして扱う
        mysqlConfig.ssl = config.ssl as SslOptions;
      }
    }

    if (config.options) {
      Object.assign(mysqlConfig, config.options);
    }

    return mysqlConfig;
  },
} as const;

/**
 * MySQL固有のエラー型
 */
export class MySQLError extends Error {
  public readonly type: MySQLErrorType;
  public readonly mysqlCode?: string;
  public readonly mysqlErrno?: number;
  public readonly sqlState?: string;
  public readonly originalError: unknown;

  constructor(
    message: string,
    type: MySQLErrorType,
    originalError: unknown,
    mysqlCode?: string,
    mysqlErrno?: number,
    sqlState?: string
  ) {
    super(message);
    this.name = "MySQLError";
    this.type = type;
    this.mysqlCode = mysqlCode;
    this.mysqlErrno = mysqlErrno;
    this.sqlState = sqlState;
    this.originalError = originalError;
  }
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

/**
 * mysql2エラーから独自エラーを作成
 */
export function createMySQLError(
  error: unknown,
  type: MySQLErrorType
): MySQLError {
  if (isMySQLError(error)) {
    return new MySQLError(
      error.sqlMessage || error.message,
      type,
      error,
      error.code,
      error.errno,
      error.sqlState
    );
  }

  if (error instanceof Error) {
    return new MySQLError(error.message, type, error);
  }

  return new MySQLError("Unknown MySQL error", type, error);
}

/**
 * mysql2のエラーかどうかを判定
 */
function isMySQLError(error: unknown): error is {
  code?: string;
  errno?: number;
  message: string;
  sqlState?: string;
  sqlMessage?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}
