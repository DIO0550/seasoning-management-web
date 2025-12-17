import { DatabaseError } from "../base/DatabaseError";
import { ErrorCode } from "../base/ErrorCode";
import { ErrorSeverity } from "../base/ErrorSeverity";

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
    this.name = "ConnectionError";
  }
}
