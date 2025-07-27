import type { MySQLErrorType } from "@/libs/database/mysql/types";

/**
 * MySQL固有のエラー処理
 */

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
