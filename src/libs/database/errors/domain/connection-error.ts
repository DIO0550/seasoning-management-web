import { DatabaseError } from "../base/database-error";
import { ErrorCode } from "../base/error-code";
import { ErrorSeverity } from "../base/error-severity";

/**
 * 接続エラークラス
 * データベースとの接続に問題が発生した場合に使用
 */
export class ConnectionError extends DatabaseError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
    code: ErrorCode = ErrorCode.CONNECTION_ERROR
  ) {
    super(message, code, severity, context);
    this.name = "connection-error";
  }
}
